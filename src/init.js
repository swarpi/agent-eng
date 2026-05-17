import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, "templates");

const STRUCTURE = [
  ".claude/settings.json",
  ".claude/scripts/update-status.sh",
  ".claude/agents/architect.md",
  ".claude/agents/executor.md",
  ".claude/agents/planner.md",
  ".claude/agents/reviewer.md",
  ".claude/agents/summarizer.md",
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
  "STATUS.md",
];

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function applyFile(src, dest, action) {
  mkdirSync(dirname(dest), { recursive: true });
  if (action === "append") {
    const content = readFileSync(src, "utf8");
    appendFileSync(dest, "\n\n" + content);
  } else {
    cpSync(src, dest);
  }
}

export async function init(options) {
  const target = resolve(options.dir);
  const created = [];
  const skipped = [];

  const allFiles = [
    ...STRUCTURE,
    "CLAUDE.md",
    ...options.conventions.map((c) => `conventions/${c}.md`),
  ];

  const existing = [];
  const fresh = [];

  for (const file of allFiles) {
    const dest = join(target, file);
    if (existsSync(dest) && !options.force) {
      existing.push(file);
    } else {
      fresh.push(file);
    }
  }

  for (const file of fresh) {
    const src = join(TEMPLATES, file);
    const dest = join(target, file);
    applyFile(src, dest, "replace");
    created.push(file);
  }

  if (existing.length > 0 && !options.force) {
    console.log("");
    console.log(`${existing.length} file(s) already exist:`);
    for (const f of existing) {
      console.log(`  ${f}`);
    }
    console.log("");
    console.log("  1) Skip all — keep existing files (default)");
    console.log("  2) Append all — add agent-eng content to the end of each");
    console.log("  3) Replace all — overwrite all with agent-eng templates");
    console.log("  4) Decide per file — choose for each file individually");
    console.log("  5) Pick files — specify which files to append/replace");
    const answer = await prompt("Choose [1/2/3/4/5] (default: 1): ");

    if (answer === "2" || answer === "append") {
      for (const file of existing) {
        applyFile(join(TEMPLATES, file), join(target, file), "append");
        created.push(`${file} (appended)`);
      }
    } else if (answer === "3" || answer === "replace") {
      for (const file of existing) {
        applyFile(join(TEMPLATES, file), join(target, file), "replace");
        created.push(`${file} (replaced)`);
      }
    } else if (answer === "4") {
      for (const file of existing) {
        console.log("");
        console.log(`  ${file}:`);
        console.log("    1) Skip  2) Append  3) Replace");
        const choice = await prompt("    Choose [1/2/3] (default: 1): ");
        if (choice === "2" || choice === "append") {
          applyFile(join(TEMPLATES, file), join(target, file), "append");
          created.push(`${file} (appended)`);
        } else if (choice === "3" || choice === "replace") {
          applyFile(join(TEMPLATES, file), join(target, file), "replace");
          created.push(`${file} (replaced)`);
        } else {
          skipped.push(file);
        }
      }
    } else if (answer === "5") {
      console.log("");
      console.log("Enter file numbers to append/replace (comma-separated):");
      for (let i = 0; i < existing.length; i++) {
        console.log(`  ${i + 1}) ${existing[i]}`);
      }
      const picks = await prompt("Files to modify (e.g. 1,3): ");
      const indices = picks
        .split(",")
        .map((s) => parseInt(s.trim(), 10) - 1)
        .filter((i) => i >= 0 && i < existing.length);

      const picked = new Set(indices);
      for (let i = 0; i < existing.length; i++) {
        if (!picked.has(i)) {
          skipped.push(existing[i]);
          continue;
        }
        const file = existing[i];
        console.log(`  ${file}: 1) Append  2) Replace`);
        const action = await prompt("  Choose [1/2] (default: 1): ");
        if (action === "2" || action === "replace") {
          applyFile(join(TEMPLATES, file), join(target, file), "replace");
          created.push(`${file} (replaced)`);
        } else {
          applyFile(join(TEMPLATES, file), join(target, file), "append");
          created.push(`${file} (appended)`);
        }
      }
    } else {
      skipped.push(...existing);
    }
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
    console.log("Skipped (already exist):");
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
