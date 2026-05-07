import { init } from "./init.js";

const HELP = `
agent-eng — scaffold an agentic engineering workflow

Usage:
  agent-eng init [options]     Set up the workflow in the current directory

Options:
  --conventions <list>   Comma-separated list: typescript,python,java (default: all)
  --dir <path>           Target directory (default: current directory)
  --force                Overwrite existing files
  -h, --help             Show this help

Examples:
  agent-eng init
  agent-eng init --conventions typescript,python
  agent-eng init --dir ./my-project --conventions java
`;

export async function run(args) {
  const command = args[0];

  if (!command || command === "-h" || command === "--help") {
    console.log(HELP.trim());
    process.exit(0);
  }

  if (command === "init") {
    const options = parseInitArgs(args.slice(1));
    await init(options);
    return;
  }

  console.error(`Unknown command: ${command}`);
  console.log('Run "agent-eng --help" for usage.');
  process.exit(1);
}

function parseInitArgs(args) {
  const options = {
    conventions: ["typescript", "python", "java"],
    dir: process.cwd(),
    force: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--conventions":
        options.conventions = args[++i]?.split(",").map((s) => s.trim()) ?? [];
        break;
      case "--dir":
        options.dir = args[++i];
        break;
      case "--force":
        options.force = true;
        break;
      case "-h":
      case "--help":
        console.log(HELP.trim());
        process.exit(0);
    }
  }

  const valid = new Set(["typescript", "python", "java"]);
  for (const c of options.conventions) {
    if (!valid.has(c)) {
      console.error(`Unknown convention: ${c}. Choose from: ${[...valid].join(", ")}`);
      process.exit(1);
    }
  }

  return options;
}
