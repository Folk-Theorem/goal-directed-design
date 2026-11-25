---
name: goal-directed-ui
description: Work out how an interface should behave from what people are trying to do, then design, prototype, build, or audit it and test it against real tasks. Use when someone wants to fix a confusing or broken screen or flow, add a feature to a product, start a new product from an idea, mock something up, review UX, or work on forms, navigation, dashboards, or error, empty, and loading states. For developers, product managers, and designers. Not for purely visual restyling or for code with no user-facing behavior.
argument-hint: "[audit|design|prototype|build] [feature, problem, or idea]"
---

# Goal-directed UI

Design for successful user behavior before visual polish. The task model, not the screen, is the source of truth: decide what people are trying to do, derive the interface from that, and judge the result against the same goals.

## Light path

The default for fixes and bounded changes unless a mode was named. Skip everything below.

Reproduce it (or read the code), make the smallest change that does exactly what was asked, check that and its likeliest failure, and reply in about five lines: cause, change, checked, not checked. Mention bigger problems in one line and leave them. If only asked why, find the cause and answer.

Use the full flow only if the fix would reshape the flow, change permissions or an irreversible action, span several screens, or need a real product decision, or if the first fix failed. Say why in a line.

## Full flow: start from the situation and the person

Work out both from the request and the project. Don't ask for a role or a mode. Ask one question only if a wrong guess would waste real work; otherwise state your reading in a line and proceed, so it can be corrected.

| Situation | Signs | Start by | Usual mode |
|---|---|---|---|
| **Something is wrong** with an existing interface, and the light path isn't enough | Spreading complaints, drop-off, or no clear cause | Reproduce it, then find the layer it lives in: goal, model, or presentation | `audit`, then `build` if a fix is wanted |
| **New feature** in an existing product | "Add...", with a product or code to work in | Learn the existing patterns, then model only what changes | `build`, or `prototype` if the flow is uncertain |
| **Greenfield** | An idea, with no product or code yet | Name the goal and primary task, list assumptions, pick the simplest platform that fits | `prototype` |

| Person | Signs | What they need | Who decides |
|---|---|---|---|
| **Developer** | Talks about code, components, tickets | A working change and what was checked, with the model in a few lines | You decide, and raise only choices that change product behavior |
| **Product manager** | Talks about customers, requirements, stakeholders, metrics | Plain-language options with tradeoffs, something clickable to show people, risks, and how to tell it worked. No code, JSON, or method terms | You recommend; they decide product tradeoffs |
| **Designer** | Talks about flows, wireframes, research, Figma | The task model, real alternatives with rationale, critique, and a test plan. Take in their research, sketches, and corrections as evidence | Present options and stop; they choose |

If the person is unclear, use plain language, deliver something that works, and decide reversible things yourself. A role changes how you work and report, never how carefully.

Work from whatever you are given and say what it limits. A running product supports verified claims. Code, a screenshot, or a design file supports inferred ones. A description supports assumptions.

## Mode

- `audit`: Inspect an existing interface, implementation, or workflow. Report defects and fixes. Do not change code unless asked.
- `design`: Produce a goal and interaction specification. Do not implement production UI unless asked.
- `prototype`: Make a working front end with no backend, test it, and iterate. Do not connect real services or ship it as production code.
- `build`: Implement or revise UI from the minimum necessary model, then test it.

An explicit mode wins. Otherwise use the tables above, and let the verb settle ties: review/critique -> audit; explore/plan -> design; prototype/mock up/try out -> prototype; make/implement -> build. "Fix" means reproduce first. If a build request rests on an uncertain flow, suggest prototyping first.

## Scale

The steps below are for substantial work: multi-screen flows, unclear workflows, complicated state or permissions, competing interaction models, and high-impact decisions. Do only as much as the problem needs. Between the light path and the full flow, a task may need just a short model and one approach.

## Evidence

In the full flow, label significant claims with one of these levels, defined in [references/usability-evaluation.md](references/usability-evaluation.md):
- **observed**: seen in real use (user tests, telemetry, support logs).
- **verified**: confirmed in the running product or by an automated test. On a prototype, write **verified (prototype)**: it shows how the prototype behaves, and it doesn't carry over to the build.
- **inferred**: reasoned from the code, a screenshot, or a scenario.
- **unknown**: needs research or users.

