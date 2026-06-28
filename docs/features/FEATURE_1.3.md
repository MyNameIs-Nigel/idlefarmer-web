# 1.3 — UX/UI Documentation Generation

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §1 Repository Documentation System.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | 1.3 |
| **Section** | Repository Documentation System |
| **Severity** | MINOR |
| **Markets** | Internal / DX (not market-facing) |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | Maintainer (Nigel) / DX |
| **Depends on** | 1.1 |
| **Unblocks** | 1.4 |
| **Completed** | FALSE |

---

## 1. Problem Statement

The arcade's personality lives in a handful of visual decisions whose *why* is
almost entirely undocumented: the resting accent is amber `#ffb000`, selection
starts `null` so the hero renders a grayed-out "Standby", `--accent` is registered
with `@property { syntax: "<color>" }` so it can *animate*, and every motion rule
is CSS-driven specifically so `prefers-reduced-motion` can switch it all off in
one place. An agent editing `globals.css` or `ArcadeLanding.tsx` can easily break
the cross-fade, hardcode a color that should follow the cabinet, or add JS-driven
motion that ignores the reduced-motion contract — because the *reasons* aren't
written down. This feature documents the **UX/UI surface** against the 1.1 schema,
with the visual and interaction **WHY** as the primary deliverable.

## 2. Goals

- Fill `COMPLETE` UX/UI docs for the visual surface: `app/globals.css`,
  `app/ArcadeLanding.tsx`, and the visual aspects of `app/farm/FarmCabinet.tsx`,
  `app/farm/TerminalDemo.tsx`, and `app/opengraph-image.tsx` / `app/apple-icon.tsx`.
- Make **Why** the centre: capture the rationale behind colors, the powered-off
  default, the accent-animation mechanism, the reduced-motion contract, and the
  scanline/CRT styling.
- Tie each visual *why* to the design intent (retro-future arcade, "Insert coin.
  Start farm.") and to accessibility (reduced motion, contrast).
- Mark visual *whys* `UNKNOWN` when they're purely aesthetic with no recorded
  reason, rather than inventing a justification.
- Update the 1.1 manifest for the UX/UI files.

## 3. Non-Goals

- **Non-visual machinery.** Identity, routing, metadata, build config, and Farm
  data shapes are 1.2's. Where 1.3 and 1.2 both touch a file (e.g. the OG image
  has satori *mechanics* and *visual* choices), 1.3 owns only the visual/design
  rationale.
- **Redesigning anything.** Docs describe the current look, not a proposed one.
- **Schema/tree changes** (1.1) or **audits** (1.4).
- **A formal design system / token catalog.** Out of scope; this documents the
  decisions that exist, not a new abstraction.

## 4. Personas & User Stories

- **As an agent editing `globals.css`**, I want a doc that explains the `@property`
  registration enables the accent cross-fade, so I don't remove it and silently
  kill the animation.
- **As an agent adding motion**, I want the doc to state the reduced-motion
  contract (all animation must be CSS-driven so it inherits the global disable),
  so new motion stays accessible.
- **As an agent theming a new cabinet**, I want the doc to explain accent follows
  the selected cabinet and the resting accent is amber `#ffb000`, so I set
  `accent` per-cabinet instead of hardcoding.
- **As the maintainer**, I want the "why these colors / why Standby at rest"
  reasoning captured once so it survives redesigns and onboarding.
- **As the audit skill (1.4)**, I want UX docs stamped with their source SHA so I
  can flag them when `globals.css` or `ArcadeLanding.tsx` changes.

## 5. Functional Requirements

- **FR-1.** The system MUST produce a `COMPLETE` doc (1.1 schema) for each UX/UI
  source: `app/globals.css`, `app/ArcadeLanding.tsx`, `app/farm/FarmCabinet.tsx`,
  `app/farm/TerminalDemo.tsx`, and the visual layer of `app/opengraph-image.tsx`
  and `app/apple-icon.tsx`.
- **FR-2.** The **Why** section MUST capture the signature visual decisions, each
  as `**Why …?** → answer`, at minimum:
  - **Why amber `#ffb000` as the resting accent?**
  - **Why does selection start `null` (the powered-off "Standby" state)?**
  - **Why register `--accent` / `--cabinet-accent` with `@property`?** (so they
    animate / cross-fade).
  - **Why is all motion CSS-driven?** (so `prefers-reduced-motion: reduce`
    disables it globally).
  - **Why per-cabinet `accent` colors / why the scanline + `.is-off` styling?**
- **FR-3.** Each visual *why* MUST cite evidence — `AGENTS.md` (which documents
  accent theming, powered-off default, reduced motion), code comments, and the
  CSS/TSX itself — and MUST be marked `UNKNOWN` (incrementing `why_unknowns`,
  added to Open Questions) when the reason is purely aesthetic and unrecorded.
