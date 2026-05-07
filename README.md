# agent-eng

Scaffold a structured agentic engineering workflow into any project. Run one command to set up the directory structure, system prompts, templates, and conventions for AI-assisted development with separated roles (Architect, Planner, Executor, Reviewer) and system architecture documentation.

## Quick Start

```bash
npx agent-eng init
```

This creates the following structure in your project:

```
├── CLAUDE.md                              # Project instructions for AI agents
├── orchestration.yaml                     # Agent workflow definition (roles, outputs)
├── architecture.yaml                      # System architecture definition (components, connections)
├── .claude/
│   ├── settings.json                      # Claude Code project settings (MCP servers)
│   └── agents/                            # Auto-wired Claude Code subagents — invoke via Agent tool
│       ├── architect.md
│       ├── system-architect.md
│       ├── planner.md
│       ├── executor.md
│       ├── qa-tester.md
│       ├── reviewer.md
│       └── custodian.md
├── architecture/
│   ├── overview.md                        # High-level architecture overview
│   └── decisions/
│       ├── _template.md                   # ADR template
│       └── 0001-how-we-work.md            # Seed ADR: the workflow itself
├── specs/
│   └── _template.md                       # Feature specification template
├── tickets/
│   └── _template.md                       # Work ticket template
└── conventions/
    ├── typescript.md                      # TypeScript coding standards
    ├── python.md                          # Python coding standards
    └── java.md                            # Java coding standards
```

## Usage

### Initialize with all conventions (default)

```bash
agent-eng init
```

### Pick specific conventions

```bash
agent-eng init --conventions typescript,python
```

### Initialize in a specific directory

```bash
agent-eng init --dir ./my-project
```

### Overwrite existing files

```bash
agent-eng init --force
```

## The Workflow

The scaffolded workflow separates AI-assisted engineering into five roles:

| Role | What it does | What it produces |
|------|-------------|-----------------|
| **Architect** | Analyzes requirements, asks clarifying questions, evaluates alternatives | Architecture Decision Records (ADRs) |
| **System Architect** | Maps the runtime system: components, connections, protocols, tiers | `architecture.yaml` |
| **Planner** | Reads ADRs and specs, decomposes work into focused chunks | Tickets with acceptance criteria |
| **Executor** | Implements tickets following conventions, proposes plan first | Code and PRs |
| **Reviewer** | Validates code against acceptance criteria and ADRs | Approval or actionable feedback |

Each role is wired as a Claude Code subagent in `.claude/agents/`. Invoke them via the Agent tool (`subagent_type: "architect"`, etc.), or just describe the task — Claude will route to the right subagent based on each agent's `description` frontmatter.

## YAML Definitions

### `orchestration.yaml` — Agent Workflow

Defines the agent roles, their outputs, and how they connect. Used to visualize the development workflow.

### `architecture.yaml` — System Architecture

Defines the runtime system components, their tiers (client/service/engine/data), technologies, subcomponents, and connections with protocols. Used to visualize the system architecture.

## After Initialization

1. **Review `CLAUDE.md`** — Customize the project instructions for your specific project
2. **Pick your conventions** — Keep the ones that match your stack, remove the rest
3. **Start with the Architect** — Ask Claude to use the `architect` subagent to create your first ADR
4. **Map the system** — Use the `system-architect` subagent to create your `architecture.yaml`
5. **Plan the work** — Use the `planner` subagent to decompose your ADR into tickets
6. **Execute** — Use the `executor` subagent to implement a ticket following your conventions
7. **Test & Review** — Use the `qa-tester` and `reviewer` subagents to validate the work

## License

MIT
