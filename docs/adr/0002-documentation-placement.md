# Documentation lives at the lowest common ancestor of what it describes

- Status: proposed
- Date: 2026-10-25
- Authors: LuoMuLoyal
- Deciders: LuoMuLoyal
- Related: [0001](0001-record-architecture-decisions.md)

## Context and Problem Statement

Luminary is a monorepo holding three apps partitioned by distribution shape (`site`, `personal`, `lumine`) and one shared package (`packages/sync`). Documentation has grown without a placement rule, and the resulting symptoms are concrete:

- **The same fact is written in more than one place.** The repository layout is described in `README.md`, the deployment `basePath` is explained again in `docs/deployment.md`, and the task-graph constraints are explained a third time in the header comment of `turbo.jsonc`. There is no rule saying which one is authoritative, so all three drift independently.
- **Coverage is uneven.** `apps/lumine` has `README.md` and `PRODUCT.md`; `apps/personal` has `README.md`. `apps/site` and `packages/sync` have neither, even though they are the hardest to understand: `apps/site` owns static export, `basePath`, and Fumadocs; `packages/sync` owns every synchronization and gating rule.
- **Stale content is invisible.** The structure tree in `README.md` lists `apps/lucid/`; the directory has been `apps/lumine/` for some time. Nothing detects this, and nothing will.
- **Existing automation covers one direction only.** `packages/sync` exposes `verify:docs`, which checks that synchronization produced the expected sections and that hand-written pages exist. It validates imported content from sibling repositories, and places no constraint whatsoever on Luminary's own documentation.

How should documentation be placed and maintained so that each fact has one home, and so that documentation is updated by the same change that invalidates it?

## Decision Drivers

- A given fact must have exactly one authoritative location, so that readers and AI agents do not have to reconcile copies.
- Placement must be decidable without discussion, for any new document, by anyone.
- Documentation must be updatable in the same pull request as the code it describes, so review enforces freshness.
- The rule set must not assume a documentation team, a wiki, or infrastructure beyond the repository.
- The mechanism must not duplicate what `verify:docs` already does.

## Considered Options

1. Locate documentation at the lowest common ancestor of what it describes
2. Centralize all documentation into a single repository or site
3. Distribute documentation per app with no cross-cutting home
4. Leave placement to per-change judgement

## Decision Outcome

Chosen option: **Locate documentation at the lowest common ancestor of what it describes**, because it is the only option that keeps close-to-code documentation reviewable in the same pull request while still giving cross-cutting material a single definite home.

The rule resolves in this order; the first match wins:

1. Content describing the implementation of one app or package lives in that directory's `README.md`.
2. Content spanning two or more apps or packages, or describing the repository itself, lives in `docs/` at the repository root.
3. A one-shot execution plan lives in `plans/`, and is deleted when executed.
4. An adopted architectural decision lives in `docs/adr/` as a numbered ADR.

Three supporting conventions follow from the same principle:

**Documentation starts as `README.md` and splits into `docs/` only when it outgrows one file.** When it does, `README.md` becomes an index and the detail moves beside it. No empty `docs/` directories are pre-created, and no directory is split for symmetry.

**AI instruction files are not documentation.** `AGENTS.md` and `CLAUDE.md` describe how an agent should behave, not what is true about the system. Knowledge must not live in them, because that gives it a second home. This matters concretely here: the root `AGENTS.md` is currently overwritten by a Next.js generated block, which demonstrates exactly why it is unsuitable as a home for documentation conventions.

**Deletion is maintenance, and staleness must be marked.** When code is removed, the documentation describing it is removed in the same change. Moving a document is a strict move: the old location is deleted and known inbound links are updated. Documents known to be outdated but not yet correctable carry a banner at the top:

```
> ⚠️ Outdated (YYYY-MM-DD): <what changed>, per <link>. Fix tracked by <work item>.
```

ADRs are exempt from deletion. A decision that has been reversed is marked `superseded` with a link to its successor, and its text is never rewritten.

### Consequences

