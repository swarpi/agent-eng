import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, "templates");

const STRUCTURE = [
  "architecture/overview.md",
  "architecture/decisions/_template.md",
  "architecture/decisions/0001-how-we-work.md",
  "prompts/architect.md",
  "prompts/planner.md",
  "prompts/qa-tester.md",
  "prompts/reviewer.md",
  "prompts/system-architect.md",
  "specs/_template.md",
  "tickets/_template.md",
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
  console.log("  3. Start with the Architect: create your first ADR");
  console.log("");
}
