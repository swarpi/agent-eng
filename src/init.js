import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, "templates");

const STRUCTURE = [
  ".github/workflows/notify-site.yml",
  ".claude/settings.json",
  ".claude/agents/architect.md",
  ".claude/agents/custodian.md",
  ".claude/agents/executor.md",
  ".claude/agents/planner.md",
  ".claude/agents/qa-tester.md",
  ".claude/agents/reviewer.md",
  ".claude/agents/system-architect.md",
  "architecture/overview.md",
  "architecture/decisions/_template.md",
  "architecture/decisions/0001-how-we-work.md",
  "specs/_template.md",
  "tickets/_template.md",
  "tickets/_backlog.md",
  "tickets/example/001-example-ticket.md",
  "orchestration.yaml",
  "architecture.yaml",
  "CLAUDE.md",
];

export function init(options) {
  const target = resolve(options.dir);
  const created = [];
  const skipped = [];

  for (const file of STRUCTURE) {
    const dest = join(target, file);
    const src = join(TEMPLATES, file);

    if (existsSync(dest) && !options.force) {
      skipped.push(file);
      continue;
    }

    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest);
    created.push(file);
  }

  for (const convention of options.conventions) {
    const file = `conventions/${convention}.md`;
    const dest = join(target, file);
    const src = join(TEMPLATES, file);

    if (existsSync(dest) && !options.force) {
      skipped.push(file);
      continue;
    }

    mkdirSync(dirname(dest), { recursive: true });
    cpSync(src, dest);
    created.push(file);
  }

  console.log("");
  console.log("✔ Agentic workflow initialized");
  console.log("");

  if (created.length > 0) {
    console.log("Created:");
    for (const f of created) {
      console.log(`  ${f}`);
    }
  }

  if (skipped.length > 0) {
    console.log("");
    console.log("Skipped (already exist, use --force to overwrite):");
    for (const f of skipped) {
      console.log(`  ${f}`);
    }
  }

  console.log("");
  console.log("Next steps:");
  console.log("  1. Review CLAUDE.md and customize for your project");
  console.log("  2. Pick the conventions that match your stack");
  console.log("  3. Start with the Architect subagent: ask Claude to use the 'architect' agent to create your first ADR");
  console.log("  4. Add the SITE_REBUILD_TOKEN secret and 'showcase' topic to enable auto site rebuilds");
  console.log("");
}