Product behavior exercised in a simulated run can be **verified**. What a persona understood or would do, along with predictions and walkthroughs, is at most **inferred**. Never invent interviews, analytics, usage data, or measured success. When writing for a product manager, keep the distinction but say it plainly: "seen with real users", "confirmed in the product", "our reasoning, not tested", "we don't know yet".

## Step 1: Understand reality

If a product exists, inspect the code, routes, data types, patterns, accessibility conventions, and tests, and reuse its design system and domain language. If nothing exists, every fact below starts as an assumption, so keep them few and prefer a prototype to more analysis.

Record, briefly:
- Primary user role and actual goal (the outcome, not the requested feature).
- Trigger, environment, frequency, time pressure, expertise, constraints.
- Platform and input: device, screen, how it is held or used, session length, input methods (touch, pointer, keyboard, voice, assistive technology).
- Current task sequence, where known.
- What people must know, what they are likely to get wrong, and how they recover.
- Stakes: money, data loss, privacy, or anything else that could harm people if the interface misleads them.
- Which of these facts are evidence and which are assumptions.

## Step 2: Model the work before screens

Describe the smallest useful **task model**:
- **Objects:** domain entities, key properties, relations, meaningful states.
- **Dependencies:** how a change to one object affects another, and whether the system should *update* the target or *validate* and reject the change. These become derived values, constraints, and feedback.
- **User intentions:** what people try to do to each object.
- **System responsibilities:** what can be inferred, automated, remembered, validated, or prepared, so people are not asked for what the system already knows.
- **Actions:** names, inputs, permissions, preconditions, results, undo or recovery.
- **Sequence:** common path, important branches, edge cases.
- **Feedback:** what changes, what people see, and when.

Write 1-3 context scenarios in goal-oriented language. Prefer a compact table or short steps. Do not merely list screens.

Keep the model traceable. Each screen element should map to an object, action, or feedback item in the model; question anything that maps to nothing. When a requirement or critique changes, update the model first and let the interface follow. Fix a problem at the layer where it lives: goal, model, or presentation.

## Step 3: Choose an interaction framework

Derive structure from the work:
- Put the most frequent or consequential next action first, with the information needed to choose it.
- Use domain language, not internal database terms. Group actions with their objects.
- Keep state and system status visible, and never hide what a decision depends on.
- Prevent invalid operations, explain errors, preserve entered data, and provide recovery paths.
- Cover the states that apply, using the state catalog in the guidelines.
- Never use the interface to steer people against their own interest. See [references/dark-patterns.md](references/dark-patterns.md).

Read [references/interaction-guidelines.md](references/interaction-guidelines.md) for specific decisions on states, feedback, confirmation, forms, modals, loading, writing, and the accessibility baseline. It also says how to resolve conflicts, because published guidelines disagree.

For substantial work, compare at least two distinct interaction models against the same scenarios. Each must be the strongest version of a different idea about how the work gets done, not a straw man and not a layout variant. Say what would make each one win, and give rejected options one or two sentences.

## Step 4: Define testable scenarios

Before implementation, list 3-5 representative tasks with:
- Starting context and user objective.
- Completion criterion observable in the product.
- Critical information, actions, and expected feedback.
- An error, interruption, or edge case for at least one scenario.

Compare candidates on task completion, decision burden, memory burden, error exposure, recovery, learnability, accessibility, consistency, and effort. Do not collapse these into an overall score.

Estimate effort per task by counting **navigation** (moves to reach the right place: screens, tabs, dialogs, focus changes) separately from **manipulation** (entries, choices, confirmations). Read those counts against task frequency, because a step added to a daily task costs more than one added to a yearly task. If frequency is unknown, rank tasks and label the ranking an assumption. Repeat for each input method that matters; the shortest path by mouse may not be the shortest by keyboard or screen reader. Effort is a prediction, not measured performance.

For substantial work that will ship, say how to tell it worked: a goal, an observable signal, and a counter-metric for what could get worse. See [references/usability-evaluation.md](references/usability-evaluation.md). This is how real, observed evidence comes back.

## Step 5: Execute the selected mode

### Audit
Inspect the actual UI and code wherever possible. Output a prioritized list of **severity -> issue -> user impact -> evidence level -> proposed fix -> verification task**, using the severity scale in [references/usability-evaluation.md](references/usability-evaluation.md). Check for dark patterns. Note what works well, so that a redesign protects it. If browser tooling is available, reproduce issues and capture task paths. Check every finding against the product or code before reporting it, and drop any you cannot support.