- **FR-4.** The doc MUST state the **reduced-motion contract** as an invariant in
  Gotchas: new animation/transition must be CSS-driven to inherit the global
  `prefers-reduced-motion` disable.
- **FR-5.** The doc MUST state the **accent-theming invariant**: per-cabinet
  colors live on each game's `accent` in `ArcadeLanding.tsx`; the resting accent
  is amber; do not hardcode accent values elsewhere.
- **FR-6.** The `opengraph-image`/`apple-icon` doc MUST record the **satori
  constraints** as gotchas (multi-child flex needs explicit `display:flex`; use
  `marginRight` not `gap`; built-in font only) — framed as "why the code looks
  unusual."
- **FR-7.** On completion each doc MUST set `status: COMPLETE`, stamp
  `last_audited_sha`/`last_audited_date`, and update the 1.1 manifest.
- **FR-8.** Docs SHOULD include the **copy/voice** rationale where it drives UI
  (e.g. tagline "Insert coin. Start farm.", "Insert coin. Copy the SSH command.")
  linking to `app/site.ts` as the copy source.
- **FR-9.** Where a visual choice has an accessibility rationale (contrast,
  motion, focus), the doc MUST note it explicitly so it isn't "optimized away."

## 6. Non-Functional Requirements

- **Performance** — Each doc skimmable in one read; reference CSS by selector/line
  rather than pasting blocks.
- **Security** — N/A (no secrets in visual code).
- **Privacy & Compliance** — N/A.
- **Accessibility** — Doubly relevant: docs MUST themselves nest headings validly,
  *and* they MUST record the app's accessibility contracts (reduced motion, color
  contrast) so future edits preserve them.
- **Scalability** — A new cabinet's accent or a new animated surface is one doc
  update; the schema doesn't change.
- **Reliability** — `last_audited_sha` accuracy so 1.4 can trust UX docs.
- **Observability** — UX `why_unknowns` count signals how much of the look is
  "just aesthetic" vs. reasoned.
- **Maintainability** — One file ↔ one doc, same as 1.2.
- **Internationalization** — Docs English-only; note that UI copy is centralized
  in `site.ts` should i18n ever be added.
- **Backward compatibility** — Visual redesign → update doc + re-stamp SHA via 1.4.

## 7. Acceptance Criteria

- **AC-1.** *Given* the 1.1 skeleton, *When* 1.3 completes, *Then* every UX/UI
  source in FR-1 has a `COMPLETE` doc with a populated **Why**.
- **AC-2.** *Given* `globals.md`, *When* read, *Then* it explains *why* `--accent`
  is `@property`-registered (animation) and *why* motion is CSS-driven
  (reduced-motion inheritance), each citing evidence.
- **AC-3.** *Given* `arcade-landing.md`, *When* read, *Then* it explains the
  powered-off `null`/Standby default and the per-cabinet accent model, and states
  the "don't hardcode accents" invariant.
- **AC-4.** *Given* the OG/apple-icon doc, *When* read, *Then* the satori
  constraints appear as gotchas with the "why the code looks unusual" framing.
- **AC-5.** *Given* a purely aesthetic choice with no recorded reason, *When*
  documented, *Then* it is `UNKNOWN`, counted, and listed under Open Questions —
  no invented rationale.
- **AC-6.** *Given* the manifest after 1.3, *When* parsed, *Then* all UX/UI entries
  are `COMPLETE` with real `last_audited_sha`.

## 8. Data Model

Reuses the 1.1 schema. No new fields. UX/UI doc targets and their headline *why*:

| Doc | Source | Headline visual WHY |
|---|---|---|
| `globals.md` | `app/globals.css` | Why `@property` accents (animate); why CSS-only motion (reduced-motion); why amber `#ffb000` rest |
| `arcade-landing.md` | `app/ArcadeLanding.tsx` | Why `null`/Standby at rest; why accent follows cabinet; scanline/`.is-off` |
| `farm-cabinet.md` | `app/farm/FarmCabinet.tsx` | Why this cabinet framing / accent usage |
| `terminal-demo.md` | `app/farm/TerminalDemo.tsx` | Why the demo looks like a terminal; motion choices |
| `og-image.md`* | `app/opengraph-image.tsx` | Why satori quirks; visual composition of the social card |

\* Shared with 1.2 — 1.3 owns the visual/design rationale, 1.2 owns the render mechanics.

## 9. API Surface

No HTTP surface. Consumes the 1.1 skill/manifest contract; produces Markdown.

## 10. UI / UX

No product UI is added. The documentation-reading UX inherits 1.1 (TOC →
`COMPLETE` badge → populated **Why**). This feature's distinctive value is that
the docs themselves *capture* the product's UX contracts (motion, color, states)
so they survive future edits.

