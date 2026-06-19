# SSH-Arcade — Website Design Research

*A design brief for the SSH-Arcade landing site: mobile-first, full-stack
Next.js, donation-funded, "speak by design, not text." Farm is the first and
most-showcased cabinet; the arcade is the brand that will hold many terminal
games over time.*

> Companion to `farm/SALES-PITCH.md`, `farm/TECHNICAL-ANALYSIS.md`, and
> `farm/MONETIZATION.md`. This doc is arcade-level on purpose — it lives at the
> `.claude/` root because it governs the brand shell that every future game
> sits inside.

---

## 1. Who we're actually designing for

Get this right and the rest follows. The realistic visitor is one of:

- **The terminal native** — developers, sysadmins, students, hacker-culture
  folks. They found us on Hacker News, a dev Discord, Lobsters, Mastodon, or a
  friend's `ssh` one-liner.
- **The idle-game enjoyer** — Cookie Clicker / Universal Paperclips / Melvor
  crowd, often overlapping with the above.
- **The curious bystander on a phone** — saw a screenshot, tapped through. Can't
  even run `ssh` right now, but can be charmed into bookmarking it.

What this audience **loves**: craft, restraint, cleverness, authenticity,
keyboard-friendliness, a thing that obviously "gets it," and being trusted with
intelligence rather than sold to.

What this audience **instantly distrusts**: marketing-speak, fake urgency,
anything that smells templated or auto-generated. They have a finely tuned
"this was made by a growth team" detector. Win them by *showing you're one of
them*.

---

## 2. The "AI-built / Wix-template" smell test — things to refuse

To not feel generic, name the clichés and ban them. If the site has these, this
audience checks out:

- ❌ Purple→blue (or teal→indigo) diagonal **gradient hero** with a vague
  3-word headline like "Play. Idle. Repeat."
- ❌ **Glassmorphism cards** in a 3-up "Features" grid with a tiny icon on each.
- ❌ **Inter / Geist everywhere**, centered, with generous-but-characterless
  whitespace (the default `create-next-app` look this repo currently ships).
- ❌ Floating 3D blobs / abstract gradient meshes / "aurora" backgrounds.
- ❌ Emoji-bullet feature lists as the main content.
- ❌ A generic "Trusted by" logo strip and a fake testimonial carousel.
- ❌ Stock motion: fade-up-on-scroll on every single element, identically.

The antidote isn't "more design." It's **a specific point of view** executed
with craft, plus **one or two signature interactions** that no template ships
with.

---

## 3. The north star: "speak by design, not text"

The design should *demonstrate* the product before any paragraph explains it.
For an arcade of terminal games, that means: **the visitor should do, hear, or
watch something that makes them feel the product in the first 3 seconds** — a
command typing itself, a turnip sprouting as they scroll, a coin dropping with a
satisfying *clink*. Copy exists to confirm what the design already said, not to
carry the message.

A reusable test for every screen: *if you deleted all the body copy, would the
visitor still get it?* On a good page here, the answer is yes.

---

## 4. Three distinct directions

Each is a genuinely different point of view — not three skins of one idea. For
each: the concept, the signature interaction, the craft specifics, the
mobile-first plan, how Farm is showcased, how donations are asked honestly, the
Next.js build approach, why it dodges the AI-template smell, and the trade-offs.

---

### Direction A — "The Living Terminal" (do-it, don't-say-it)

**Concept.** The page *is* a terminal, and it's alive. No hero headline — the
first thing the visitor sees is a cursor that **types the `ssh` command itself**,
then hands them the keyboard. The arcade reveals itself as `stdout`. The product
isn't described; it's *operated*.

**Signature interaction — the playable hero.** Embed a tiny, **real** playable
slice of Farm right in the page. The cleverest path: the game's simulation
engine is already pure, deterministic, I/O-free Go (see
`farm/TECHNICAL-ANALYSIS.md` §5) — **compile `internal/sim` to WebAssembly** and
run the *actual engine* in the browser. So the demo isn't a faked mockup; it's
the real game, and devs will notice and love that. Plant a turnip in the hero,
watch it grow on a sped-up clock, harvest it — then the cursor types
`ssh farm.ssh-arcade.dev` and invites the real thing.

