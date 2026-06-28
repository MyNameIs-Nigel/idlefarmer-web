# 1.2 — Technical Documentation Generation

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §1 Repository Documentation System.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | 1.2 |
| **Section** | Repository Documentation System |
| **Severity** | MAJOR |
| **Markets** | Internal / DX (not market-facing) |
| **Status (today)** | MISSING |
| **Estimated effort** | M (2–4w) |
| **Owner (proposed)** | Maintainer (Nigel) / DX |
| **Depends on** | 1.1 |
| **Unblocks** | 1.4 |
| **Completed** | FALSE |

---

## 1. Problem Statement

The schema and tree exist (1.1) but the **technical bodies are empty**. The
non-visual machinery of this repo — the single-source-of-truth identity in
`app/site.ts`, the file-convention metadata routes Next auto-injects, the
`force-static` `llms.txt` route handler, the sitemap that lists routes that 404
by design — encodes dozens of decisions whose *why* exists nowhere durable. When
an agent edits `sitemap.ts` it cannot tell that unbuilt routes are listed *on
purpose*; when it touches a metadata route it may double-set values Next already
injects. This feature systematically walks every technical file and writes its
doc, with **WHY as the primary deliverable** (why a route handler for `llms.txt`,
why `force-static`, why identity is centralized), recorded against the 1.1 schema.

## 2. Goals

- Fill a `COMPLETE` technical doc for **every non-UX source file** in the repo,
  walking them one at a time so none is skipped.
- Make the **Why** section the centre of gravity: capture rationale for each
  meaningful decision, not just a restatement of what the code does.
- Source every *why* from evidence — code comments, `AGENTS.md`, git history,
  Next.js docs in `node_modules/next/dist/docs/` — and mark it `UNKNOWN` when no
  evidence exists rather than inventing it.
- Keep each doc agent-first and parseable so 1.4 can audit it.
- Update the 1.1 manifest so coverage and `why_unknowns` reflect reality.

## 3. Non-Goals

- **UX / UI files.** `app/globals.css` (theming/animation) and
  `app/ArcadeLanding.tsx` (interactive arcade UI) belong to 1.3. This feature
  documents `ArcadeLanding.tsx` only at the structural/data level if at all;
  visual rationale is 1.3's.
- **Changing the structure or schema.** That is owned by 1.1.
- **Auditing freshness.** That is 1.4. 1.2 stamps `last_audited_sha` at write
  time but does not build the drift checker.
- **Documenting code that does not exist** (unbuilt cabinet/page routes).
- **Refactoring the code** to make it easier to document. Docs describe reality.

## 4. Personas & User Stories

- **As an agent about to edit a metadata route**, I want a doc that warns "Next
  auto-injects this; do not also set it in `metadata`", so I don't introduce a
  duplicate-tag bug.
- **As an agent touching `sitemap.ts`**, I want the doc to state that unbuilt
  routes are listed intentionally, so I don't "fix" them by deleting them.
- **As the maintainer**, I want every non-obvious technical decision's *why*
  written down once, so future me and future agents stop re-deriving it.
- **As the audit skill (1.4)**, I want each technical doc stamped with the commit
  it was written against, so I can tell when its source has since changed.

## 5. Functional Requirements

- **FR-1.** The system MUST produce a `COMPLETE` doc (per the 1.1 schema) for
  every technical source file, at minimum: `app/site.ts`, `app/page.tsx`,
  `app/layout.tsx`, `app/not-found.tsx`, all metadata routes (`app/icon.svg`,
  `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/manifest.ts`,
  `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts`), `app/farm/page.tsx`,
  `app/farm/FarmCabinet.tsx`, `app/farm/TerminalDemo.tsx`, `app/farm/crops.ts`,
  and build/config files (`next.config.*`, `tsconfig.json`, `eslint` config,
  `package.json` scripts).
- **FR-2.** Each doc MUST process its file **systematically**: read the file in
  full, then write **What**, **How**, and **Why** before moving on — no file
  partially documented and left.
- **FR-3.** The **Why** section MUST capture, per decision, *why it is done this
  way* — e.g. **Why a route handler for `llms.txt`?**, **Why `force-static`?**,
  **Why centralize identity in `site.ts`?**, **Why list unbuilt routes in the
  sitemap?** — each as `**Why …?** → answer`.
- **FR-4.** When a *why* cannot be derived from code, comments, `AGENTS.md`, git
  history, or the bundled Next docs, the system MUST record it as `UNKNOWN`,
  increment `why_unknowns`, and add it to the doc's **Open Questions** so the
  maintainer can confirm. It MUST NOT fabricate a rationale.
- **FR-5.** Each doc MUST cite its evidence inline (e.g. "per `AGENTS.md`",
  "per comment in `site.ts:1`", "Next docs: app-router/metadata") so a reader can
  verify the *why*.
