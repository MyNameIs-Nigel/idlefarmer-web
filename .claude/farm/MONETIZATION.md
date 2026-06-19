# ssh-idlefarmer — Monetization Strategy

*How a free, open-source, password-less SSH game can sustainably make money —
without betraying the cozy, no-friction soul that makes it special.*

> Read alongside `SALES-PITCH.md` (the value) and `TECHNICAL-ANALYSIS.md` (the
> mechanics this plan depends on).

---

## 1. The constraints we have to design around

Be honest up front — these shape everything:

1. **SSH has no checkout.** A terminal UI can't safely take a credit card, and
   there's no app-store billing rail. **All payment happens out of band (on the
   web) and reconciles back to the game via the SSH key fingerprint.**
2. **The code is MIT-licensed.** You can't sell the binary exclusively. Value
   capture must come from *hosting, brand, content, community, and convenience* —
   the things a fork can't clone.
3. **The audience is developers.** They are ad-averse and allergic to
   dark-pattern monetization — but they *reliably pay to support things they
   love* (GitHub Sponsors, indie tools, Patreon, merch) and pay *well* for
   tooling their team uses.
4. **It's a cozy idle game.** Aggressive pay-to-win would poison the brand. The
   monetization must feel like *supporting a creator* and *expressing identity*,
   not *buying power*.

These aren't reasons it can't make money. They're the spec for *how* it should.

---

## 2. The architectural unlock: the web app **is** the cash register

The single most important idea in this document:

> **The SSH game stays a pure game. This Next.js web app becomes the storefront,
> the account portal, and the bridge to a wallet. The key fingerprint is the
> join key between them.**

The flow that makes everything below possible:

1. A player runs the game. The TUI shows them their key fingerprint
   (`SHA256:…`) and/or a short, single-use **claim code**.
2. They visit the website, pay with **Stripe** (Payment Links / Checkout — no
   custom billing code needed), and paste their fingerprint or claim code.
3. The web app writes a `supporter`/entitlement record keyed by that
   fingerprint into the shared store (or a small companion table).
4. Next time they connect, the game reads their entitlement and unlocks their
   perks. No passwords, no accounts, no PII — same trust model as the game.

This keeps the beloved zero-friction game *exactly* as it is, while giving the
business a clean, conventional payment surface. It's also why this repo should
exist as more than a landing page.

---

## 3. The strategy at a glance

Three revenue pillars, in rough order of effort-to-first-dollar:

| Pillar | What it is | Who pays | Why it fits |
| --- | --- | --- | --- |
| **A. Support the maker** | Tips, supporter tier, merch, sponsors | Individual fans | Dev audience loves backing things they enjoy; zero pay-to-win |
| **B. Seasons & cosmetics** | Recurring cosmetic content & passes | Engaged players | Recurring revenue without selling power |
| **C. Farm-as-a-Service (B2B)** | Hosted, branded private farms for communities/companies | Orgs & creators | Highest-margin, biggest ceiling; sells the *operational elegance* |

---

## 4. Pillar A — Support the maker (quick wins, low risk)

