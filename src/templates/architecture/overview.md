# Architecture Overview

This document provides a high-level view of the system architecture.

## Core Principles

1. **Separation of concerns** — Different cognitive tasks get different prompts and contexts
2. **Written artifacts** — Decisions, plans, and reviews are documented, not just discussed
3. **Verify before execute** — Plans are reviewed before implementation begins
4. **Single source of truth** — Each piece of information lives in one canonical place

## The Flow

```
Requirement → Architect → ADR/Spec → Planner → Tickets → Executor → Code → Reviewer → Merged
```

## Artifact Types

| Artifact | Purpose | Location |
|----------|---------|----------|
| ADR | Record architectural decisions | `architecture/decisions/` |
| Spec | Define feature requirements | `specs/` |
| Ticket | Actionable work item | `tickets/` |
| Convention | Language/framework standards | `conventions/` |
