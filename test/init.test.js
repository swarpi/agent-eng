import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  rmSync,
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { init, FRAMEWORK_FILES, PROJECT_STATE_FILES } from "../src/init.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, "..", "src", "templates");

const defaultOptions = (dir) => ({
  dir,
  conventions: ["typescript", "python", "java"],
  force: false,
  dryRun: false,
});

function collectFiles(dir, prefix = "") {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full, rel));
    } else {
      results.push(rel);
    }
  }
  return results;
}

describe("init", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "agent-eng-test-"));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("creates all expected files in an empty directory", async () => {
    await init(defaultOptions(tempDir));

    for (const file of FRAMEWORK_FILES) {
      assert.ok(existsSync(join(tempDir, file)), `missing: ${file}`);
    }
    for (const file of PROJECT_STATE_FILES) {
      assert.ok(existsSync(join(tempDir, file)), `missing: ${file}`);
    }
    assert.ok(existsSync(join(tempDir, "CLAUDE.md")));
    assert.ok(existsSync(join(tempDir, "conventions/typescript.md")));
    assert.ok(existsSync(join(tempDir, "conventions/python.md")));
    assert.ok(existsSync(join(tempDir, "conventions/java.md")));
  });

  it("skips protected files without --force", async () => {
    const protectedFile = "STATUS.md";
    const sentinel = "DO NOT OVERWRITE";
    writeFileSync(join(tempDir, protectedFile), sentinel);

    await init(defaultOptions(tempDir));

    const content = readFileSync(join(tempDir, protectedFile), "utf8");
    assert.equal(content, sentinel, "protected file was overwritten");
  });

  it("overwrites protected files with --force", async () => {
    const protectedFile = "STATUS.md";
    writeFileSync(join(tempDir, protectedFile), "old content");

    await init({ ...defaultOptions(tempDir), force: true });

    const content = readFileSync(join(tempDir, protectedFile), "utf8");
    assert.notEqual(content, "old content", "protected file was not overwritten");
    assert.ok(content.includes("Project Status"), "should have template content");
  });

  it("dry-run creates no files", async () => {
    await init({ ...defaultOptions(tempDir), dryRun: true });

    const files = readdirSync(tempDir);
    assert.equal(files.length, 0, `expected empty dir, got: ${files.join(", ")}`);
  });

  it("dry-run prints expected output", async () => {
    const logs = [];
    const origLog = console.log;
    console.log = (...args) => logs.push(args.join(" "));
    try {
      await init({ ...defaultOptions(tempDir), dryRun: true });
    } finally {
      console.log = origLog;
    }

    const output = logs.join("\n");
    assert.ok(output.includes("Dry run"), "should mention dry run");
    assert.ok(output.includes("Would create"), "should list files to create");
    assert.ok(output.includes("CLAUDE.md"), "should list CLAUDE.md");
  });

  it("filters conventions correctly", async () => {
    await init({ ...defaultOptions(tempDir), conventions: ["typescript"] });

    assert.ok(existsSync(join(tempDir, "conventions/typescript.md")));
    assert.ok(!existsSync(join(tempDir, "conventions/python.md")), "python.md should not exist");
    assert.ok(!existsSync(join(tempDir, "conventions/java.md")), "java.md should not exist");
  });

  it("FRAMEWORK_FILES and PROJECT_STATE_FILES match files on disk", () => {
    const allTemplateFiles = collectFiles(TEMPLATES_DIR);

    const conventionFiles = allTemplateFiles.filter((f) => f.startsWith("conventions/"));
    const nonConventionFiles = allTemplateFiles.filter(
      (f) => !f.startsWith("conventions/") && f !== "CLAUDE.md"
    );

    const declared = new Set([...FRAMEWORK_FILES, ...PROJECT_STATE_FILES]);

    for (const file of nonConventionFiles) {
      assert.ok(declared.has(file), `template file "${file}" not in FRAMEWORK_FILES or PROJECT_STATE_FILES`);
    }

    for (const file of declared) {
      assert.ok(
        existsSync(join(TEMPLATES_DIR, file)),
        `declared file "${file}" does not exist in templates/`
      );
    }
  });
});