- **FR-6.** Before writing any *why* about Next.js behavior, the system MUST
  consult `node_modules/next/dist/docs/` (per `AGENTS.md`, this is a modified
  Next) rather than assuming stock framework behavior.
- **FR-7.** On completing a doc, the system MUST set `status: COMPLETE`, stamp
  `last_audited_sha` to the current `HEAD`, set `last_audited_date`, and update
  the 1.1 manifest entry.
- **FR-8.** The **Gotchas / Invariants** section MUST capture known traps already
  documented in `AGENTS.md` (e.g. stale `.next` cache, satori `display:flex`
  rule, "edit identity only in `site.ts`").
- **FR-9.** Docs SHOULD link related files via `Related` (e.g. `sitemap.md` ↔
  `site.md` ↔ `llms.md`, since all read the `cabinets`/`pages` lists).
- **FR-10.** The walk SHOULD proceed in dependency order — identity
  (`site.ts`) first, then its consumers — so cross-references resolve as they're
  written.

## 6. Non-Functional Requirements

- **Performance** — Each doc MUST stay skimmable in one read (< ~400 lines);
  long evidence links out instead of pasting source.
- **Security** — Docs MUST NOT expose anything not already public in source;
  host strings already in `site.ts` are fine, no new secrets introduced.
- **Privacy & Compliance** — N/A.
- **Accessibility** — Valid Markdown heading nesting (shared with 1.1).
- **Scalability** — Adding a new technical file means one new doc + one manifest
  row; no structural change.
- **Reliability** — Every `COMPLETE` doc's `last_audited_sha` MUST be real so 1.4
  can trust it; an unstamped doc is treated as `PARTIAL`.
- **Observability** — `why_unknowns` summed across technical docs is the headline
  "how much do we still not understand" metric.
- **Maintainability** — One file ↔ one doc. No doc covers two source files.
- **Internationalization** — English only.
- **Backward compatibility** — If a source file is deleted, 1.4 prunes its doc;
  1.2 just sets the initial state.

## 7. Acceptance Criteria

- **AC-1.** *Given* the 1.1 skeleton, *When* 1.2 completes, *Then* every
  technical source file in FR-1 has a doc with `status: COMPLETE` and a non-empty
  **Why** section.
- **AC-2.** *Given* `app/sitemap.ts`'s doc, *When* read, *Then* it explains *why*
  unbuilt routes are listed (crawler discovery) and cross-links `site.ts`.
- **AC-3.** *Given* `app/llms.txt/route.ts`'s doc, *When* read, *Then* it explains
  *why* it is a route handler and *why* `force-static`, each citing evidence.
- **AC-4.** *Given* any doc with an unanswerable *why*, *When* read, *Then* that
  *why* is `UNKNOWN`, counted in `why_unknowns`, and listed under Open Questions —
  and no fabricated rationale appears.
- **AC-5.** *Given* the manifest after 1.2, *When* parsed, *Then* every technical
  entry's `status` and `last_audited_sha` are populated and resolve to real files.
- **AC-6.** *Given* a metadata-route doc, *When* read, *Then* it warns that Next
  auto-injects the value and it must not be duplicated in `metadata`.

## 8. Data Model

Reuses the 1.1 schema verbatim (front-matter + seven body sections + manifest).
1.2 adds no new schema; it only populates `status`, `last_audited_sha`,
`last_audited_date`, and `why_unknowns`, and writes body content. Candidate
technical docs and their headline *why* themes:

| Doc | Source | Headline WHY to capture |
|---|---|---|
| `site.md` | `app/site.ts` | Why one source of truth for identity / why the domain has no hyphen |
| `layout.md` | `app/layout.tsx` | Why metadata/viewport live here, not per-page |
| `sitemap.md` | `app/sitemap.ts` | Why unbuilt routes are listed (crawler discovery) |
| `robots.md` | `app/robots.ts` | Why allow-all / why a code route vs static file |
| `llms.md` | `app/llms.txt/route.ts` | Why a route handler + `force-static` |
| `manifest.md` | `app/manifest.ts` | Why PWA manifest / where colors come from |
| `og-image.md` | `app/opengraph-image.tsx` | Why satori constraints (`display:flex`, `marginRight`) |
| `crops.md` | `app/farm/crops.ts` | Why this data shape for the Farm demo |

## 9. API Surface

No HTTP surface. Consumes the 1.1 skill contract (manifest read/write) and
produces Markdown docs. The only "interface" is the manifest update on each
completed doc.

## 10. UI / UX

No product UI. Documentation-reading UX inherits 1.1: a reader lands on the TOC,
sees a technical file flip from `STUB` → `COMPLETE`, and opens it to a populated
**Why** section. Empty state (mid-fill) is an honest `PARTIAL` badge.

