# ssh-idlefarmer — Technical Analysis

*How the product actually works, written for engineers, technical investors, and
whoever builds this web companion.*

---

## 1. What it is, in one sentence

**ssh-idlefarmer** is a cozy idle/incremental farming game with no website, no
client to install, and no password: you connect over SSH, your public key *is*
your account, and a full terminal UI (TUI) is the only thing the connection can
reach.

```bash
ssh farm.example.com            # your default farm
ssh otherfarm@farm.example.com  # a second farm under the same key
```

That's the entire onboarding flow. There is no sign-up form, no email
verification, no OAuth, no app store. The friction from "I heard about this" to
"I'm playing" is a single command that ~every developer already has installed.

---

## 2. The core insight

Three design decisions do all the heavy lifting:

1. **The SSH public key is the identity.** Authentication is *trust-on-first-use*:
   the server accepts any non-nil key and creates an account keyed by the key's
   `SHA256:` fingerprint on first contact (`internal/identity`,
   `wish.WithPublicKeyAuth`). Password auth is explicitly rejected; a keyless
   client fails at the SSH protocol layer before any game code runs.
2. **The SSH username selects a save slot *within* that key.** `ssh
   alice@host` and `ssh bob@host` from the *same* key open two different farms;
   two different people who both use `alice@` still get separate farms because
   their keys differ. No slot name can ever address another key's data — the
   save's primary key is `(fingerprint, slot)`.
3. **The TUI is the only reachable surface.** There is no shell, no file
   transfer, no port forwarding exposed to the player. The session lands
   directly in a Bubble Tea program and can do nothing else.

The result is an account system with zero credential storage, zero password
reset flow, and zero PII — the cryptographic key the user already manages *is*
the account.

---

## 3. Stack

| Layer | Choice | Why it matters |
| --- | --- | --- |
| Language | **Go 1.26+**, pure Go, `CGO_ENABLED=0` | One static binary, trivial cross-compile, no libc dependency |
| SSH server | **charm.land/wish/v2** (wraps `charmbracelet/ssh`) | Middleware-based SSH framework; the whole server is a composed handler chain |
| TUI | **bubbletea/v2 + lipgloss/v2** | The Elm-architecture terminal UI rendered to the PTY |
| Storage | **modernc.org/sqlite** | cgo-free SQLite driver — keeps the "pure Go static binary" promise |
| Packaging | **Docker** distroless static image | No shell, no package manager, minimal attack surface |

---

## 4. The request path (one connection, end to end)

Middleware in Wish runs **bottom-up**, so the composed chain executes in this
order on an inbound connection (`internal/server/server.go`):

```
logging → rate limiter → session caps → RequirePTY → attachSave → Bubble Tea handler
```

1. **logging** — structured `slog` line per session.
2. **rate limiter** — per-IP token bucket (`IDLEFARM_RATE_LIMIT_PER_SECOND`,
   default 2, burst 5, up to 1000 tracked IPs) to blunt connection floods.
3. **session caps** — global concurrent-session ceiling
   (`IDLEFARM_MAX_CONNECTIONS`, default 100) and per-key ceiling
   (`IDLEFARM_MAX_SESSIONS_PER_KEY`, default 2).
4. **RequirePTY** — a real interactive terminal is required; non-PTY clients are
   turned away (the game needs a render surface).
5. **attachSave** — resolves `(fingerprint, slot)`, asks the game `Manager` to
   open the save, applies **offline catch-up**, and stashes the session state on
   the `ssh.Context`.
6. **Bubble Tea handler** — builds the per-session UI model and runs it.

This ordering is load-bearing and called out in the code: logging and rate
limiting stay outermost, `attachSave` stays adjacent to the UI.

---

## 5. The simulation engine (the crown jewel)

`internal/sim` is a **headless, deterministic game engine** with a hard purity
rule that is the single most important engineering decision in the project:

> The engine never reads the wall clock and never does I/O. Every state
> transition is a pure function of `(state, content, timestamps)`. All
> randomness flows from a seeded RNG stored *inside the save*.

Concretely:

- **Deterministic RNG.** Each save carries a `splitmix64` state (`State.RNG`).
  Every roll advances it; `roll100`, `rollBp` (basis points, for sub-percent
  per-second odds), and `rollRange` are the only randomness sources. Given the
  same save and the same timestamps, the outcome is **bit-for-bit
  reproducible** — which makes the game replayable, testable, and resistant to a
  whole class of "reroll the dice" cheating.
- **Offline catch-up is a single computation.** When you reconnect, the manager
  calls `sim.Advance(state, content, now)`. `Advance` simulates everything that
  "happened" between the save's `UpdatedAt` and now — crops maturing, automated
  plots harvesting and replanting, gifts arriving, random events, scarecrow
  income — in one pass, then reports an `Events` summary used to render the
  "welcome back" screen. Time can never be replayed twice because `UpdatedAt`
  is the implicit "from" cursor.
