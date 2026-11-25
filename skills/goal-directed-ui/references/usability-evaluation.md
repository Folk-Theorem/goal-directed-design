# Scenario-based usability evaluation reference

Use this when auditing or building complex workflows. This is a reasoned inspection protocol, not a replacement for empirical tests.

## Evidence levels

- **Observed:** user tests, product telemetry, support logs, direct observation of real use.
- **Verified:** confirmed in the running product by browser interaction or by automated accessibility or interaction tests. It shows the product behaves that way, not that people understand it. On a prototype, write **verified (prototype)**, because it says nothing about the real build.
- **Inferred:** estimated from code, screenshots, or a scenario, without running the product.
- **Unknown:** a question requiring external research or users.

Label significant claims appropriately. A finding from a static screenshot or from reading code is inferred, however confident it sounds.

## Reviewing with an AI evaluator

An AI review is a first pass that needs checking, not a substitute for expert or user evaluation. The research points to four practices:

1. **Reconstruct before judging.** First write down what the interface is: its screens, controls, states, and the path for each task. Check that description against the product or code, because evaluating a misread interface produces confident, wrong findings. In a supervised setup, this is the cheapest point for a person to correct the review.
2. **State the criteria.** Judge against the task scenarios and success conditions, and name them. Reviewers given different objectives reach different verdicts.
3. **Interact where possible.** Models reviewing screenshots report issues that aren't there, partly because they can't use the system. Try to reproduce each finding, and drop or downgrade it if you can't.
4. **Look where AI reviewers are weak.** They do better on visual minimalism and on language matching the real world. They do worse on flexibility, user control, and efficiency, so walk those deliberately: shortcuts, exit paths, undo, and repeated use by a frequent user.

Don't report a finding count as a quality measure, and don't add findings to reach a number. "No significant issues found in these scenarios" is a valid result when it is true, provided you list what was covered.

## Task test case template

| Field | Description |
|---|---|
| Role / context | Who performs the task and under which constraints? |
| Goal | Outcome the person wants, independent of UI terminology |
| Starting state | What they see and what data exists |
| Success | Observable product state after completion |
| Happy path | Minimum viable sequence of actions |
| Edge condition | Missing data, interruption, error, conflict, permission, or latency |
| Evaluation | Completion, decisions, navigation and manipulation effort, feedback, recoverability, keyboard/accessibility |

## Cognitive walkthrough prompts

For each step ask:
- Will the user know what goal-relevant action is available?
- Will the user notice its control?
- Will its label and placement suggest the expected effect?
- After acting, will feedback establish progress or failure?
- What knowledge must be recalled from elsewhere?
- What happens after a mistaken choice?

Record specific failure points and fixes. Describe estimates as estimates.

## Prioritization

Give each issue a severity:
- **Critical:** blocks the primary task, causes harm or loss of money or data, or is a confirmed dark pattern that does.
- **Major:** significant friction or potential harm, recoverable only with effort.
- **Minor:** a degraded experience that people recover from easily.
- **Cosmetic:** polish that doesn't affect the task.

Within a level, rank by frequency of exposure, difficulty of recovery, and strength of evidence. Severity applies to each issue. Do not use a single opaque UX grade for the product.

Also record what works well and why. A redesign needs to know what to protect, and it keeps a review honest.

Where it helps, tag a finding with the [heuristic](https://www.nngroup.com/articles/ten-usability-heuristics/) it relates to, such as visibility of system status or user control and freedom. The tag aids communication; it doesn't replace naming the task and its failure.

## Practical verification

Where tooling permits:
- Drive the workflow with keyboard only; confirm focus and visible focus state.
- Trigger empty, loading, validation, rejected, expired, and network failure states.
- Verify operation outcomes and undo behavior.
- Check form labels and error associations.
- Check that reopening, refreshing, or returning preserves or clearly resets state as intended.
- Check text enlargement, dark mode, and reduced motion where the platform supports them.
- Check the commonly missed items in the [accessibility baseline](interaction-guidelines.md#accessibility-baseline).

For test users, memory modes, and enforced conditions, see [simulated-user-testing.md](simulated-user-testing.md).

Report any checks that could not be performed. Human testing is still needed to validate comprehension, efficiency, and trust.

## Telling whether it worked

For substantial work that will ship, connect the goal to something measurable before launch:
- **Goal:** the outcome for people, specific enough to be wrong. "Improve the experience" isn't a goal.
- **Signal:** the behavior that would show progress. More time on a page is not necessarily a good sign.
- **Metric:** how to count the signal, and where the data comes from.
- **Counter-metric:** what could get worse if this one improves. Conversion that rises while support tickets rise is a warning.

Propose thresholds only as starting points, and label them as such. Results that come back from real use are the skill's strongest evidence, **observed**, so feed them into the next round.

## Using human critique

When a person reviews the work, ask for specific comments on specific elements, with their reasons, rather than a rating or a choice between screens. Sketches and direct edits work too. Record the reason alongside the change, and decide whether it belongs in the goal, the model, or the presentation before acting on it.

## Research influences (not assertions of equivalence)

These shaped the method. They are prototypes and small studies, so don't cite them as proof that this skill works.

- Alan Cooper et al., *About Face*: goals, personas, context scenarios, interaction frameworks.
- [Jelly](https://doi.org/10.1145/3706598.3713285) (Cao, Jiang, Xia; CHI 2025): a task-driven data model of schema, dependencies, and data is the source of truth, and the UI derives from it. Its dependencies either validate or update. Eight-person study.
- [SUPPLE](https://iis.seas.harvard.edu/papers/gajos10supple-aij.pdf) (Gajos, Weld, Wobbrock; 2010): interface generation as minimizing expected time, split into navigation and manipulation and weighted by usage traces. The authors expect hand-crafted designs to be better for typical users in typical situations, and aim it at needs mainstream designs miss.
- [Just-In-Time Objectives](https://doi.org/10.1145/3772318.3790713) (Lam et al.; CHI 2026): the same inferred objective steers both generation and evaluation. Win rates of 66-86% are pairwise preferences over an unsteered baseline, not usability measures, and the baseline was often preferred for simple or early-stage tasks.
- [UXAgent](https://arxiv.org/abs/2502.12561) (Lu et al.; 2025): simulated users on real websites, positioned as a way to refine study design before a real human study.
- [Structured Human-AI Teaming](https://doi.org/10.1177/10711813261475226) (Lee, Baek, Park; 2026): a person corrects the AI's intermediate design representation and its findings. This aligned substantially better with experts than the same pipeline without supervision, across four Android task scenarios.
- [Can GPT-4o Evaluate Usability Like Human Experts?](https://arxiv.org/abs/2506.16345) (Guerino et al.; 2025): matched 21.2% of expert-identified issues from screenshots, found 27 others, and produced false positives. [Synthetic Heuristic Evaluation](https://arxiv.org/abs/2507.02306) (Zhong, McDonald, Hsieh; 2025) reports 73-77% on two apps, above five experts. The two differ in method and scoring, so treat AI detection rates as unsettled.
- [Improving UI Generation from Designer Feedback](https://machinelearning.apple.com/research/designer-feedback) (Apple): about 1,500 annotations from 21 designers, through comments, sketches, and direct edits, outperformed ranking feedback for finetuning. The rationale carries the signal.
- [Design with Intent](https://github.com/ghaida/intent) (Ghaida; CC0): the severity scale, positive findings, counter-metrics, state catalog, stress prompts, and fidelity traps here are adapted from it.
- [GOV.UK Design System](https://design-system.service.gov.uk/) and IBM Carbon: documented interaction patterns and accessibility guidance.