**Craft specifics.**
- **Type:** a monospace with *character*, not the default — e.g. **Departure
  Mono** (free, pixel-flavored) or **Berkeley Mono** for body, paired with **one
  characterful display face** for section markers so it doesn't read as "I just
  picked a terminal font." Avoid mono-everything monotony.
- **Color:** reject green-on-black cliché. Either a **warm phosphor** scheme
  (near-black `#100f0d`, one amber/cream accent) *or* invert expectations with a
  **light terminal** (paper-white bg, ink text, single accent) — much fresher
  than dark-green and easier on phones.
- **Motion:** a real blinking caret, autotyping with believable cadence
  (variable per-char delay, occasional micro-pause — not robotic), and a subtle,
  *optional* CRT bloom/grain toggled by a `crt: on/off` switch. Keep scanlines
  whisper-quiet or off; overdone CRT is its own cliché.

**Mobile-first.** Phones have no keyboard and a tiny viewport, so the terminal
**plays itself by default**: the autotype demo runs hands-free, and Farm's demo
uses big tap targets ("PLANT", "HARVEST") rendered as on-screen "soft keys"
rather than expecting typed input. The `ssh` command gets a one-tap **copy
button** (most won't have a terminal on their phone — so the mobile CTA is
"copy & email it to yourself" / "remind me").

**Farm showcase.** Farm *is* the boot sequence — it's what the terminal loads
first. Other games appear as additional entries in a `ls /arcade` listing or a
selectable menu, clearly "coming soon," with Farm front and lit.

**Honest donations.** Framed as a command and its output:
`$ arcade donate` → prints a sincere, short note about server costs and a real
total. No modal guilt-trip. A `supporters.txt`-style opt-in wall of names is
perfectly on-theme.

**Next.js build.** App Router; `xterm.js` for the terminal surface or a custom
canvas/DOM renderer; the WASM sim loaded lazily and only on capable
viewports; autotype/scroll choreography via a small state machine; everything
gated behind `prefers-reduced-motion`.

**Why it won't feel AI-built.** Templates never ship a real playable engine, and
the "no headline, the cursor speaks first" move is the opposite of the gradient-
hero default. It's the purest expression of "speak by design."

**Trade-offs.** Highest build effort and the most performance/QA care (WASM
payload, mobile fallbacks). Strongest authenticity payoff. Risk: leans hard on
the terminal identity, which is *farm/dev-coded* but less "cozy."

---

### Direction B — "The Almanac" (warm, tactile, anti-terminal)

**Concept.** Do the *unexpected* thing: don't look like a terminal at all. Lean
into the cozy farming soul. The site is a beautiful **printed seed-almanac /
risograph zine** — warm paper, botanical illustrations of the crops (Moonberry,
Voidlotus, Glimmercorn), letterpress headers, and the in-game newspaper, *The
Daily Furrow*, as a recurring motif. The terminal is revealed late, as the
charming *delivery mechanism*, not the identity. This direction's whole thesis:
*nothing signals "a human made this with love" like craft a template can't fake.*

**Signature interaction — the seed packet & the growing scroll.** The hero is an
illustrated **seed packet you can open** (tap/drag the flap). As you scroll, a
turnip **sprouts and ripens** in the margin — the page literally grows beneath
you. That single scroll-tied illustration *is* the elevator pitch: this is a
game about patience and small daily joys.

**Craft specifics.**
- **Type:** a characterful old-style **serif** for headers (e.g. **Fraunces** or
  **Newsreader**) over a clean humanist or mono body; *The Daily Furrow* sections
  use a condensed newspaper face. This pairing reads "editorial," never "SaaS."
- **Color & texture:** a **two-color riso palette** — cream paper
  (`#f3ead6`-ish) + ink near-black + **one spot ink per game** (Farm = pumpkin
  orange or moss). Real paper grain, misregistration, and halftone — the
  imperfections are the point; they're what AI/Wix output lacks.
- **Illustration:** hand-drawn (or carefully commissioned/SVG) crop art. This is
  the asset cost and the moat at once. Animate sparingly: a sprout here, a moon
  phase there.

