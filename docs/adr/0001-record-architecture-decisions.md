# Architecture decisions are recorded as ADRs

- Status: proposed
- Date: 2026-10-25
- Authors: LuoMuLoyal
- Deciders: LuoMuLoyal

## Context and Problem Statement

Architecture decisions across the repository are currently undocumented. Rationale is scattered across code comments, plan documents, and commit messages, and is unrecoverable once those artifacts are superseded or deleted. New contributors, including AI agents working in the tree, have no record of why the repository is structured the way it is.

How should we record architectural decisions so that their context and consequences survive the changes that follow them?

## Decision Drivers

- Decisions and their rationale must be discoverable without asking the original author.
- Records must be immutable: a decision that is later reversed should remain readable as it was made.
- The mechanism must require no new tooling or hosting.
- Records must be reviewed in the same pull request workflow as the code they concern.

## Considered Options

1. Create an ADR directory in the root of the repository
2. Record decisions in commit messages only
3. Record decisions in a wiki or external documentation site
4. Record decisions inline as expanded code comments

## Decision Outcome

Chosen option: **Create an ADR directory in the root of the repository**, because it is the only option that keeps decisions versioned, reviewable, and co-located with the code while requiring no additional infrastructure.

ADRs live in `docs/adr/`, are named `NNNN-kebab-case-title.md` with zero-padded sequential numbering, and follow the Nygard template.

### Consequences

- Good, because each decision carries its context, the options weighed, and the consequences, so a later reader can judge whether the decision still holds rather than taking it on authority.
- Good, because ADRs ride the normal pull request review, so an architectural change and its written rationale are reviewed together.
- Good, because records are plain Markdown in the repository, so they are diffable, greppable, and readable by AI agents without special tooling.
- Bad, because superseding a decision requires writing a new ADR and cross-linking it, which is more work than editing a wiki page in place.
- Bad, because an ADR describes a decision at a point in time and can drift from the implementation with nothing detecting the divergence.

### Confirmation

The decision is confirmed by the existence of `docs/adr/README.md` documenting the naming, status, and template conventions, and by subsequent architectural decisions arriving as numbered ADR files under that directory rather than as free-standing prose elsewhere.

## Pros and Cons of the Options

### Create an ADR directory in the root of the repository

- Good, because records are versioned with the code they describe and reviewed in the same pull request.
- Good, because the format is plain Markdown with no build step, no hosting, and no dependency.
- Good, because immutability is enforced by convention alone, which is sufficient when records are append-only files.
- Bad, because it introduces a second place for architectural narrative, competing with plan documents and code comments unless those are kept free of decision rationale.

### Record decisions in commit messages only

- Good, because it requires no new files and captures the decision at the moment it was made.
- Bad, because commit messages are not discoverable: reading them requires knowing which commit to look for.
- Bad, because there is no stable location to link to, so plan documents and READMEs cannot reference a decision.

### Record decisions in a wiki or external documentation site

- Good, because it is editable in place and supports rich navigation and search.
- Bad, because the content is not versioned with the code, so it silently diverges as the repository changes.
- Bad, because it sits outside pull request review, so there is no gate ensuring the record matches the change.

### Record decisions inline as expanded code comments

- Good, because the rationale is exactly where the reader encounters the code.
- Bad, because comments describe implementation, not the scope of a decision across the repository, and they fragment one decision into many locations.
- Bad, because comments are routinely deleted during refactors, taking the rationale with them.

## More Information

- Michael Nygard, [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html), the original ADR template this directory follows.
- [adr.github.io](https://adr.github.io/), the home of the ADR organization, including the [template index](https://adr.github.io/adr-templates/) and [tooling list](https://adr.github.io/adr-tooling/).
