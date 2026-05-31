# agent-eng

Scaffold a structured agentic engineering workflow into any project. One command sets up the directory structure, agent prompts, templates, and conventions for AI-assisted development using a **hybrid approach**: specialized agents own the process (decisions, planning, review), and Claude Code's built-in plan mode owns execution.

## Quick Start

```bash
npx agent-eng init
```

Preview what will be created before writing anything:

```bash
npx agent-eng init --dry-run
```

### What gets created

```
├── CLAUDE.md                              # Project instructions for AI agents
├── orchestration.yaml                     # Agent workflow definition (roles, outputs)
├── architecture.yaml                      # System architecture template (components, connections)
├── STATUS.md                              # Live project dashboard (auto-updated)
├── .claude/
│   ├── settings.json                      # Claude Code project settings (hooks)
│   ├── scripts/
│   │   └── update-status.sh               # Auto-updates STATUS.md on commit/push
│   └── agents/                            # Claude Code subagents
│       ├── architect.md                   # Design decisions and ADRs
│       ├── system-architect.md            # Runtime architecture mapping
│       ├── planner.md                     # Work decomposition into tickets
│       ├── reviewer.md                    # Automatic review and ticket tracking
│       ├── code-auditor.md                # Optional structural quality audit
│       ├── learner.md                     # Deep-dive learning for technologies used
│       └── html-summarizer.md              # Visual HTML slide decks for stakeholders
├── architecture/
│   ├── overview.md                        # High-level architecture overview
│   └── decisions/
│       ├── _template.md                   # ADR template
│       └── 0001-how-we-work.md            # Seed ADR explaining the workflow
├── specs/
│   └── _template.md                       # Feature specification template
├── tickets/
│   ├── _template.md                       # Work ticket template
│   ├── _backlog.md                        # Sprint board
│   └── example/
│       └── 001-example-ticket.md          # Example ticket
└── conventions/
    ├── typescript.md                      # TypeScript coding standards
    ├── python.md                          # Python coding standards
    └── java.md                            # Java coding standards
```

## Usage

```bash
agent-eng init                              # Scaffold with all conventions
agent-eng init --conventions typescript     # Only TypeScript conventions
agent-eng init --conventions python,java    # Multiple conventions
agent-eng init --dir ./my-project           # Target a specific directory
agent-eng init --force                      # Overwrite existing files
agent-eng init --dry-run                    # Preview without writing
```

Existing files are never overwritten unless `--force` is passed. Project state files (tickets, specs, architecture docs) are additionally protected — they require `--force` even when other files are being updated.

## The Workflow

Agents own the **process** — architecture decisions, work decomposition, quality gates. Claude Code plan mode (`shift+tab`) owns the **execution** — implementing tickets in focused sessions.

| Phase | How | What it produces |
|-------|-----|------------------|
| **Decide** | `/architect` agent | ADRs, specs, constraints |
| **Map** | `/system-architect` agent | `architecture.yaml` |
| **Decompose** | `/planner` agent | Tickets with acceptance criteria |
| **Execute** | Plan mode (`shift+tab`) | Code and tests |
| **Review** | `/reviewer` agent *(automatic)* | Approval or feedback, ticket/backlog updates |
| **Audit** | `/code-auditor` agent *(optional)* | Severity-ranked structural findings |
| **Learn** | `/learner` agent | Technology deep-dives with interview prep |
| **Report** | `/html-summarizer` agent | Visual HTML slide decks |

### When to use what

- **New feature or significant decision** — Start with `/architect`, then full pipeline
- **Well-scoped ticket** — Plan mode directly
- **Bug fix or small change** — Just implement, no ceremony needed

The reviewer runs automatically after each ticket to validate acceptance criteria, update ticket status, and sync the backlog.

## YAML Definitions

**`orchestration.yaml`** defines the agent roles, their outputs, and how they connect. Used to visualize the development workflow.

**`architecture.yaml`** defines the runtime system components, their tiers, technologies, subcomponents, and connections with protocols. Used to visualize the system architecture.

## After Initialization

1. **Review `CLAUDE.md`** — Customize the project instructions for your stack
2. **Pick your conventions** — Keep the ones that match, remove the rest
3. **Start with the Architect** — Ask Claude to use the `architect` agent to create your first ADR
4. **Map the system** — Use `/system-architect` to document your runtime architecture
5. **Plan the work** — Use `/planner` to decompose your ADR into tickets
6. **Execute** — Use plan mode (`shift+tab`) to implement each ticket
7. **Review happens automatically** — The reviewer validates and updates tracking after each ticket

## License

MIT
