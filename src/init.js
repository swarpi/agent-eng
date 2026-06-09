import { appendFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = join(__dirname, "templates");

const FRAMEWORK_FILES = [
  ".claude/settings.json",
  ".claude/scripts/update-status.sh",
  ".claude/agents/architect.md",
  ".claude/agents/code-auditor.md",
  ".claude/agents/learner.md",
  ".claude/agents/planner.md",
  ".claude/agents/ticket-verifier.md",
  ".claude/agents/html-summarizer.md",
  ".claude/agents/system-architect.md",
  ".claude/agents/system-design.md",
  "orchestration.yaml",
  "conventions/folio.md",
  "learnings/_deck-template.html",
  "learnings/_longform-template.html",
  "learnings/deck-stage.js",
  "summaries/_slide-template.html",
  "architecture/_sketch-template.html",
];

const PROJECT_STATE_FILES = [
  "architecture/overview.md",
  "architecture/decisions/_template.md",
  "architecture/decisions/0001-how-we-work.md",
  "specs/_template.md",
  "tickets/_template.md",
  "tickets/_backlog.md",
  "tickets/example/001-example-ticket.md",
  "architecture.yaml",
  "STATUS.md",
];

const PROJECT_STATE_SET = new Set(PROJECT_STATE_FILES);
const STRUCTURE = [...FRAMEWORK_FILES, ...PROJECT_STATE_FILES];

export { FRAMEWORK_FILES, PROJECT_STATE_FILES };

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
  const protectedFiles = [];

  for (const file of allFiles) {
    const dest = join(target, file);
    if (!existsSync(dest)) {
      fresh.push(file);
    } else if (options.force) {
      fresh.push(file);
    } else if (PROJECT_STATE_SET.has(file)) {
      protectedFiles.push(file);
    } else {
      existing.push(file);
    }
  }

  if (options.dryRun) {
    console.log("");
    console.log("Dry run — no files will be written.");

    if (fresh.length > 0) {
      console.log("");
      console.log("Would create:");
      for (const f of fresh) {
        console.log(`  ${f}`);
      }
    }

    if (existing.length > 0) {
      console.log("");
      console.log("Would conflict (already exist):");
      for (const f of existing) {
        console.log(`  ${f}`);
      }
    }

    if (protectedFiles.length > 0) {
      console.log("");
      console.log("Protected (project state — would need --force):");
      for (const f of protectedFiles) {
        console.log(`  ${f}`);
      }
    }

    console.log("");
    return;
  }

  if (options.upgrade) {
    const toMerge = [...existing, ...protectedFiles];

    for (const file of fresh) {
      const src = join(TEMPLATES, file);
      const dest = join(target, file);
      applyFile(src, dest, "replace");
      created.push(file);
    }

    if (toMerge.length > 0) {
      const upgradeDir = join(target, ".agent-eng-upgrade");
      mkdirSync(upgradeDir, { recursive: true });

      for (const file of toMerge) {
        const src = join(TEMPLATES, file);
        const dest = join(upgradeDir, file);
        mkdirSync(dirname(dest), { recursive: true });
        cpSync(src, dest);
        created.push(`${file} (staged for AI merge)`);
      }

      const instructions = [
        "# AI Merge Instructions",
        "",
        "New agent-eng template versions have been staged in this directory.",
        "For each file below, merge the new version with the existing project file,",
        "preserving the user's customizations while incorporating new template content.",
        "",
        "## Files to merge",
        "",
        ...toMerge.map((f) => `- \`${f}\` (new) → \`../${f}\` (existing)`),
        "",
        "## Guidelines",
        "",
        "- Preserve project-specific customizations (names, descriptions, settings)",
        "- Add new sections, agents, or fields from the template that don't exist yet",
        "- Update boilerplate sections (process, output format) to the new version",
        "- If a section was intentionally removed by the user, don't re-add it",
        "- When in doubt, keep the user's version and note what was skipped",
        "",
        "After merging, delete this `.agent-eng-upgrade/` directory.",
        "",
      ];
      writeFileSync(join(upgradeDir, "MERGE.md"), instructions.join("\n"));
    }

    console.log("");
    console.log("✔ Upgrade staged");
    if (toMerge.length > 0) {
      console.log("");
      console.log("Staged for AI merge (.agent-eng-upgrade/):");
      for (const f of toMerge) {
        console.log(`  ${f}`);
      }
      console.log("");
      console.log("Your AI coding agent can now merge these with your existing files.");
      console.log("See .agent-eng-upgrade/MERGE.md for instructions.");
      console.log("Delete .agent-eng-upgrade/ when done.");
    }

    if (created.filter((f) => !f.includes("staged")).length > 0) {
      console.log("");
      console.log("Created (new files):");
      for (const f of created) {
        if (!f.includes("staged")) console.log(`  ${f}`);
      }
    }

    console.log("");
    return;
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
    console.log("  6) AI take the wheel — stage new versions and let your AI coding agent merge them");
    const answer = await prompt("Choose [1/2/3/4/5/6] (default: 1): ");

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
    } else if (answer === "6" || answer === "ai") {
      const inAgent = !!process.env.CLAUDE_PROJECT_DIR;
      let proceed = inAgent;

      if (!inAgent) {
        console.log("");
        console.log("  This option stages the new template versions for an AI coding agent");
        console.log("  (Claude Code, Copilot, Cursor, etc.) to intelligently merge with your");
        console.log("  existing files. It works best when run inside an AI coding agent session.");
        console.log("");
        const confirm = await prompt("  Are you running inside an AI coding agent? [y/N]: ");
        proceed = confirm === "y" || confirm === "yes";
      }

      if (!proceed) {
        console.log("");
        console.log("  Recommended: run `npx agent-eng init` inside your AI coding agent.");
        console.log("  The agent will see the staged files and merge them for you.");
        skipped.push(...existing);
      } else {
        const upgradeDir = join(target, ".agent-eng-upgrade");
        mkdirSync(upgradeDir, { recursive: true });

        for (const file of existing) {
          const src = join(TEMPLATES, file);
          const dest = join(upgradeDir, file);
          mkdirSync(dirname(dest), { recursive: true });
          cpSync(src, dest);
          created.push(`${file} (staged for AI merge)`);
        }

        const instructions = [
          "# AI Merge Instructions",
          "",
          "New agent-eng template versions have been staged in this directory.",
          "For each file below, merge the new version with the existing project file,",
          "preserving the user's customizations while incorporating new template content.",
          "",
          "## Files to merge",
          "",
          ...existing.map((f) => `- \`${f}\` (new) → \`../${f}\` (existing)`),
          "",
          "## Guidelines",
          "",
          "- Preserve project-specific customizations (names, descriptions, settings)",
          "- Add new sections, agents, or fields from the template that don't exist yet",
          "- Update boilerplate sections (process, output format) to the new version",
          "- If a section was intentionally removed by the user, don't re-add it",
          "- When in doubt, keep the user's version and note what was skipped",
          "",
          "After merging, delete this `.agent-eng-upgrade/` directory.",
          "",
        ];
        writeFileSync(join(upgradeDir, "MERGE.md"), instructions.join("\n"));

        console.log("");
        console.log("  Staged new versions in .agent-eng-upgrade/");
        console.log("  Your AI coding agent can now merge them with your existing files.");
        console.log("  See .agent-eng-upgrade/MERGE.md for instructions.");
        console.log("  Delete .agent-eng-upgrade/ when done.");
      }
    } else {
      skipped.push(...existing);
    }
  }

  if (protectedFiles.length > 0) {
    console.log("");
    console.log("Protected (project state — use --force to overwrite):");
    for (const f of protectedFiles) {
      console.log(`  ${f}`);
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
  console.log("  3. Start with the Architect: ask Claude to use the 'architect' agent to create your first ADR");
  console.log("");
}
