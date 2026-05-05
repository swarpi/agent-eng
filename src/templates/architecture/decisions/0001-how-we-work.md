# ADR-0001: How We Work with AI Agents

**Status:** Accepted  
**Date:** 2026-05-04  
**Author:** swarpi

## Context

Working with AI coding assistants can be highly productive, but without structure it often leads to:
- Inconsistent code quality and style
- Decisions made without considering alternatives
- Lost context between sessions
- No clear separation between planning and execution

We need a workflow that maximizes the benefits of AI assistance while maintaining engineering rigor.

## Decision

We adopt a role-based workflow with four distinct agent modes:

1. **Architect** — Focuses on design decisions. Produces ADRs. Asks clarifying questions before deciding. Has read access to the codebase but does not write code.

2. **Planner** — Takes specs and ADRs as input. Decomposes work into tickets with clear acceptance criteria. Does not implement.

3. **Executor** — Implements tickets. Follows conventions. References the ticket and relevant ADRs. Proposes a plan before coding.

4. **Reviewer** — Reviews diffs against acceptance criteria and linked ADRs. Checks for convention violations. Does not fix issues directly — flags them for the executor.

All significant decisions are recorded as ADRs. All work items are tickets with acceptance criteria. Conventions are documented per-language.

## Consequences

### Positive

- Clear separation of concerns reduces cognitive overload per session
- ADRs create a searchable decision history
- Tickets with acceptance criteria make "done" unambiguous
- Conventions prevent style drift across sessions
- Role separation allows using different models for different tasks (e.g., larger model for architecture, faster model for execution)

### Negative

- More upfront documentation work
- Overhead may feel excessive for small changes
- Requires discipline to follow the process

### Neutral

- This is a personal workflow; team adoption would require additional coordination conventions

## Alternatives Considered

### Unstructured chat-based development

Just talk to the AI and let it write code directly. Rejected because it leads to inconsistent decisions and lost context.

### Heavy-process frameworks (e.g., full Agile ceremony)

Too heavyweight for a solo developer. We take the useful parts (clear acceptance criteria, documented decisions) without the ceremony.

### Separate human architect with AI executor

Keeps all design decisions with the human. Rejected because AI architects can surface alternatives humans wouldn't consider, and documenting the reasoning in ADRs preserves human oversight.