- **Bounded catch-up for very long absences.** Auto-harvesting plots are
  simulated cycle-by-cycle up to `autoCycleCap` (50,000) per `Advance`; beyond
  that the engine switches to a closed-form **expected-value batch** (mean
  payout × remaining cycles) so a player who returns after months doesn't hang
  the server in a multi-million-iteration loop. The per-plot `PlantedAt` doubles
  as a resumable cursor, so any remainder settles on the next `Advance`.
- **Overflow-safe money.** All coins are `int64`, and addition/multiplication go
  through `satAdd`/`satMul` that **saturate at `MaxInt64`** instead of wrapping.
  A farm left running for years can never flip into a negative balance.
- **Versioned, self-upgrading saves.** The save payload has a `StateVersion`
  (currently 4). `DecodeState` refuses payloads from a *newer* version (safe
  downgrade guard) and runs `upgradeState` to migrate older payloads forward in
  place — e.g. v2→v3 migrated global auto-tools into per-plot flags. Old saves
  keep working across releases.

This purity is why the test suite can assert exact economic outcomes and why
offline progress is trustworthy: it's the same code path, just with a longer
time delta.

---

## 6. Concurrency: the single-writer actor model

Each *active* save is owned by **exactly one goroutine** — an "actor"
(`internal/game/actor.go`, registry in `manager.go`):

- The `Manager` holds a map of `(fingerprint, slot) → actor`. All mutation of a
  save funnels through `actor.do(func())`, so there is never concurrent access
  to a save's state and no per-field locking inside the engine.
- **Opening the same save twice** is governed by `IDLEFARM_SESSION_POLICY`:
  - `takeover` (default): the new session wins; the old one gets a polite
    "your farm was opened elsewhere, signing off" kick.
  - `refuse`: the newcomer is turned away with "this farm is already open."
- The registry is **process-local by design**: a restart clears all in-memory
  locks automatically — there's no distributed lock to get wedged.
- **Autosave** runs every `IDLEFARM_AUTOSAVE_INTERVAL` (default 30s) while
  connected; saves are also flushed on disconnect.

This is a clean concurrency story: the hard part of a multiplayer-ish server
(shared mutable state) is sidestepped because each farm is single-tenant and
single-writer.

---

## 7. Persistence

- **One SQLite file**, WAL mode, single connection. Schema (`internal/store`):
  `accounts` keyed by fingerprint, `saves` keyed by `(fingerprint, slot)` with
  the game state as a versioned JSON BLOB.
- **Append-only, transactional migrations.** The schema version lives in
  SQLite's `user_version` pragma; each migration runs in a transaction with its
  own version bump, so a crash mid-migration leaves the DB at the prior version.
  Migrations are forward-only and never destructive.
- **Two save-version concepts** coexist cleanly: the *SQL schema* version
  (`user_version`) and the *payload* version (`StateVersion` inside the JSON).
  The store exposes a `state_version` column for operators; `internal/sim`
  upgrades the payload on load.
- **Backups** are "one file" simple: stop briefly for a clean flush, tar the
  volume, restart — or use SQLite online backup against the live WAL DB.

---

## 8. Security & operational posture

This is unusually hardened for an indie game:

- **No PII, no passwords.** The only stored identity is a key fingerprint plus
  the public key (for auditing). Nothing to leak in a breach beyond public keys
  and farm progress.
- **Graceful shutdown is load-bearing.** SIGTERM (e.g. Docker stop) triggers a
  shutdown hook that *flushes every active save before exit*; the registry stops
  accepting new attaches mid-flush, and compose grants `stop_grace_period: 45s`.
  A redeploy loses nothing.
- **Docker runtime is locked down.** Distroless static base, runs as non-root
  (uid 65532), read-only root filesystem, all Linux capabilities dropped,
  `no-new-privileges`, CPU/memory limits, a single published port. The only
  writable paths are the data volume and `/tmp`.
- **The SSH host key persists on the volume** alongside the DB, so redeploys
  don't trigger scary "host key changed" warnings for returning players.
- **Abuse controls** are first-class: rate limiting, connection caps, idle
  timeout (`IDLEFARM_IDLE_TIMEOUT`, default 30m — enforced inside the UI because
  the once-a-second render keeps the transport busy).

---

## 9. Content & balance: data, not code

Game balance lives in **TOML, not Go** (`data/crops.toml`, `data/balance.toml`),
embedded into the binary at build time but overridable at runtime via
`IDLEFARM_DATA_DIR`. This is the most commercially important architectural fact
in the whole project (see `MONETIZATION.md`): **you can re-skin, re-balance,
add seasonal crops, or run a branded event by swapping a text file — no
recompile, no redeploy of code.**

