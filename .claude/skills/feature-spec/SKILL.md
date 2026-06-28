---
name: feature-spec
description: Turns a feature idea into a fully specified docs/features/FEATURE_<id>.md plan that follows docs/templates/_TEMPLATE.md, and records it in docs/MISSING_FEATURES.md. Use whenever the user wants to spec, draft, plan, or document a new feature for this repo (e.g. "write a feature spec for...", "add a feature for...", "spec out X"). Always asks the user at least one question before finalizing.
---

# Feature Spec

Turn a user's feature idea into a complete, schema-conformant feature plan at
`docs/features/FEATURE_<id>.md`, then register it in `docs/MISSING_FEATURES.md`.
The `<id>` in the filename is the dotted **Feature ID** (e.g. `FEATURE_1.1.md`,
`FEATURE_2.3.md`) — it MUST match the Feature ID inside the file's Metadata table.

## Core rule: always ask at least one question

You MUST ask the user at least one question before writing the file — every time,
no exceptions.

- **If the prompt lacks enough information** to fill the template confidently, ask
  the questions needed to close those gaps (group them; see "Asking questions").
- **If the prompt already has enough information**, still ask exactly one
  clarifying question that *adds a constraint* or *pins down a functional
  requirement* (e.g. a limit, an edge-case behavior, an auth scope, a performance
  target). Never skip this — a spec is always sharper with one more constraint.

Only after the user answers do you write the file.

## Workflow

### 1. Read the schema and context

Always read these first so the output matches the current conventions:

- `docs/templates/_TEMPLATE.md` — the authoritative schema. The generated file
  MUST contain every numbered section (1–19) and the full Metadata table.
- `docs/MISSING_FEATURES.md` — the source-of-truth backlog this plan derives from.
  Treat it as an instruction/reference file: read it for relevant context about
  the feature and which section the feature belongs to. If it is empty or a stub,
  proceed anyway and create the section.
- Existing `docs/features/FEATURE_*.md` files — to match style and avoid ID
  collisions.

### 2. Determine the Feature ID (the filename `<id>`)

- The filename is `FEATURE_<id>.md` where `<id>` is the dotted **Feature ID**
  (e.g. `FEATURE_1.1.md`). This same `<id>` MUST also be the value of the
  **Feature ID** field in the Metadata table — keep them identical so there is no
  ambiguity.
- Derive the dotted ID from the `docs/MISSING_FEATURES.md` section the feature
  belongs to: the section gives the major number, then assign the next free minor
  number within that section.
- Scan `docs/features/` for existing `FEATURE_*.md` files to find the next free
  minor number and avoid collisions.
- If the section is new, ask the user which section/area it belongs to (this can
  be one of your gap-closing questions), assign the next major number, and start
  its minor numbering at `.1`.

### 3. Assess the prompt and ask questions

Map the user's prompt onto the template sections. Identify which of these are
unknown or ambiguous, because they are the most common gaps:

- Problem statement / who is hurt by the gap (§1)
- Concrete goals and explicit non-goals (§2, §3)
- The primary personas and their user stories (§4)
- Testable functional requirements and their MUST/SHOULD/MAY level (§5)
- Hard non-functional constraints — perf targets, auth model, compliance (§6)
- Acceptance criteria in Given/When/Then form (§7)
- Data model / API surface / UI scope if applicable (§8–§10)
- Severity, Markets, Estimated effort, Depends on / Unblocks (Metadata)

Then ask (see "Asking questions" for how). Prefer the `AskUserQuestion` tool for
crisp multiple-choice gaps; use plain prose questions for open-ended ones.

### 4. Write `docs/features/FEATURE_<id>.md`

- Copy the structure of `_TEMPLATE.md` exactly: same headings, same section
  numbers, same Metadata table fields.
- Fill every section with the user's answers plus reasonable, clearly-grounded
  inferences. Do not leave raw `{placeholder}` tokens — either fill them or write
  a concrete TODO that names what is missing.
- Set `Completed` to `FALSE` and `Status (today)` to `MISSING` for a brand-new
  spec unless the user says otherwise.
- Set the source line at the top to point at the relevant
  `docs/MISSING_FEATURES.md §{section}`.
- Put anything still undecided into §18 Open Questions.

### 5. Update `docs/MISSING_FEATURES.md`

Append (or update) a section for this feature with the relevant info and a link
back to the new plan, e.g.:

```markdown
## {Section} — {Feature Name}  (Feature ID {x.y})

- **Severity:** {…} · **Status:** MISSING · **Effort:** {…}
- {1–2 sentence summary of the gap}
- Plan: [docs/features/FEATURE_{x.y}.md](features/FEATURE_{x.y}.md)
```

If `MISSING_FEATURES.md` is just a stub/`<to-do>`, replace the stub with a proper
heading and this first entry. Keep existing entries intact; never delete another
feature's section.

### 6. Confirm

Tell the user the path written, the Feature ID, and surface any
items parked in §18 Open Questions so they know what is still undecided.

## Asking questions

- Ask the smallest set of questions that unblocks a confident spec — batch them in
  a single `AskUserQuestion` call (up to 4) rather than many round-trips.
- Each question should change what you write. Don't ask for cosmetic preferences.
- For the "already-have-enough-info" case, the single clarifying question should
  tighten scope: a numeric limit, a failure-mode behavior, an auth/permission
  boundary, or which functional requirement is MUST vs SHOULD.
