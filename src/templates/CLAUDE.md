# Project

This project uses a structured agentic engineering workflow. Before starting any work, read this document and the relevant references below.

## Workflow

This project separates AI-assisted work into six roles. Each role has a dedicated system prompt in `prompts/`.

| Role | Prompt | Responsibility |
|------|--------|----------------|
| **Architect** | `prompts/architect.md` | Analyze requirements, ask clarifying questions, produce ADRs |
| **System Architect** | `prompts/system-architect.md` | Map and document system architecture as `architecture.yaml` |
| **Planner** | `prompts/planner.md` | Decompose specs and ADRs into actionable tickets |
| **Executor** | _(you, the coding agent)_ | Implement tickets following conventions |
| **QA Tester** | `prompts/qa-tester.md` | Write automated tests for completed features |
| **Reviewer** | `prompts/reviewer.md` | Validate code and tests against acceptance criteria and ADRs |

## Before Starting Any Ticket

1. Read the ticket fully, including all linked documents
2. Read any referenced ADRs in `architecture/decisions/`
3. Check if there's a relevant spec in `specs/`
4. Propose a plan before writing code — get alignment first
5. If the ticket touches an existing ADR's scope, verify the decision still holds

## Key Files and Directories

- `architecture/decisions/` — Architecture Decision Records (ADRs)
- `architecture.yaml` — System architecture definition (components, connections, tiers)
- `orchestration.yaml` — Agent workflow definition (roles, outputs, connections)
- `specs/` — Feature specifications
- `tickets/` — Work items organized by feature folder, with `_backlog.md` as the sprint board
- `conventions/` — Language and framework coding standards
- `prompts/` — System prompts for each agent role

## Conventions

Check `conventions/` for language-specific standards. Always follow the conventions for the language you're working in.
