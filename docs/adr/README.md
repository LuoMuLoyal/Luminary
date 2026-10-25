# Architecture Decision Records

This directory contains the Architecture Decision Records (ADRs) for Luminary.

## What is an ADR?

An ADR records a single architecturally significant decision, the context that forced it, the options considered, and the consequences that follow. The collection of ADRs in this directory is the repository's decision log: it answers "why is it built this way" without requiring the original author.

An ADR is a historical record, not living documentation. Once accepted, its content is not edited. When a decision changes, write a new ADR and mark the old one as superseded with a link to its successor.

## Naming

```
NNNN-kebab-case-title.md
```

- `NNNN`: sequential number, zero-padded (`0001`, `0002`, ...)
- Title: short, imperative where possible, kebab-case

## Status values

- `proposed` — under discussion, not yet adopted
- `accepted` — adopted and in force
- `rejected` — considered and declined; kept for the reasoning
- `superseded` — replaced by a later ADR; the record names its successor
- `deprecated` — no longer relevant, not replaced

## Template

```markdown
# Short imperative title

- Status: proposed
- Date: YYYY-MM-DD
- Authors: <names>
- Deciders: <names>

## Context and Problem Statement

What situation forces a decision, and what is the question?

## Decision Drivers

- What matters when choosing?

## Considered Options

1. Option A
2. Option B

## Decision Outcome

Chosen option: **Option A**, because <one-line justification>.

### Consequences

- Good, because ...
- Bad, because ...

### Confirmation

How is compliance verified?

## Pros and Cons of the Options

### Option A

- Good, because ...
- Bad, because ...

## More Information

Links, prior discussions, related ADRs.
```

## Writing rules

- Write in English. ADRs are referenced from code, configuration, and tooling, and a single language keeps them greppable.
- Use `-` bullets and `Because`/`However` phrasing sparingly; state facts plainly.
- Describe the decision as it is now, not the history of how it was reached.
- Never edit an accepted ADR's substance. Correcting a typo is fine; changing a decision is not.
- Link related ADRs bidirectionally when one supersedes or depends on another.

## Index

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-record-architecture-decisions.md) | Architecture decisions are recorded as ADRs | proposed |
| [0002](0002-documentation-placement.md) | Documentation lives at the lowest common ancestor of what it describes | proposed |