**Mobile-first.** Print layouts go *vertical* beautifully — a phone literally
resembles a tall almanac page or a stacked newspaper column. The seed-packet and
sprout interactions are touch-native (drag the flap, scroll the sprout). Texture
served as optimized assets; illustrations as responsive SVG.

**Farm showcase.** Farm gets the **center spread** — a full illustrated "field
guide" page. Future games are "more packets on the rack," teased as upcoming
catalog entries, so the arcade reads as a *seed catalog* that will grow.

**Honest donations.** "**Buy the farmer a coffee / a packet of seeds**," with a
charming illustrated tip jar that visibly fills toward a transparent monthly
server-cost goal. Warm and sincere, never pushy — perfectly matched to the cozy
tone.

**Next.js build.** Mostly static/SSG for speed; scroll-linked illustration via
Intersection Observer or GSAP ScrollTrigger; SVG/Lottie for the growing crop;
the actual `ssh` command lives in a tactile "how to play" recipe-card strip.

**Why it won't feel AI-built.** Editorial print + custom illustration is the
single hardest look to fake generically; AI landing pages essentially never go
here. It also *surprises* — a terminal game that looks like a seed catalogue is
a memorable mismatch.

**Trade-offs.** Needs real illustration/art direction (budget or skill), which
is the gating cost. Strongest emotional warmth and differentiation; least
"hacker cred" of the three, and it under-sells the SSH cleverness unless the
reveal is handled well. Scales to many games only if each new game earns its own
art — lovely but not cheap.

---

### Direction C — "The Arcade Cabinet" (playful retro-future OS) — *recommended shell*

**Concept.** Take the brand name literally: SSH-Arcade is **a room full of
cabinets** / a fictional **retro-future arcade OS** you boot into. Not a CRT
terminal and not a print zine — a confident, chunky, tactile *hardware* aesthetic
in the spirit of **Playdate** and **Teenage Engineering**: limited palette, big
satisfying controls, micro-interactions with *sound*. Each game is a cabinet with
its own marquee; the arcade is the cohesive shell that scales to N games. This is
the most **brand-and-future-proof** of the three because adding a game = adding a
cabinet.

**Signature interaction — "INSERT COIN" donations + sound.** Two hooks:
1. **Sound design.** Almost no website has sound; a *tiny, restrained,
   toggleable* set of blips/clicks on hover/select/insert is wildly memorable to
   this audience when done with taste (think the satisfaction of mechanical
   keys). Off by default, with a visible, persistent speaker toggle.
2. **The coin slot.** Donations *are* the arcade mechanic: a real **"INSERT
   COIN"** slot. Clicking drops a coin with a *clink*, and coins **stack into a
   transparent community goal meter** ("server costs: $X/mo — we're at 70%").
   This makes honest, no-guilt fundraising the most *fun* part of the page — it
   turns "please donate" into play.

**Craft specifics.**
- **Type:** a chunky **grotesque** (e.g. an industrial face) for UI, a **pixel/
  display** font reserved for marquees only (used sparingly so it stays a
  delight, not a gimmick), and a real mono for the one `ssh` command.
- **Color:** a tight, confident **hardware palette** — a putty/grey or
  charcoal "device" chassis with **one hot accent** (Playdate-yellow or a
  hot orange), and each cabinet gets its own accent so the arcade feels
  populated. Chunky borders, hard shadows, physical-feeling buttons — *not*
  glassmorphism.
- **Motion:** tactile, springy micro-interactions (button depress, cabinet
  power-on flicker, marquee glow), a faux "boot" sequence on first load, and a
  persistent OS-style **status bar** ("NOW FEATURING: FARM").

**Mobile-first.** A phone *is* a handheld console — the metaphor gets stronger,
not weaker. Cabinets become a **swipeable carousel** of cards; the coin slot and
controls are big tap targets; the boot sequence is a short, skippable splash.
Keyboard users on desktop get arrow-key navigation between cabinets (rewards the
keyboard-first crowd); touch users swipe.

**Farm showcase.** Farm is the **featured, lit-up cabinet, front and center**,
with its marquee glowing while "coming soon" cabinets sit dimmer beside it. Tap
the Farm cabinet → it "powers on" into Farm's own detail page (which could even
borrow Direction B's cozy almanac art *inside* the cabinet — see §5).

