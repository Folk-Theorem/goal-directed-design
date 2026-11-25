# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

The source of `goal-directed-ui`, a Claude Code skill for designing, building, and auditing interfaces with goal-directed interaction design. It contains only Markdown prompts: there is no application code, and no build, lint, or test tooling. Changing the repo means changing the instructions an agent follows.

To try a change without installing anything, load the repo for one session, then invoke `/goal-directed-ui:goal-directed-ui audit|design|prototype|build ...`:

```sh
claude --plugin-dir /path/to/this/repo
```

Check the manifests with `claude plugin validate .`.

## Architecture

- `skills/goal-directed-ui/SKILL.md` is the entry point. It runs in the main session, which acts as orchestrator: it picks the mode (`audit`, `design`, `prototype`, `build`), decides whether to delegate, and owns final claims.
- `agents/` holds four optional subagent templates. The pipeline is `goal-researcher` -> `interaction-architect` -> `usability-evaluator` -> `interface-implementer`, followed by re-evaluation of the build.
- `references/` (inside the skill folder) holds everything loaded on demand. `agent-orchestration.md` is the source of truth for role contracts, the per-mode delegation map, and the handoff schemas (`task-model.json`, `interaction-model.json`, `usability-review.json`).
- `usability-evaluation.md` defines the evidence levels and the walkthrough protocol, and lists the research behind the method.
- `prototyping.md` and `simulated-user-testing.md` cover the prototype loop and persona tests, and `dark-patterns.md` is the audit catalog.
- `interaction-guidelines.md` holds decision-level guidance and the conflict precedence. Add specifics to this file rather than to `SKILL.md`, which loads on every use.

- Packaging is one shared set of files with a manifest per host: `.claude-plugin/` (Claude Code), `.codex-plugin/` and `.agents/plugins/` (Codex), `.plugin/` (Antigravity and the Agent Plugins format), and `.mcp.json` for the browser server.

- `docs/design/task-model.md` applies the method to the skill itself: who uses it, in which situations, and what was checked. It is outside the skill folder, so it isn't installed. Check changes against its scenarios.

## Invariants to preserve when editing

- **The skill serves three people in three situations.** Developers, product managers, and designers arrive with a problem, a new feature, or a blank page. A change that helps one must not add ceremony or jargon for another. Read the person from the request rather than asking, and keep "who decides" tied to the person.
- **The skill stays host-neutral.** Don't use one tool's syntax or tool names in the skill or its references; say what to do and let the host map it. Host-specific details belong in the manifests, the agent frontmatter, and `README.md`.
- **The skill must work without the agents.** The main session can run every role sequentially from the contracts in `references/agent-orchestration.md`, so don't make `SKILL.md` depend on installed agents.
- **Role separation is enforced by tool access.** The researcher and architect have `tools: Read, Glob, Grep` in their frontmatter, and the evaluator adds only the Playwright tools, under both the plain name and the plugin-prefixed name (`mcp__plugin_goal-directed-ui_playwright__*`). Plugin agents ignore a `mcpServers` frontmatter field, which is why the server is in `.mcp.json`. Only `interface-implementer` can edit, and it omits `tools`. Keep the frontmatter consistent with the prose in `SKILL.md`, and don't ask a role to do something its tools can't: these three return results in their response rather than writing files.
- **The evaluator stays independent.** It must not count its own proposal as evidence, it doesn't rewrite the model, and it doesn't see the designer's rationale before reporting.
- **Honest evidence is the core principle.** Synthetic personas, walkthroughs, and agent simulations are never presented as measured human outcomes, and no invented metrics or single usability scores are allowed. A simulated run can verify product behavior, but what a persona understood stays inferred. New instructions must keep the observed / verified / inferred / unknown labels.
- **Prototype results don't transfer.** They are labeled `verified (prototype)`, and everything faked goes on the fake list that the build checks against the real service.
- **Simulated tests stay off production.** The evaluator can click anything a user can, so every instruction that runs it must keep the non-production and test-data rules.
- **Effort scales with the task.** The light path at the top of `SKILL.md` is the default for fixes and bounded changes, and it skips everything else. New steps belong in the full flow, and the light path must stay a few lines long.

## Keeping files in sync

Role names, schema names, and evidence levels are repeated across `SKILL.md`, `agents/*.md`, and the reference files, so a change to one usually means updating the others. `README.md` also repeats the install paths and the mode commands.

The plugin name and version are repeated across the manifests, and the Playwright version is pinned in `.mcp.json` and `README.md`. If the plugin name changes, update the prefixed tool name in the evaluator's frontmatter too.

Agent templates can be installed apart from the skill, so they must not cite `references/...` paths. Keep each agent's essential instructions in its own file; the orchestrator pastes schemas into the delegation prompt.

Claims in `references/` come from cited sources. Check a source before adding or changing one, and keep the caveats on small studies.
