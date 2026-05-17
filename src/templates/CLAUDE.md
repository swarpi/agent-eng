# Project

This project uses a hybrid agentic workflow: specialized agents handle process (decisions, planning, review), and Claude Code's plan mode handles execution.

## Workflow — Hybrid Approach

Agents own the **process** — architecture decisions, work decomposition, quality gates, and maintenance. Claude Code plan mode owns the **execution** — implementing individual tickets efficiently within a single session.

| Phase | How | When |
|-------|-----|------|
| **Decide** | `/architect` agent | New feature, significant design choice, unclear requirements |
| **Map** | `/system-architect` agent | New system or major structural change |
| **Decompose** | `/planner` agent | ADR/spec ready, work needs to be broken into tickets |
| **Execute** | Claude Code **plan mode** (`shift+tab`) | Implementing a specific ticket (includes writing tests) |
| **Review** | `/reviewer` agent | Code and tests ready for validation |
| **Learn** | `/learner` agent | Feature complete and introduced a new technology or concept |
| **Report** | `/summarizer` agent | Sprint or feature complete, stakeholder update needed |

### Why hybrid?

- Agents enforce **separation of concerns** — the Architect can't write code, the Reviewer can't fix issues
- Plan mode provides **speed and context continuity** — it explores, plans, and executes in one session
- Artifacts (ADRs, tickets, reviews) **persist across sessions** — plan mode's output is code, agents' output is documentation

### Choosing the right tool

**Use an agent** when the task produces a persistent artifact (ADR, ticket, review, summary) or when role separation matters (the person deciding shouldn't be the person implementing).

**Use plan mode** when you have a well-scoped ticket with clear acceptance criteria and want to go from plan to working code in one session.

**Quick fixes and bug fixes** don't need the full pipeline — use plan mode directly, or just implement without ceremony. The workflow exists to help, not to slow down trivial changes.

## Before Starting Any Feature

1. Check if an ADR exists in `architecture/decisions/` — if not, run `/architect` first
2. Check if tickets exist in `tickets/` — if not, run `/planner` first
3. For each ticket: use plan mode (`shift+tab`) to implement it
4. After implementation: run `/reviewer` to validate against acceptance criteria
5. If the ticket touches an existing ADR's scope, verify the decision still holds
6. If the feature introduced new technologies or concepts, run `/learner` for each one

## After Completing a Feature

When a feature is done and introduces new technologies, patterns, or concepts the user hasn't worked with before — automatically invoke `/learner` for each new concept. Look for:
- New libraries or frameworks added to dependencies
- New architectural patterns (e.g., event sourcing, SSE, pub/sub)
- New language features or APIs used for the first time
- New infrastructure concepts (e.g., WebSockets, gRPC, CRDT)

This ensures the user can confidently explain every technology in their project.

## Testing in Plan Mode

Plan mode writes tests as part of implementing each ticket. For every acceptance criterion:
1. Write at least one automated test that verifies it
2. Cover edge cases (empty, null, boundary values) and error handling
3. Run the tests and confirm they pass before marking the ticket done

Follow the project's existing test framework and patterns. Test observable behavior, not implementation details.

## Before Starting Any Ticket (in plan mode)

1. Read the ticket fully, including all linked documents
2. Read any referenced ADRs in `architecture/decisions/`
3. Check relevant conventions in `conventions/`
4. Let plan mode explore and propose the implementation plan
5. Verify the work end-to-end before marking done

## Sub-Agent Deployment

When work can be parallelized, spin up sub-agents for independent tasks concurrently.

### Model selection

| Complexity | Model | Use when |
|------------|-------|----------|
| **Low** | Haiku | File lookups, grep, reading docs, running tests, formatting |
| **Medium** | Sonnet | Multi-file changes, code review, writing tests |
| **High** | Opus | Architecture decisions, complex refactors, subtle bugs |

**Default to Haiku** unless the task requires multi-step reasoning or cross-file understanding.

## Key Files and Directories

- `architecture/decisions/` — Architecture Decision Records (ADRs)
- `architecture.yaml` — System architecture definition (components, connections, tiers)
- `orchestration.yaml` — Agent workflow definition (roles, outputs, connections)
- `specs/` — Feature specifications
- `tickets/` — Work items organized by feature folder, with `_backlog.md` as the sprint board
- `conventions/` — Language and framework coding standards
- `.claude/agents/` — Subagent definitions for each role
- `STATUS.md` — Live project dashboard (auto-updated git data + manually maintained context)

## CLAUDE.md Maintenance

Keep this file lean and current (target: under 200 lines). A hook warns when it exceeds the limit.
- When you discover a new gotcha or pattern, add it here or to the appropriate linked file
- Route large or specialized content to separate files (e.g., `conventions/`, `docs/`) and link from here
- Remove stale entries that no longer reflect how the project works
- Never duplicate information that already lives in a linked file

## STATUS.md Maintenance

STATUS.md is a live project dashboard. Git sections (branch, commits, file changes) auto-update via a hook on every commit/push. You maintain the semantic sections:

**Update after significant milestones** (completing a ticket, finishing a phase, hitting a blocker):
1. **Current Phase** — Mark the active workflow phase(s) from the table
2. **Active Work** — One paragraph: what feature/ticket is in progress, next step
3. **Open Tickets** — Snapshot from `tickets/_backlog.md`
4. **Risks & Blockers** — Add blockers; remove resolved ones
5. **Session Log** — One-line entry with today's date and what was accomplished

Keep updates brief. STATUS.md is a dashboard, not a report — use `/summarizer` for detailed retrospectives.

## MCP Servers

- **Context7** — Pulls up-to-date, version-specific documentation from live code libraries. Use `resolve` then `get-library-docs` before writing code that depends on a third-party library.

## Conventions

Check `conventions/` for language-specific standards. Always follow the conventions for the language you're working in.