**Honest donations.** Covered by the coin-slot mechanic above — the most
on-brand, least preachy way to "just ask." Transparent goal meter + optional
supporters marquee.

**Next.js build.** App Router; component-driven design system (cabinets,
marquees, buttons as reusable parts — directly supports scaling to many games);
**Web Audio API / Howler** for sound with a persisted mute preference;
`framer-motion`/`motion` for springy interactions; everything degraded under
`prefers-reduced-motion`.

**Why it won't feel AI-built.** Sound design + a coin-insert donation mechanic +
a cohesive fictional-hardware system is a *point of view*, not a layout. No
template ships any of it. And it directly serves the two business goals (arcade
brand that scales; honest, fun donations).

**Trade-offs.** Medium build effort (a real design system + sound assets). Best
fit for the *brand and the donation goal*; slightly less "authentic terminal
purity" than A (mitigated by featuring A's playable terminal inside the Farm
cabinet).

---

## 5. Recommendation

**Lead with Direction C as the arcade shell, and put Direction A's playable
terminal inside the Farm cabinet.** Rationale:

- The brand is *an arcade of many games* — C is the only direction whose
  structure scales cleanly (each game = one more cabinet) and whose central
  metaphor (**INSERT COIN**) turns the honest-donation ask into the most
  delightful interaction on the page. That's a direct hit on both stated goals.
- The product's *killer authenticity move* is real play, so the **featured Farm
  cabinet should open into Direction A's WASM-powered playable demo** — the real
  engine, in the browser. That's the "speak by design" punch where it matters
  most, without forcing the whole site to be terminal-coded.
- Direction B's cozy almanac art isn't wasted: it becomes **Farm's interior
  art direction** (the cabinet's detail page / field guide), giving each game its
  own personality inside a cohesive shell. This is the scalable system: *the
  arcade is consistent; each cabinet has a soul.*

If you want a single direction with the least complexity for a first launch:
ship **C alone**, with Farm's cabinet linking out to the real `ssh` command and a
static animated preview, then add the WASM playable demo (A) as a fast-follow.

> One-line summary: **Arcade-OS shell (C) + a real playable Farm inside it (A),
> with cozy per-game art (B) as each cabinet's personality.**

---

## 6. Cross-cutting essentials (apply to whichever direction wins)

- **Performance is non-negotiable** for this crowd: ship a fast, light first
  paint; lazy-load WASM/sound/heavy motion; keep the core readable with JS off.
- **Respect `prefers-reduced-motion`** and provide visible toggles for motion,
  CRT, and sound. The audience includes people who *hate* surprise motion/audio —
  defaults should be calm; delight should be opt-in but discoverable.
- **Accessibility & keyboard nav**: full keyboard operability isn't just a11y
  here, it's *fan service* for a keyboard-first audience. Strong focus states,
  semantic HTML, real `<button>`s.
- **The honest-donation pattern** (use across all directions): show the *real*
  monthly server cost and a live progress meter, state plainly that the games are
  free and donations are optional, offer 2–3 rails (GitHub Sponsors / Ko-fi /
  Stripe), and an opt-in supporters wall. No modals, no guilt, no countdowns.
- **Design the system, not the page**: cabinets, marquees, the coin meter, the
  `ssh` command card, and a game-detail template should be reusable components so
  adding game #2, #3, #N is content, not a redesign.
- **One `ssh` command, treated as sacred**: it's the actual product. Make it
  copy-on-tap, beautifully set, and impossible to miss — it's the conversion
  event on desktop.

---

## 7. Suggested next steps

1. **Pick the direction** (recommend C-shell + A-inside-Farm).
2. **Lock the kit**: 2 fonts max + the one mono; a tight palette with per-game
   accents; pick the motion lib (`motion`) and, for C, the audio approach.
3. **Build the component system first** (cabinet, marquee, coin meter, ssh-card,
   game-detail template), then compose the landing page from it.
4. **Prototype the one signature interaction** for the chosen direction before
   building everything else — it's what the whole site lives or dies on.
5. **Spike the WASM sim demo** early if going with A-inside-Farm; it's the
   highest-risk, highest-reward piece and validates the "real engine in the
   browser" promise.
6. **Wire honest donations** with the live cost/goal meter and one payment rail
   to start.
