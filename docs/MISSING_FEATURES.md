# Missing Features

Backlog of planned-but-unbuilt features. Each entry links to its full plan in
`docs/features/`.

## 1. Repository Documentation System

A `docs/reference/` knowledge tree that systematically walks every file in the
repo and explains **what** it does, **how** it works, and — most importantly —
**why** it exists, written agent-first so an agent can land on a table of
contents and jump straight to the doc it needs. Split across four features:
structure (1.1), technical bodies (1.2), UX/UI bodies (1.3), and audits (1.4).

### 1.1 — Documentation Tree & Table of Contents  (Feature ID 1.1)

- **Severity:** MAJOR · **Status:** MISSING · **Effort:** S (1w)
- Defines the `docs/reference/` tree, the agent-navigable table of contents, the
  per-file doc schema (front-matter + fixed sections incl. a first-class **Why**
  with `UNKNOWN` support), and the machine-readable manifest. The foundation 1.2,
  1.3, and 1.4 all build on.
- Plan: [docs/features/FEATURE_1.1.md](features/FEATURE_1.1.md)

### 1.2 — Technical Documentation Generation  (Feature ID 1.2)

- **Severity:** MAJOR · **Status:** MISSING · **Effort:** M (2–4w)
- Systematically walks every non-UX source file (identity, routing, metadata
  routes, `llms.txt` handler, sitemap, build config, Farm logic) and writes its
  doc, with the **why** (why a route handler for `llms.txt`, why `force-static`,
  why centralize identity) as the primary deliverable. Unknown whys are recorded
  as `UNKNOWN`, never invented.
- Plan: [docs/features/FEATURE_1.2.md](features/FEATURE_1.2.md)

### 1.3 — UX/UI Documentation Generation  (Feature ID 1.3)

- **Severity:** MINOR · **Status:** MISSING · **Effort:** S (1w)
- Documents the visual surface (`globals.css`, `ArcadeLanding.tsx`, Farm visuals,
  OG/icon rendering) with the visual/interaction **why** front and centre — why
  amber `#ffb000` at rest, why selection starts `null` (Standby), why `@property`
  accents animate, why all motion is CSS-driven (reduced-motion). Captures the
  app's UX invariants so future edits don't break them.
- Plan: [docs/features/FEATURE_1.3.md](features/FEATURE_1.3.md)

### 1.4 — Periodic Documentation Audits  (Feature ID 1.4)

- **Severity:** MINOR · **Status:** MISSING · **Effort:** S (1w)
- Keeps the tree honest: a manual audit skill plus a non-blocking CI nudge that
  compares each doc's stamped `last_audited_sha` against git to flag `STALE`,
  `MISSING-DOC`, and `ORPHAN` docs, and tracks `why_unknowns` over time.
- Plan: [docs/features/FEATURE_1.4.md](features/FEATURE_1.4.md)
