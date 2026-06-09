# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.18.0] - 2026-06-10

### Added
- **Folio design system** for all HTML artifacts — editorial, print-influenced look with hand-drawn SVG diagrams. Spec ships as `conventions/folio.md` (always copied, independent of `--conventions`)
- Learner explainer decks: `learnings/_deck-template.html` slide deck built on `deck-stage.js` (zero-dependency web component with scaling, keyboard nav, thumbnail rail), plus `learnings/_longform-template.html` as a scrolling-page alternative
- `summaries/_slide-template.html` — Folio work-summary slide, the style reference for html-summarizer decks
- `architecture/_sketch-template.html` — layered hand-drawn component map; system-architect can render `architecture/sketch.html` as a view of `architecture.yaml`
- System-design subskill agent (Alex Xu style) — any agent can spawn it for diagrams, estimations, and trade-off tables; owns the Folio hand-drawn SVG technique
- Writing-style section in scaffolded CLAUDE.md (Alex Xu *System Design Interview* voice for all artifacts)
- Learner agent entry in `orchestration.yaml` (was referenced in connections but never defined)

### Changed
- HTML Summarizer restyled to Folio — replaces the previous indigo/pill/rounded-card design system with sharp corners, hairline rules, dark code terminals, and one terracotta accent
- Tickets, ADRs, specs, and STATUS deliberately remain markdown — they are agent working files; Folio applies to presentation artifacts only
- README and repo docs updated to the current agent roster (ticket-verifier, learner, system-design) and file tree

## [0.15.1] - 2026-05-30

### Fixed
- Architect agent now auto-invokes for new feature requests (CLAUDE.md instruction strengthened)
- Reviewer agent now triggers at ticket completion time by anchoring the instruction in the ticket template's Post-Implementation section, solving the temporal alignment problem where the instruction was read at feature-start but needed to fire at ticket-end
- Planner output format updated to include Post-Implementation section in generated tickets

## [0.15.0] - 2026-05-28

### Added
- `--dry-run` flag to preview what files would be created without writing them
- "AI take the wheel" option (option 6) for upgrades — stages new templates for an AI coding agent to merge with existing files
- Code-auditor agent for structural quality review (optional, manually invoked)
- Test suite using `node:test` (zero dependencies)

### Changed
- Reviewer now runs automatically after each ticket and updates ticket status and backlog
- Context7 MCP server removed from default settings (users add MCP servers post-init)
- Generic paths and placeholders replace hardcoded personal references
- STATUS.md phase table aligned with workflow (Audit, Learn replace Test, Maintain)
- README rewritten to reflect hybrid workflow and current agent roster

### Removed
- Executor agent (replaced by Claude Code plan mode)

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