### A1. Tip jar / GitHub Sponsors / Ko-fi  *(ship this week)*
The lowest-effort dollar. A tasteful "Support the farm" link on the website and
in the README; an optional in-game line ("This farm is supporter-funded — keep
it growing at …"). Costs nothing, fits the open-source norm, and starts
validating willingness to pay.
- **Effort:** trivial · **Risk:** none · **Revenue:** modest but immediate.

### A2. "Patron's Plot" supporter tier  *(the flagship consumer offer)*
A one-time or recurring purchase (suggest **$5–10/mo** or a **$25 lifetime**)
that unlocks *identity and convenience, never raw power*:
- A **Patron badge** in the *Daily Furrow* and on the Stats screen.
- **Cosmetic farm themes / palettes** and decorative skins (golden scarecrow,
  seasonal plot art, custom farm-name colors).
- **Extra save slots** — free players get a couple; patrons get many. This is
  *trivial* to gate because a slot is literally a username under a key, and
  it's a genuine convenience (separate experimental farms) with no competitive
  impact.
- Cosmetic-only **flavor crops** and exclusive *Daily Furrow* headlines.
- **Founder tier**: first N supporters get a permanent name in a credits
  headline rotation. Scarcity drives early conversion.
- **Effort:** medium (Stripe + fingerprint entitlement + a few cosmetic content
  flags — all of which the TOML content system already supports) · **Risk:**
  low (no pay-to-win) · **Revenue:** the core recurring consumer line.

### A3. Merch  *(brand-led, near-zero risk via print-on-demand)*
The aesthetic is *built* for merch: "Turnip Magnate" tees, enamel pins of
Moonberry / Voidlotus / Glimmercorn, terminal-green stickers, a *Daily Furrow*
poster. Print-on-demand (Printful/Cotton Bureau) means no inventory risk, and
the website already has to exist to sell it.
- **Effort:** low–medium · **Risk:** low · **Revenue:** modest, but high brand
  value and great viral artifacts.

---

## 5. Pillar B — Seasons & cosmetics (recurring, content-driven)

### B1. "Almanac Seasons" (the battle-pass equivalent, done cozily)
Because **balance and crops live in hot-swappable TOML** (no recompile needed),
you can run rotating seasons cheaply: a themed limited-time crop set, seasonal
cosmetic goals, and a leaderboard reset. Offer a **free track** plus a small
**premium track** (~$5/season) of cosmetic rewards.
- **Effort:** medium (needs a seasonal-content loader + leaderboard) · **Risk:**
  medium — must stay cosmetic to avoid the pay-to-win trap · **Revenue:**
  recurring, scales with engaged-player count.

### B2. Sponsored / branded events
The same TOML hot-swap means a sponsor can fund a **time-boxed branded event** —
a conference's logo crop during its event week, a launch tie-in, a charity
fundraiser crop. Cosmetic and temporary, so it never warps the economy.
- **Effort:** low (you already have the events system) · **Risk:** low if kept
  tasteful · **Revenue:** lumpy but high-margin; also a B2B lead source.

### B3. Cross-promotion & affiliate (soft)
A developer-tool audience is valuable. Tasteful, relevant affiliate links on the
site (terminal apps, fonts, hosting) or a sponsor slot in the *Daily Furrow*
ticker — opt-in and clearly cosmetic. Use sparingly; the brand's restraint is an
asset.

---

## 6. Pillar C — Farm-as-a-Service (the real ceiling)

This is where the *operational elegance* (one binary, one SQLite file, hardened
container, near-zero running cost) becomes a business, not just a nicety.

### C1. Hosted private farms for communities  *(flagship B2B)*
Sell **managed, branded farm servers** to communities, creators, hackerspaces,
universities, and companies that want their own gently-competitive ritual:
- Their own endpoint (`ssh farm.acme.dev`), their **own branding and custom
  crops** via the TOML override, and a **shared leaderboard** for their members.
- Tiered by active-player count or seats: e.g. **Community $19/mo**, **Pro
  $99/mo**, **Enterprise** custom.
- Because each instance is one cheap, hardened container with one data file,
  gross margins are excellent and ops are trivial.
- **Effort:** medium–high (provisioning, billing, a thin admin surface) ·
  **Risk:** medium (it's a real SaaS) · **Revenue:** the highest ceiling here.

### C2. Team-building / engagement tool angle
Position the same hosted product to companies as a **dev-team engagement / new
-hire onboarding** toy ("plant your onboarding turnip"), a **conference booth
attraction** (a leaderboard at your booth — anyone with a laptop can play
instantly, no install), or a **community-growth ritual** for DevRel teams. Same
tech, higher-value buyer, justifies the Pro/Enterprise tiers.

### C3. Open-core commercial add-ons
Keep the MIT core free; sell a **commercial layer** for orgs that need it:
- SSO/LDAP or org-managed key provisioning, an **admin dashboard**, Prometheus
  metrics, audit/export, multi-region, and an **SLA + support** contract.
- This is the classic open-core model: hobbyists self-host free; companies pay
  for the operational and support wrapper they'd never build themselves.
- **Effort:** high · **Risk:** medium · **Revenue:** large per-deal, slow to
  build — a later-stage play once Pillars A/C1 prove demand.

### C4. Notifications & integrations (engagement + upsell)
An opt-in **Discord/Slack bot** ("🌾 your Starfruit is ready", "the farm is back
up") or email digest. Solves the "no contact channel" gap from the technical
analysis, drives retention, and can be a premium/Pro feature. Doubles as a
viral surface when farm milestones post to a community channel.

---

## 7. What NOT to do (guardrails)

- ❌ **No pay-to-win.** Don't sell coins, Starseeds, time-skips, or power
  upgrades to free players. It would alienate the cozy, dev-savvy audience and
  cheapen the brand permanently. *Sell identity, convenience, and content — not
  the climb.*
- ❌ **No ads in the TUI.** The clean terminal experience is the product. Keep
  commerce on the web and cosmetic-only in-game.
- ❌ **No mandatory accounts.** The password-less, PII-free model is a feature
  and a trust signal. Any web account/linking must stay strictly optional.
- ❌ **Don't gate the core loop.** The free game must stay genuinely complete and
  delightful — that's the top of the funnel for everything paid.

---

## 8. Recommended sequence (first 90 days)

1. **Week 1–2:** Ship the website (this repo) as the billboard for the one-liner
   + a tip jar / Sponsors link (A1). Start the funnel and validate intent.
2. **Week 3–6:** Build the **fingerprint → entitlement bridge** (Stripe Checkout
   + claim-code linking). It's the foundation for every paid tier. Launch the
   **Patron's Plot** supporter tier (A2) with cosmetics + extra save slots.
3. **Week 6–10:** Add **merch** (A3, print-on-demand) and the first **Almanac
   Season** (B1) to create a recurring content beat and recurring revenue.
4. **Quarter 2:** Pilot **hosted private farms** (C1) with one friendly
   community to prove the B2B motion; line up a **branded/sponsored event** (B2)
   as a marketing + revenue moment.
5. **Later:** Pursue **open-core enterprise** (C3) only once hosted demand is
   proven.

---

## 9. Illustrative revenue scenarios

*Rough, clearly-hypothetical models to size the opportunity — not forecasts.
They assume a viral launch puts a few thousand curious developers through the
one-liner.*

- **Hobby / break-even:** 10,000 players, 2% become supporters at ~$5/mo →
  **~$1,000/mo**. Comfortably covers hosting (which is near-zero) and funds
  content. Plausible for a single popular dev-community hit.
- **Sustainable side-business:** 50,000 lifetime players, 3% supporters at
  ~$6/mo (~$9k/mo) + seasons + merch + a handful of hosted community servers at
  $19–99/mo → **roughly $10–15k/mo**. A real income for a solo maker.
- **Upside:** the above **plus** a working **Farm-as-a-Service** B2B motion (tens
  of community/Pro instances, a few enterprise/open-core deals, sponsored
  events). B2B contracts, not consumer tips, become the dominant line and push
  this into **multiple tens of thousands/mo**.

The shape to remember: **consumer support keeps the lights on and feeds the
funnel; B2B hosting is where the real money is.** Both ride the same cheap,
elegant binary.

---

## 10. The one-paragraph version

ssh-idlefarmer can't take money inside SSH and can't sell its open-source code —
so monetize the things a fork can't copy: the brand, the hosting, the content
cadence, and the community. Use this web app as the storefront and the key
fingerprint as the bridge. Start with a tip jar and a cosmetic, no-pay-to-win
**Patron** tier; add seasons and merch for recurring revenue; and build toward
**hosted, branded private farms for communities and companies** as the real
business. Keep the free game pristine — it's the most effective marketing you'll
ever have.