- Good, because every document has one decidable home, so placement stops being a recurring discussion and starts being a lookup.
- Good, because app-local documentation rides the same pull request as the app-local change, so review acts as the freshness gate without additional tooling.
- Good, because the rule composes with `verify:docs` rather than replacing it: `verify:docs` guards the integrity of imported content, and this rule governs the repository's own documentation.
- Good, because removing the ambiguity between `README.md`, `docs/`, and `plans/` makes the repository legible to AI agents without special instruction files.
- Bad, because existing content violates the rule in ways that must be corrected incrementally. `README.md` describes a directory that no longer exists, and `apps/site` and `packages/sync` have no `README.md` at all. A sweeping corrective change is high-risk and will not happen in one step, so violations will persist until each file is touched.
- Bad, because the "update documentation in the same pull request" obligation is enforced by human review alone. It is the weakest link in the scheme and will be skipped under time pressure.
- Bad, because placement of borderline content requires judgement. Material that is app-specific in origin but cross-cutting in relevance can plausibly satisfy both branches of the decision rule, and the rule resolves the tie by saying it belongs in `docs/`, which may strand the reader far from the code.

### Confirmation

Compliance is confirmed by inspection at review time: a change adding or moving documentation is checked against the decision rule, and a change to an app or package is checked for a corresponding `README.md` or `docs/` update. The `docs/adr/README.md` index is updated when an ADR is added.

No automated check is defined by this ADR.

## Pros and Cons of the Options

### Locate documentation at the lowest common ancestor of what it describes

- Good, because the rule is decidable: the scope of what a document describes determines its location, with no appeal to team convention.
- Good, because it preserves the main benefit of close-to-code documentation without forfeiting a home for cross-cutting material.
- Good, because it is a convention requiring no tooling, so it survives dependency changes and CI rewrites.
- Bad, because "what does this describe" is itself a judgement call, and a document that drifts in scope must move, which costs a strict move with link updates.
- Bad, because there is no automated enforcement, so the rule degrades silently when reviewers are busy.

### Centralize all documentation into a single repository or site

- Good, because it makes organization-wide automation straightforward: one lint configuration, one link checker, one search index.
- Good, because a single navigation surface removes duplication across repositories.
- Bad, because it is motivated by decentralized multi-repository setups where per-repository tooling cannot be applied uniformly. Luminary is a single repository with a single toolchain, so the motivating problem does not exist here.
- Bad, because documentation leaves the pull request that changes the behaviour it describes, which is precisely the freshness guarantee this repository wants.

### Distribute documentation per app with no cross-cutting home

- Good, because it maximizes proximity: every document sits next to the code it concerns.
- Bad, because repository-wide subjects such as deployment topology, CI structure, and the synchronization pipeline have no natural app to own them, so each app would restate the parts it needs.
- Bad, because it reproduces the current duplication under a rule that actively encourages it.

### Leave placement to per-change judgement

- Good, because it requires no up-front decision and adapts to each change.
- Bad, because it is the status quo, and every symptom listed in the problem statement follows from it.

## More Information

- Bitwarden, [ADR-0034: Adopt engineering documentation standard](https://contributing.bitwarden.com/architecture/adr/adopt-engineering-documentation-standard/) and the resulting [Documentation standard](https://contributing.bitwarden.com/contributing/documentation/), which state the lowest-common-ancestor rule and the stale-marker convention this ADR adopts. Bitwarden's standard additionally mandates Vale, cspell, `CODEOWNERS` ownership, and a doc-parity plugin; those are deliberately not adopted here, because their benefit accrues to organizations with many contributors and many repositories.
- Grab Engineering, [From decentralized Docs-as-Code to a centralized repository](https://engineering.grab.com/evolving-documentation-strategy), the basis for rejecting centralized documentation here: their move to a central repository was driven by multi-repository tooling inconsistency, which a single repository does not experience.
- [adr.github.io](https://adr.github.io/) for the ADR conventions used by [0001](0001-record-architecture-decisions.md).

