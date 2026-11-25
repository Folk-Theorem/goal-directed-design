# Goal-directed UI: subagent contracts and handoffs

These contracts guide the orchestrator whether persistent agents are installed or the roles are run sequentially. Use agents for substantial work, not trivial fixes.

## Running the roles

Hosts differ, so detect what is available rather than assuming:
- **Named agents available:** use them.
- **General subagents only:** start one and put the role's contract in its prompt. The agent files in this package's `agents/` folder hold the full text; read them if you can reach them, and otherwise use this file.
- **No subagents:** perform the roles sequentially in the main session. Evaluation is then a self-review, so label it, and record no-memory tests as not run.

Tool restrictions in agent files only apply where the host honors them. Elsewhere, the read-only rule is an instruction, so state it in the prompt.

## Agent setup

1. Inspect existing project and user agents before creating anything, and reuse compatible ones.
2. Hosts may not discover agents inside a skill folder. If only the skill was copied, the agent files go in the host's own agents folder.
3. Do not create or overwrite persistent agent files unless the user asks for setup, and ask before writing outside the current project.
4. Simulated tests need a browser tool. This package's `.mcp.json` configures Playwright for hosts that load it, and the README covers the others. Its `--isolated` flag keeps it out of the user's logged-in browser profile. If the evaluator reports no browser tools, check that the server loaded and that the host trusts the folder.
5. Without installed agents, delegate with these contracts in the task prompt where the host supports it, or perform the roles sequentially in the main session. Sequential evaluation is a self-review; label it so.

## Delegation map

| Mode | Default delegation | Notes |
|---|---|---|
| `audit` | researcher (if context unclear) -> evaluator | Never edit code unless explicitly requested |
| `design` | researcher -> architect -> independent evaluator | Orchestrator selects and documents a model |
| `prototype` | researcher/architect as necessary -> implementer builds prototype -> fresh evaluator each round -> orchestrator decides whether to iterate | See [prototyping.md](prototyping.md). Front end only |
| `build` | researcher/architect as necessary -> evaluator -> implementer -> evaluator with simulated user tests, or orchestrator verification | Keep code changes scoped |

Independent research tasks can run in parallel. The architect depends on the research handoff; the evaluator depends on the candidate models; implementer depends on selection. An evaluator may challenge assumptions but must distinguish actual evidence from inference. The post-build evaluator checks implementation, not just the spec.

For a consequential or uncertain design, consider asking the user to review the task model or interaction model before evaluation. Corrections are cheapest at this stage. This is an optional checkpoint, not a required approval gate.

## Agent execution requirements

1. Supply the user request, mode, repository context, artifacts available, constraints, and exact expected output. Installed agents can't rely on reaching this skill's reference files, so paste the schema and any needed reference text into the prompt.
2. Read only necessary files. Avoid changing source files in research/design/evaluation roles.
3. Scope delegated work to avoid conflicting writes. The implementer is the sole code-editing role by default.
4. Return concise findings, evidence/assumption labels, unresolved questions, and recommended next action. Read-only agents can't write files, so they return schemas in their response, and the orchestrator saves them when an artifact is useful. Store these under `docs/ux/goal-directed-ui/` only if appropriate for the repository; otherwise keep compact handoffs in context.
5. Escalate conflict or meaningful changes in interaction behavior to the orchestrator.
6. Do not present synthetic personas, agent simulations, heuristic guesses, or generated data as measured human outcomes.
7. Keep the evaluator independent. Give it the scenarios, success conditions, and interface or models. Withhold the designer's rationale and preferred option until it has reported. Use a fresh agent for the post-build review rather than continuing the earlier one.
8. For simulated user tests, the orchestrator serves the prototype or build on localhost or a staging URL (not `file://`), confirms it isn't production, and gives the evaluator the target, test users, tasks, and the run log format from [simulated-user-testing.md](simulated-user-testing.md).
9. The orchestrator runs no-memory tests, because subagents usually can't start other agents and each step needs a fresh one. Ask the evaluator to drive the task and return each decision-point screen, then give each screen to a new agent with only the goal. Pass the answers back to the evaluator or judge them yourself.
10. If the evaluator has no browser tools, whoever can run the product supplies a run log instead. The evaluator may label a claim verified only when a log supports it.

## Suggested intermediate schemas

These are minimal example structures, not a requirement to emit full JSON for every task. Prefer compact, inspectable data when work spans agents or sessions.

### `task-model.json` (researcher)

```json
{
  "primary_user": {"role": "", "goal": "", "context": ""},
  "evidence": [{"claim": "", "level": "observed|verified|inferred|unknown", "source": ""}],
  "objects": [{"name": "", "meaning": "", "relations": [], "states": []}],
  "dependencies": [{"source": "", "target": "", "mechanism": "update|validate", "rule": ""}],
  "tasks": [{"id": "T1", "goal": "", "trigger": "", "frequency": "unknown", "frequency_rank": 1, "success_condition": "", "steps": [], "edge_cases": []}],
  "platform": {"devices": [], "input_methods": [], "session_length": ""},
  "assumptions": [],
  "open_questions": []
}
```

### `interaction-model.json` (architect)

```json
{
  "source_task_ids": ["T1"],
  "alternatives": [
    {"id": "A", "concept": "", "object_model": [], "navigation": "", "primary_actions": [], "states_and_feedback": [], "recovery": [], "effort": [{"task_id": "T1", "input_method": "", "navigation_steps": 0, "manipulation_steps": 0}], "wins_when": "", "tradeoffs": []},
    {"id": "B", "concept": "", "object_model": [], "navigation": "", "primary_actions": [], "states_and_feedback": [], "recovery": [], "effort": [{"task_id": "T1", "input_method": "", "navigation_steps": 0, "manipulation_steps": 0}], "wins_when": "", "tradeoffs": []}
  ],
  "decision_needed": "",
  "assumptions": []
}
```

Alternatives must differ in workflow/conceptual model, not simply visual layout. For small changes, one well-reasoned model is sufficient. Effort counts are estimates for comparison, not measured performance.

### `usability-review.json` (evaluator)

```json
{
  "review_target": "model A or code path",
  "target_type": "model|prototype|build",
  "reconstruction": {"screens_and_controls": [], "task_paths": [], "checked_against": ""},
  "scenarios": [{"task_id": "T1", "starting_state": "", "success_condition": "", "walkthrough": [], "result": "pass|risk|fail|not_tested", "evidence_level": "observed|verified|inferred|unknown"}],
  "issues": [{"id": "U1", "task_id": "T1", "severity": "critical|major|minor|cosmetic", "dark_pattern": "", "impact": "", "likelihood": "", "recoverability": "", "evidence_level": "", "finding": "", "recommendation": ""}],
  "positive_findings": [],
  "accessibility_checks": [],
  "simulated_runs": [],
  "unverified_assumptions": [],
  "recommended_next_tests": []
}
```

Do not invent precise time-on-task, completion rates, or overall usability scores. Report browser/test outcomes separately from predicted user behavior. A browser script can validate a path without establishing that people understand it.

## Model selection and change management

- Selection depends on who owns the decision. A designer chooses among the options. A product manager decides product tradeoffs on your recommendation. For a developer or an unclear role, the orchestrator selects and raises only choices that change product behavior.
- When selecting, weigh task importance, frequency, error exposure, recovery, accessibility, and feasible implementation.
- Record the selected alternative and any accepted/rejected critique.
- The implementer may adjust component details without approval if behavior remains equivalent. Changes to object model, ordering, navigation, or irreversible actions must be reported for a design decision.
- Run task checks after implementation. Record **tested**, **not tested**, and **human validation needed** distinctly.
