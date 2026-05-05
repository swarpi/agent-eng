# agent-eng

Scaffold a structured agentic engineering workflow into any project. Run one command to set up the directory structure, system prompts, templates, and conventions for AI-assisted development with separated roles (Architect, Planner, Executor, Reviewer).

## Quick Start

```bash
npx agent-eng init
```

This creates the following structure in your project:

```
├── CLAUDE.md                              # Project instructions for AI agents
├── orchestration.yaml                     # Machine-readable workflow definition
├── architecture/
│   ├── overview.md                        # High-level architecture overview
│   └── decisions/
│       ├── _template.md                   # ADR template
│       └── 0001-how-we-work.md            # Seed ADR: the workflow itself
├── prompts/
│   ├── architect.md                       # System prompt for the Architect role
│   ├── planner.md                         # System prompt for the Planner role
│   └── reviewer.md                        # System prompt for the Reviewer role
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

The scaffolded workflow separates AI-assisted engineering into four roles:

| Role | What it does | What it produces |
|------|-------------|-----------------|
| **Architect** | Analyzes requirements, asks clarifying questions, evaluates alternatives | Architecture Decision Records (ADRs) |
| **Planner** | Reads ADRs and specs, decomposes work into focused chunks | Tickets with acceptance criteria |
| **Executor** | Implements tickets following conventions, proposes plan first | Code and PRs |
| **Reviewer** | Validates code against acceptance criteria and ADRs | Approval or actionable feedback |

Each role has a dedicated system prompt in `prompts/` that you can load into your AI assistant to set the context for that type of work.

## After Initialization

1. **Review `CLAUDE.md`** — Customize the project instructions for your specific project
2. **Pick your conventions** — Keep the ones that match your stack, remove the rest
3. **Start with the Architect** — Load `prompts/architect.md` and create your first ADR for a design decision
4. **Plan the work** — Load `prompts/planner.md` and decompose your ADR into tickets
5. **Execute** — Pick up a ticket and implement it following your conventions
6. **Review** — Load `prompts/reviewer.md` to validate the work

## License

MIT