## 11. AI / ML Considerations

- Same anti-fabrication rule as 1.2: aesthetic *whys* with no recorded reason are
  `UNKNOWN`, not invented. This matters more here because visual choices are the
  easiest to rationalize after the fact — the doc must resist that.
- The agent SHOULD lean on `AGENTS.md`, which already records the accent-theming,
  powered-off, and reduced-motion intent, as primary evidence.
- No runtime model; ordinary tool-call cost during generation.

## 12. Integration Points

- **Read-only sources:** `app/globals.css`, `app/ArcadeLanding.tsx`,
  `app/farm/FarmCabinet.tsx`, `app/farm/TerminalDemo.tsx`,
  `app/opengraph-image.tsx`, `app/apple-icon.tsx`, plus `app/site.ts` (copy/colors)
  and `AGENTS.md` (design intent).
- **Writes to:** `docs/reference/**` (UX bodies) and the manifest.
- **Consumes:** 1.1 schema. Coordinates with 1.2 on the shared OG-image doc.
- No external services or events.

## 13. Dependencies & Sequencing

- **Must ship after:** 1.1.
- **Runs parallel to:** 1.2 (disjoint files; coordinate only on `og-image.md`).
- **Must ship before:** 1.4 (audit needs the UX docs to exist and be stamped).
- **Shared infra:** none.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Agent rationalizes aesthetics into fake "why" | M | M | Strict `UNKNOWN` rule (FR-3); cite evidence or mark unknown. |
| Reduced-motion / accent invariants documented wrong | L | H | Cross-check against `AGENTS.md` + the actual CSS `@property` / media query. |
| Overlap with 1.2 on OG image causes double/contradictory docs | M | L | Explicit split: 1.3 = visual, 1.2 = mechanics; single shared doc. |
| Visual docs go stale after a redesign | M | M | `last_audited_sha` + 1.4 drift flagging. |

## 15. Rollout Plan

- **Feature flag:** none.
- **Sequencing:** `globals.md` first (it defines the theming/motion contracts
  everything else references), then `arcade-landing.md`, then `farm/*`, then the
  shared OG/apple-icon doc.
- **Dogfood:** maintainer reviews `globals.md` and `arcade-landing.md` *why*
  sections (the highest-leverage invariants) first.
- **GA criteria:** §7 ACs pass; manifest shows UX/UI files `COMPLETE`.
- **Rollback:** revert doc commits; no runtime impact.

## 16. Test Plan

- **Unit / lint** — schema validator passes; `COMPLETE` UX docs have non-empty
  **Why** and a stated reduced-motion/accent invariant.
- **Integration** — manifest UX rows resolve; OG-image doc referenced by both
  1.2 and 1.3 exists exactly once.
- **End-to-end** — regenerate `globals.md` from scratch; confirm the documented
  invariants match the CSS (`@property` present, reduced-motion media query
  present).
- **Accessibility** — heading nesting valid; the app's accessibility contracts are
  recorded.
- **Manual exploratory** — maintainer confirms or converts each `UNKNOWN`
  aesthetic *why*.

## 17. Documentation & Training

- The UX reference docs are themselves the documentation.
- Update `docs/reference/README.md` badges as UX files reach `COMPLETE`.
- Add a one-line pointer in `AGENTS.md`: visual/interaction *why* now lives in
  `docs/reference/` and must be read before editing `globals.css` /
  `ArcadeLanding.tsx`.

## 18. Open Questions

1. How is the `og-image.md` doc co-owned by 1.2 (mechanics) and 1.3 (visual) in
   practice — one file with two clearly-labeled sections, or a cross-link pair?
2. Does `ArcadeLanding.tsx` get one combined doc (state + visuals) or split
   technical (1.2) / visual (1.3) docs? Inherited from 1.2 Open Question 1.
3. How granular should color documentation be — every `var(--*)` token, or only
   the signature ones (resting amber, per-cabinet accents)?
4. Should the doc capture *intended* future UX (cabinet routes, donate/contact
   pages) or strictly the built surface? (Leaning: built surface only; intent
   stays in feature specs.)

## 19. References

- Files this work touches: `docs/reference/**` (UX bodies + manifest), read-only
  `app/globals.css`, `app/ArcadeLanding.tsx`, `app/farm/*`, `app/opengraph-image.tsx`,
  `app/apple-icon.tsx`, `app/site.ts`, `AGENTS.md`.
- Repo conventions: `AGENTS.md` (Accent theming, Powered-off default, Reduced
  motion, satori notes), `docs/templates/_TEMPLATE.md`.
- Related plans: [FEATURE_1.1.md](FEATURE_1.1.md) (schema/tree),
  [FEATURE_1.2.md](FEATURE_1.2.md) (technical bodies), [FEATURE_1.4.md](FEATURE_1.4.md) (audits).
