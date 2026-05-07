# agent-eng

A zero-dependency Node.js CLI that scaffolds a structured agentic engineering workflow into any project.

## What This Package Does

Running `npx agent-eng init` creates a directory structure with system prompts, templates, and conventions for AI-assisted development. The workflow separates work into six roles:

- **Architect** — Analyzes requirements, asks clarifying questions, produces Architecture Decision Records (ADRs). Does not write code.
- **Planner** — Reads ADRs and specs, decomposes work into tickets with acceptance criteria. Does not implement.
- **Executor** — Implements tickets following documented conventions. Proposes a plan before coding.
- **QA Tester** — Writes automated tests for completed features. Covers acceptance criteria, edge cases, and regressions.
- **Reviewer** — Validates code and tests against acceptance criteria and ADRs. Flags issues but does not fix them.

## Project Structure

```
agent-eng/
├── package.json              # npm package config, bin entry point
├── bin/
│   └── agent-eng.js          # CLI entry point, calls src/index.js
├── src/
│   ├── index.js              # Arg parsing, help text, routes to commands
│   ├── init.js               # Core scaffolding logic — copies templates to target dir
│   └── templates/            # All files that get copied on `agent-eng init`
│       ├── .claude/
│       │   └── settings.json  # Claude Code project settings (MCP servers)
│       ├── CLAUDE.md          # Project instructions for AI agents
│       ├── orchestration.yaml # Machine-readable workflow definition
│       ├── architecture/
│       │   ├── overview.md    # High-level architecture overview
│       │   └── decisions/
│       │       ├── _template.md         # ADR template
│       │       └── 0001-how-we-work.md  # Seed ADR explaining the workflow
│       ├── prompts/
│       │   ├── architect.md   # System prompt for the Architect role
│       │   ├── custodian.md   # System prompt for the Custodian role
│       │   ├── executor.md    # System prompt for the Executor role
│       │   ├── planner.md     # System prompt for the Planner role
│       │   ├── qa-tester.md   # System prompt for the QA Tester role
│       │   └── reviewer.md    # System prompt for the Reviewer role
│       ├── specs/
│       │   └── _template.md   # Feature specification template
│       ├── tickets/
│       │   └── _template.md   # Work ticket template
│       └── conventions/
│           ├── typescript.md  # TypeScript coding standards
│           ├── python.md      # Python coding standards
│           └── java.md        # Java coding standards
```

## How the CLI Works

1. `bin/agent-eng.js` is the npm bin entry point — it calls `run()` from `src/index.js`
2. `src/index.js` parses args, shows help, and routes to the `init` command
3. `src/init.js` does the actual work:
   - Iterates over a hardcoded list of template files (`STRUCTURE` array)
   - Copies each file from `src/templates/` to the target directory
   - Convention files (typescript, python, java) are copied based on the `--conventions` flag
   - Existing files are skipped unless `--force` is passed
   - Reports what was created and what was skipped

## CLI Options

```
agent-eng init                              # Scaffold with all conventions
agent-eng init --conventions typescript     # Only TypeScript conventions
agent-eng init --conventions python,java    # Multiple conventions
agent-eng init --dir ./my-project           # Target a specific directory
agent-eng init --force                      # Overwrite existing files
```

## Adding a New Template File

1. Create the file in `src/templates/` at the desired path
2. Add the relative path to the `STRUCTURE` array in `src/init.js`
3. If it's a convention file, it's handled separately via the `--conventions` flag loop

## Adding a New Convention

1. Create `src/templates/conventions/<language>.md`
2. Add the language name to the `valid` set in `src/index.js` (`parseInitArgs` function)

## Adding a New Command

1. Add a new case in the `run()` function in `src/index.js`
2. Create a new module in `src/` for the command logic
3. Update the help text

## Key Design Decisions

- **Zero dependencies**: Uses only Node.js built-ins (`fs`, `path`, `url`). No prompting library, no template engine.
- **File copy, not generation**: Templates are static markdown files copied as-is. No variable interpolation or templating.
- **Safe by default**: Existing files are never overwritten unless `--force` is explicitly passed.
- **Convention files are opt-in**: The `--conventions` flag controls which language convention files are included. Defaults to all.
- **ESM**: The package uses ES modules (`"type": "module"` in package.json).

## Related Repositories

- [swarpi/agentic-workflow](https://github.com/swarpi/agentic-workflow) — The original workflow template this CLI is based on
- [swarpi/swarpi.github.io](https://github.com/swarpi/swarpi.github.io) — Portfolio site that visualizes the workflow
