# Project

This project uses a structured agentic engineering workflow. Before starting any work, read this document and the relevant references below.

## Workflow

This project separates AI-assisted work into six roles. Each role has a dedicated system prompt in `prompts/`.

| Role | Prompt | Responsibility |
|------|--------|----------------|
| **Architect** | `prompts/architect.md` | Analyze requirements, ask clarifying questions, produce ADRs |
| **System Architect** | `prompts/system-architect.md` | Map and document system architecture as `architecture.yaml` |
| **Planner** | `prompts/planner.md` | Decompose specs and ADRs into actionable tickets |
| **Executor** | `prompts/executor.md` | Implement tickets, verify work before requesting feedback |
| **QA Tester** | `prompts/qa-tester.md` | Write automated tests for completed features |
| **Reviewer** | `prompts/reviewer.md` | Validate code and tests against acceptance criteria and ADRs |
| **Custodian** | `prompts/custodian.md` | Keep CLAUDE.md lean (≤200 lines), current, and routed to external files |

## Sub-Agent Deployment

When work can be parallelized, spin up sub-agents to handle independent tasks concurrently. Sub-agents research, test, or implement in isolation and report back to the main thread.

### When to deploy sub-agents

- **Research in parallel** — e.g., one sub-agent reads existing ADRs while another explores the codebase for relevant patterns
- **Test in parallel** — e.g., one sub-agent runs unit tests while another checks integration tests
- **Implement independent tickets** — tickets with no dependencies on each other can be executed simultaneously
- **Verify in parallel** — e.g., one sub-agent checks browser behavior while another reviews console output

### Model selection

Not every sub-agent needs the most powerful model. Choose the model based on task complexity:

| Complexity | Model | Use when |
|------------|-------|----------|
| **Low** | Haiku | File lookups, grep searches, reading docs, running tests, formatting, simple code generation |
| **Medium** | Sonnet | Multi-file changes, moderate reasoning, code review, writing tests |
| **High** | Opus | Architecture decisions, complex refactors, subtle bug investigation, cross-cutting changes |

**Default to Haiku for sub-agents** unless the task requires multi-step reasoning or cross-file understanding. Most research and verification tasks are Haiku-appropriate.

### How to deploy

Use the Agent tool with these parameters:
- `description` — Short label for what the sub-agent does
- `prompt` — Self-contained brief (the sub-agent has no context from the main thread)
- `model` — Set to `"haiku"` for simple tasks, `"sonnet"` for moderate, omit for complex (inherits parent model)
- `run_in_background` — Set to `true` when you don't need the result before continuing other work

### Rules

- **Make prompts self-contained** — Sub-agents don't see the main conversation. Include file paths, context, and what specifically to do or find.
- **Parallelize independent work** — Launch multiple sub-agents in a single message when their tasks don't depend on each other.
- **Don't delegate synthesis** — Sub-agents gather information; the main thread makes decisions. Never write "based on your findings, decide X."
- **Verify sub-agent output** — Sub-agents report what they intended, not necessarily what they achieved. Check their actual changes before reporting to the user.

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

## MCP Servers

- **Context7** — Pulls up-to-date, version-specific documentation from live code libraries (React, Next.js, etc.) before writing code. Configured in `.claude/settings.json`. Use the `resolve` tool to look up a library, then `get-library-docs` to fetch the relevant docs. Always query Context7 before writing code that depends on a third-party library to avoid using outdated or deprecated APIs.

## Conventions

Check `conventions/` for language-specific standards. Always follow the conventions for the language you're working in.
