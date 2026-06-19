# ssh-idlefarmer — The Ultimate Sales Pitch

> **Your terminal is now a farm.** No download. No password. No sign-up.
> One command, and crops start growing — even after you close the lid.
>
> ```bash
> ssh farm.example.com
> ```

---

## The 10-second pitch

Every developer on earth already has the only client they need: `ssh`. We turned
that one command into a cozy, never-ending farming game. Your SSH key is your
account — so there's no form, no email, no friction. You plant, you walk away,
your farm keeps growing, and you come back to a quiet little world that's glad
to see you. **The shortest distance between "I'm curious" and "I'm playing" is
one line you can paste into any terminal.**

---

## Why this is special

Most games spend their entire marketing budget fighting the install funnel:
landing page → app store → download → account → tutorial → *maybe* a player.
We deleted the funnel.

- **Zero install.** It runs in a tool that's already on macOS, Linux, and modern
  Windows. Nothing to download, nothing to update, nothing to trust beyond a
  single connection.
- **Zero sign-up.** Your SSH public key *is* your identity. No password to
  forget, no email to verify, no personal data to leak. First connection creates
  your farm automatically.
- **Infinitely shareable.** The entire product is a string you can put in a
  tweet, a README, a conference slide, or a Slack message — and it works the
  instant someone pastes it. The call-to-action *is* the product.
- **It respects your time.** It's an idle game done kindly: crops grow while
  you're gone, you're **never** punished for being away, and if you're ever flat
  broke the next seed is on the house. Come back in five minutes or five days —
  there's always something waiting.

This is the rare product where the *distribution mechanism* and the *delight*
are the same thing. People don't just play it; they screenshot the one-liner and
dare their friends to try it.

---

## What you actually do

A genuinely deep incremental game hides behind that humble prompt:

- 🌱 **Plant & harvest** across a living farm — watch crops fill in live, harvest
  everything with one key, replant your whole field with another.
- 🤖 **Automate** individual plots with auto-harvest and auto-sow so your farm
  runs itself while you're at work.
- 🏪 **Shop the Market** for growth boosters, better prices, hardier strains for
  your risky high-value crops, and a **Scarecrow** that guards the fields and
  banks coins while you sleep.
- 🌾 **Grow your land** from 3 plots to a 16-plot homestead, including a glass
  **Greenhouse** full of exotic crops.
- ✨ **Rebirth** a mature farm into **Starseeds** — a cosmic prestige currency —
  and spend them on permanent upgrades that make every future run faster and
  richer.
- 🌕 **Discover the little things**: market-day sales, golden harvests worth 100×,
  full-moon Moonberries, parcels at the gate, lucky finds in the soil, and
  headlines from *The Daily Furrow* ("LOCAL FARMER REPORTS UNUSUALLY LARGE
  TURNIP").

Thirteen crops, from the humble 60-second Turnip to the 12-hour Voidlotus.
Achievements. A farm you can name. A short, skippable tutorial. It's small the
way a good poem is small — every part earns its place.

---

## Who it's for

- **Developers, sysadmins, and terminal-dwellers** — the people who live in a
  shell and love a beautiful, clever hack. This is *their* game, in *their*
  environment, speaking *their* language.
- **The "second monitor" idle-game audience** — Cookie Clicker, Universal
  Paperclips, Melvor Idle players who want something ambient that rewards
  checking in.
- **Communities & teams** — hackerspaces, dev Discords, universities, and
  companies that want a low-effort, shared, gently competitive ritual. (Each
  community can run its own private farm server.)

---

## Why it spreads (the growth engine)

The product is built for word of mouth in the exact channels where it thrives:

1. Someone posts `ssh farm.example.com`.
2. A curious developer pastes it — **because the cost of trying is one command.**
3. They're charmed, they screenshot it, they post the one-liner themselves.

There is precedent for *exactly* this loop converting:

- **`ssh terminal.shop`** — a real company (Terminal Coffee) that sells actual
  coffee entirely over SSH. Proof that the channel is novel enough to go viral
  *and* serious enough to take money.
- **`sshtron`** — a multiplayer Tron game over SSH that went viral on Hacker News
  years ago, on the novelty alone.
- **Charm's ecosystem** (the makers of the very SSH/TUI libraries this is built
  on) has a large, devoted developer following primed to love this.

We sit at the intersection of two proven things: the **terminal-novelty hit**
and the **idle-game retention machine**. The first gets you the front page; the
second keeps people coming back for months.

---

## The moat

- **Brand & taste.** The code is open source, but "the cozy SSH farm everyone
  knows" is a brand, a community, and a content cadence — none of which a fork
  can copy.
- **Operational elegance.** The whole thing is one static binary and one SQLite
  file in a hardened, distroless container. It costs almost nothing to run, which
  means margins on any paid tier are excellent and uptime is easy.
- **A content pipeline, not a code pipeline.** Crops, events, balance, and
  seasonal themes live in editable data files — so we can ship fresh content,
  branded events, and seasons *without shipping code*. (See `MONETIZATION.md`.)
- **An engine that travels.** The game logic is a pure, deterministic core. The
  same brain could power a web client, a Discord bot, or a mobile app later — the
  SSH farm is the beachhead, not the ceiling.

---

## The ask

ssh-idlefarmer is a finished, polished, delightful game with a built-in viral
loop and almost-zero running cost. What it's missing is a **front door** and a
**wallet** — which is exactly what this web companion provides: the page that
shows the world the one-liner, and the bridge that lets the people who love it
support it.

**Give it a billboard and a tip jar, and let the terminal do the rest.**

*See `TECHNICAL-ANALYSIS.md` for how it works and `MONETIZATION.md` for how it
pays for itself.*