The content system already models: crops (with `fast`/`slow`/`risky`
archetypes, grow time, sell value, fail chance, salvage, and unlock gates),
prestige permanent upgrades, run-scoped multipliers, per-crop "Hardier Strain"
upgrades, zones, timed random events, automation costs, gift cadence, golden
harvests, moon phases, critters, the scarecrow, achievements, and newspaper
headlines.

---

## 10. The game underneath (more depth than "idle game" implies)

- **13 crops** spanning grow times from 60s (Turnip) to 12 hours (Voidlotus /
  Dewmelon), gated by lifetime earnings, prestige level, or owning the
  Greenhouse zone. "Patience pays": profit-per-second rises with grow time.
- **Per-plot automation**: auto-harvest and auto-sow (with an overridable
  queued crop, so an automated plot can switch what it replants) bought with
  in-game coins.
- **Market**: run-scoped multipliers (Fertilizer = faster growth, Merchant's
  Scale = higher sale price), per-crop salvage upgrades, a **Scarecrow** that
  auto-shoos critters for coins online and trickles a small passive income
  offline, and the **Greenhouse** zone (+6 plots, exotic crops).
- **Land**: buy up to 10 plots (cost grows 170% each), +6 from the Greenhouse →
  a 16-plot farm.
- **Prestige / Rebirth**: reset a mature run for **Starseeds**, awarded as
  `isqrt(run_earnings / 100)` — a classic square-root prestige curve gated
  behind a 10,000-coin minimum. Starseeds buy permanent upgrades in the
  **StarShop** (faster growth, better prices, bigger starting wallet, cheaper
  land, more gifts, more/longer events).
- **Live texture**: timed events (Market Day, Bumper Demand, Warm Front), gift
  parcels, 1%-chance golden harvests (×100 payout), a 28-day moon cycle that
  buffs Moonberry on the full moon, lucky "discoveries," cosmetic critter
  visits, and rotating *Daily Furrow* headlines.
- **Anti-frustration design**: a first-run skippable tutorial (per slot), and a
  "mercy plant" rule — if you're broke with empty plots, the cheapest seed
  plants for free. The game *never punishes* you for being away.

This is a genuinely complete, well-tuned incremental game — not a tech demo.

---

## 11. Quality signals

- **Determinism + table-driven tests** across nearly every package
  (`*_test.go`), including the engine, store, identity, server, and TUI.
- **Saturating arithmetic and overflow guards** in every cost/payout curve —
  someone thought about the 10-year save.
- **Backward-compatible save migrations** already exercised through 4 versions.
- **Clean layering**: pure engine ⟂ I/O (store) ⟂ transport (server) ⟂
  presentation (TUI). The engine could be lifted into a different front-end
  (web, Discord bot, mobile) with no changes — a fact the monetization plan
  leans on heavily.
- **Operational maturity**: graceful shutdown, autosave, WAL backups, hardened
  container, structured logging, configurable everything via `IDLEFARM_*` env.

---

## 12. Limitations & risks (honest)

- **No payment surface inside SSH.** A TUI can't safely take a credit card, and
  there's no app-store billing rail. Monetization must happen *out of band*
  (the web companion) and reconcile back via the key fingerprint. This is the
  central commercial constraint — and the reason this web repo exists.
- **No contact channel.** With no email, you can't notify players ("your
  Starfruit is ready," "we're back up") without an opt-in linking step.
- **MIT licensed.** The code is open; you cannot sell the binary exclusively.
  Value capture has to come from *hosting, brand, content, community, and
  convenience*, not the source. (See open-core discussion in `MONETIZATION.md`.)
- **Single-node by construction.** One SQLite file + process-local actor
  registry is wonderfully simple but doesn't horizontally scale a single farm
  population across machines without rework. For the expected scale (cozy
  community servers) this is a feature, not a bug.
- **Discovery is the funnel risk.** The product spreads by word of mouth and
  "type this command" novelty; without a marketing surface (this site) the
  brilliant onboarding has nowhere to send people.

---

## 13. How this connects to `idlefarmer-web`

The SSH game has no front door on the web — and SSH can't take payments. This
Next.js app is the missing half:

- **Top of funnel**: the landing page that turns "I saw a tweet" into "I ran
  `ssh farm…`." The product's killer feature (the one-line demo) needs a page to
  show it off.
- **The commerce + identity bridge**: the key fingerprint is the natural join
  key between web and game. A supporter checks out on the web, claims their
  public key (or an in-game code), and the game reads their supporter status
  from the shared store. The TUI stays a pure game; the web app holds the
  storefront, account portal, and any contact/notification opt-in.

In short: **the SSH binary is the product; this web app is the storefront, the
billboard, and the bridge to a wallet.**