### Design
Output a compact interaction brief: goal, assumptions, objects, actions, task scenarios, proposed organization and navigation, major states, and open risks. Use low-fidelity wireframes or text descriptions as needed. Avoid unsolicited visual style explorations.

### Prototype
Follow [references/prototyping.md](references/prototyping.md). First build only one task, with its normal path and likeliest failure, then test it before building anything else. Use a front end only, with all fake behavior in one data layer, a switch that forces the states under test, realistic delay, and clearly labeled mock data. Test, fix, and repeat for about three rounds at most. Output the test results and a **fake list** of everything the prototype pretends, which becomes the checklist for the build.

### Build
Implement the smallest complete path for the primary task, not a static mockup. Follow project conventions. Include realistic representative data (label mocks clearly). Cover keyboard, focus, validation, feedback, loading, empty, and recoverable error states. Avoid speculative features. Run available lint, type, unit, and browser tests, and repair issues your changes caused.

## Step 6: Critique and iterate

Walk each task through as a novice and as a frequent user, using the prompts in [references/usability-evaluation.md](references/usability-evaluation.md). At each step, ask whether the user can recognize the next action, decide from what is on screen, predict the result, and recover from a mistake.

For substantial work, get the critique from a reviewer who did not produce the design. Give it the scenarios and the interface, not the design rationale. If you can only review your own work, call it a **self-review**, not independent evidence.

When a running build or prototype is available for substantial work, run simulated user tests as described in [references/simulated-user-testing.md](references/simulated-user-testing.md). Vary memory: a **no-memory** test sees one screen and the goal, testing what the interface carries by itself, and a **full-memory** test remembers everything, testing consistency and whether experience pays off. Enforce real conditions, such as keyboard only, rather than role-playing traits. Test only prototypes or non-production builds with test data.

Report the highest-impact risks, up to three, and report fewer if fewer are real. Fix them in build mode where feasible and re-run the relevant checks. Never claim a synthetic walkthrough proves human usability. Recommend human testing where uncertainty is material, and name the specific question it should answer.

## Delegation

The main session is the orchestrator and owns scope, integration, and final claims. For substantial work, delegate in this order, parallelizing only independent assignments:

Research -> interaction alternatives -> independent critique -> selection -> implementation -> task-based verification.

These are role names; how to run them depends on the host. `goal-researcher` and `interaction-architect` are read-only. `usability-evaluator` can't edit files but can drive a browser. `interface-implementer` edits code and raises interaction changes rather than silently redesigning.

Do not start substantial implementation before a coherent model and scenarios exist. Selection follows the "Who decides" column above. When you decide, record the choice and proceed.

Before delegating, read [references/agent-orchestration.md](references/agent-orchestration.md). It covers running the roles on different hosts, role contracts, and handoff schemas.

## Output

Lead with what this person needs, and stay concise:
- **Developer:** what changed, what was checked, what wasn't, and any behavior decision they should know about. Add the model only if it explains something.
- **Product manager:** the recommendation, the options and tradeoffs, how to open the prototype if there is one, risks, how to tell it worked, and what still needs real customers. Write it so they could forward it.
- **Designer:** the goal and evidence status, task model, alternatives and rationale, findings, and test plan, with open decisions clearly marked for them.

Whoever it is, separate what was tested, what wasn't, and what needs real people, and say where the work was left.

When the work will pass to someone else, such as from product to design or design to engineering, leave a short handoff they can read without this conversation: the goal, decisions and why, open questions, test scenarios, and the fake list if there is one.

Prioritize functional behavior over appearance, and honor the project's visual system unless asked to change it.

## Anti-patterns

Do not:
- Start by designing a dashboard because the brief mentions data.
- Substitute a beautiful UI or component library for task modeling.
- Treat a requested feature as proof of the underlying user goal.
- Add navigation or steps merely to organize UI components.
- Mask interaction problems with tooltips or onboarding.
- Add confirmation dialogs where undo or prevention would be better.
- Pad a review with weak findings to reach a number.
- Quote a guideline as if it settled a question the task evidence has not.
- Report a simulated run as a user test.
- Treat a prototype result as evidence about the real backend.
- Declare success based only on screenshot appearance.
- Run the full flow on a fix that the light path can handle.
- Make a designer's or product manager's decision for them, or stop a developer for a decision they don't need to make.