## 11. AI / ML Considerations

- The walk is performed by an agent; the **anti-fabrication rule (FR-4)** is the
  central AI safeguard — when the *why* is not in evidence, it is `UNKNOWN`, never
  guessed. This is the whole point of the feature: trustworthy *why*, not
  plausible-sounding *why*.
- The agent MUST ground Next.js claims in `node_modules/next/dist/docs/` (FR-6)
  because this Next is modified and training-data assumptions may be wrong.
- No runtime model, no PII, cost is ordinary tool-call usage during generation.

## 12. Integration Points

- **Read-only sources documented:** every file in FR-1, plus `AGENTS.md`,
  `node_modules/next/dist/docs/`, and `git log` for rationale.
- **Writes to:** `docs/reference/**` (bodies) and `docs/reference/manifest.json`.
- **Consumes:** the structure skill / schema from 1.1.
- No external services or events.

## 13. Dependencies & Sequencing

- **Must ship after:** 1.1 (needs the tree, schema, and manifest).
- **Must ship before:** 1.4 (audit needs `COMPLETE` docs with stamped SHAs to
  diff). Can run in parallel with 1.3 since they document disjoint files.
- **Shared infra:** none beyond the repo and skills runner.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Agent fabricates a plausible *why* | M | H | Hard FR-4 rule + evidence citation (FR-5); 1.4 spot-checks UNKNOWN ratio. |
| Next-specific claims wrong (modified Next) | M | M | FR-6 mandates reading bundled Next docs first. |
| `why_unknowns` balloons, docs feel hollow | M | M | Surface UNKNOWNs to maintainer as Open Questions for quick confirmation. |
| Docs go stale the moment code changes | H | M | `last_audited_sha` stamp lets 1.4 flag drift; expected, not a defect. |
| Scope creep into UX files | M | L | Hard boundary: `globals.css` + `ArcadeLanding.tsx` visuals are 1.3. |

## 15. Rollout Plan

- **Feature flag:** none (inert docs).
- **Sequencing:** walk in dependency order — `site.ts` → its consumers
  (`layout`, `sitemap`, `robots`, `llms`, `manifest`, OG/icons) → `farm/*` →
  build/config. Commit per area so review is digestible.
- **Dogfood:** maintainer reviews the `site.md`, `sitemap.md`, and `llms.md`
  *why* sections first (highest-value, most-surprising decisions).
- **GA criteria:** §7 ACs pass; manifest shows all technical files `COMPLETE`.
- **Rollback:** revert the docs commits; no runtime impact.

## 16. Test Plan

- **Unit / lint** — schema validator (from 1.1) passes on every technical doc;
  `status: COMPLETE` docs have a non-empty **Why**.
- **Integration** — manifest technical rows all resolve; `last_audited_sha`
  matches a real commit; no source documented twice.
- **End-to-end** — pick three files, regenerate their docs from scratch, confirm
  the *why* matches cited evidence.
- **Security** — secret-scan generated docs.
- **Accessibility** — heading-nesting check.
- **Manual exploratory** — maintainer reads each **Why** and either confirms or
  converts an `UNKNOWN`.

## 17. Documentation & Training

- The reference docs *are* the documentation; this feature is self-documenting.
- Update `docs/reference/README.md` badges as files reach `COMPLETE`.
- Note in `AGENTS.md` that technical *why* now lives in `docs/reference/` and
  should be read before editing identity/metadata/routing files.

## 18. Open Questions

1. Does `ArcadeLanding.tsx` get a thin **technical** doc here (data flow, state)
   with visuals deferred to 1.3, or is it wholly owned by 1.3? (Affects boundary.)
2. Granularity of metadata-route docs: one consolidated doc vs. one per route —
   inherited from 1.1 Open Question 2; resolve before the walk.
3. Should build/config files (`tsconfig`, eslint, `next.config`) be `COMPLETE`
   targets or a lighter `PARTIAL` tier given their *why* is mostly conventional?
4. How deep to mine `git log` for *why* before declaring `UNKNOWN` — a fixed
   budget (e.g. blame + first-touch commit) keeps the walk bounded.

## 19. References

- Files this work touches: `docs/reference/**` (bodies + manifest), read-only all
  files in §5 FR-1, plus `AGENTS.md`, `node_modules/next/dist/docs/`, git history.
- Repo conventions: `AGENTS.md` (architecture, gotchas), `docs/templates/_TEMPLATE.md`.
- Related plans: [FEATURE_1.1.md](FEATURE_1.1.md) (schema/tree),
  [FEATURE_1.3.md](FEATURE_1.3.md) (UX/UI bodies), [FEATURE_1.4.md](FEATURE_1.4.md) (audits).
