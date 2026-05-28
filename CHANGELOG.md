# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `--dry-run` flag to preview what files would be created without writing them
- "AI take the wheel" option (option 6) for upgrades — stages new templates for an AI coding agent to merge with existing files
- Test suite using `node:test` (zero dependencies)

### Changed
- Context7 MCP server removed from default settings (users add MCP servers post-init)
- Generic paths and placeholders replace hardcoded personal references

## [0.14.0] - 2026-05-28

### Added
- Code-auditor agent for structural quality review (optional, manually invoked)
- Learner agent for deep-diving into technologies used in a project
- Summarizer agent for non-technical executive summaries
- System-architect agent for mapping runtime system architecture as `architecture.yaml`
- STATUS.md auto-updating via post-commit/push hooks
- Interactive conflict resolution when files already exist during init
- Protected project state files (architecture, tickets, specs) from accidental overwrite
- Backlog board (`tickets/_backlog.md`) for sprint tracking

### Changed
- Adopted hybrid workflow: agents own process, Claude Code plan mode owns execution
- Reviewer now runs automatically after each ticket and updates ticket status and backlog
- Planner tickets scoped for plan mode sessions

### Removed
- Executor agent (replaced by Claude Code plan mode)
- QA-tester agent (testing is part of plan mode execution)
- Custodian agent (responsibilities split across reviewer and hooks)
