# Interaction guidelines by decision

Read the section for the decision at hand. These are defaults drawn from published guidance, not proof that a design works for a particular audience. Sources are listed at the end and were last checked on 2026-11-05.

## When guidance conflicts

Published guidelines disagree, so apply them in this order:
1. Legal and accessibility requirements for the product.
2. Evidence about these users and this task.
3. The project's design system and existing behavior.
4. The target platform's conventions.
5. General guidance such as this file.

State the choice and the reason when it matters. Known conflicts:

| Decision | One position | Other position | How to choose |
|---|---|---|---|
| When to validate | Apple: check values as soon as people enter them | GOV.UK: wait until people submit, and use live validation only if research supports it | Follow the platform or the existing product. GOV.UK warns that validating during typing causes problems, especially for slower typists. Apple's example is a number formatter that enforces the format as people type |
| Confirming deletion | Nielsen and many checklists: confirm risky actions | Apple: warn about unexpected, irreversible loss, not loss the person clearly intended | See [Confirmation and undo](#confirmation-and-undo) |
| Questions per page | GOV.UK: start with one question per page | Grouped fields, for frequent internal work | GOV.UK itself allows grouping when research supports it, for example users who repeat tasks and switch between them quickly |

Consistency means predictable behavior, not identical layouts. Keep brand, content, and accessibility shared across platforms, and adapt navigation and controls to each one.

## States

Most designs specify only the default. For each state that applies, answer what people see, what they can do, and how they recover or move on.

| State | Questions to ask |
|---|---|
| Default | What does normal data look like, and how much of it is there? |
| Empty | First use, no results, or cleared: what explains it and offers the next step? |
| Loading | Initial, background, or submitting: can people keep working? |
| Partial | Some content loaded and some failed: this is the most often missed state |
| Error | Input, system, network, permission, or timeout: each needs different wording and recovery |
| Success | What exactly happened, and what comes next? |
| Offline | What still works, and what happens to actions taken offline? |
| Disabled | Why is it unavailable, and what would enable it? |
| Overflow | What if there is far more data than the design expects? |
| Stale | What if the data changed since it was loaded, or someone else changed it? |

## Stress tests

Use the ones that fit the task. Skip those that don't apply.

- **Content:** a very short or very long title, a blank value, right-to-left or mixed scripts, pasted URLs or markup.
- **Volume:** 0, 1, 50, or 10,000 items; every optional field filled; a badge showing 999+.
- **Time:** a response in 200ms, 5 seconds, 30 seconds, or never; leaving mid-flow and returning next month; a session expiring mid-task.
- **Network:** a connection lost mid-action or mid-payment, or one that keeps dropping.
- **Device:** 320px wide, 200 percent zoom, screen reader, an old slow device.
- **Behavior:** double-clicking, the back button mid-flow, two tabs on the same flow, sharing a link to a signed-in state, walking away mid-task.

## Feedback and status

- Match the interruption to the significance. Show status passively and near the thing it describes. Interrupt only for critical, ideally actionable, information. Alerts lose their force when overused.
- Confirm success only for significant actions. People expect routine actions to work and mainly need to hear when one doesn't.
- When a command can't run, say so and say why.
- Don't rely on one channel. Pair color with text or icons, and sound with something visible.

## Confirmation and undo

- Prefer prevention, then undo, then confirmation.
- Reserve confirmation for actions that destroy work or cost significant money, especially irreversible ones, and for loss the person may not expect.
- Don't warn when loss is the expected result of the action, such as moving a file to the trash.
- Make confirmations specific: name the item and the consequence, label buttons with outcomes ("Delete file", "Keep file") rather than Yes/No, and don't default to the destructive choice.
- For rare and very dangerous actions, require an unusual step, such as typing a word.
- An undo that vanishes on a timer is a weak recovery path. Avoid auto-dismissing views where people may need longer, including people using assistive technology.

## Forms and data entry

- Don't ask for what the system can get or infer. Pre-fill sensible defaults.
- Prefer choices over typing where the options are known.
- Never ask again for what was entered earlier in the same process, unless re-entry is essential such as for security (WCAG 3.3.7).
- Label every field. Hint text supplements a label and does not replace it.
- Never prepopulate a password field. Don't require a cognitive test such as remembering or transcribing to log in, unless an alternative or assistance exists (WCAG 3.3.8).
- On a failed submit on the web: show an error summary at the top, move focus to it, put a message beside each field, and keep what people entered.
- Keep the back button working. After a one-time action such as a payment, it should show a sensible message rather than repeat the action.
- Try improving the order, type, and number of questions before adding a progress indicator.

## Navigation and modals

- Get people directly to the task. Don't lock them into flows, and make guided flows easy to skip or leave.
- Use a modal only when it clearly helps people focus or make a choice. Keep modal tasks short, title them with the task, and always offer an obvious way out.
- Don't build an app within an app: avoid hierarchies inside a modal, and don't stack modals.
- If dismissing a modal would lose someone's content, explain that and offer a way to save it.
- Keep content and controls in predictable positions as the layout adapts.
- Limit onscreen controls so the primary task stands out, while keeping secondary actions a short step away.

## Loading, empty states, and onboarding

- Show something as soon as possible; a blank wait reads as a fault. Use placeholders and let people do other things while content loads.
- Use determinate progress when the duration is known.
- Give every empty state a clear next step.
- If onboarding is needed, teach by doing, prefer context-specific tips over one upfront flow, and make tutorials optional and findable later. Onboarding doesn't fix a confusing interface.

## Writing

- Label buttons and links with verbs, and keep the same term for the same thing throughout.
- Put the most important information first. Use plain language without jargon, and write with localization in mind.
- Put error messages as close to the problem as possible. Don't blame the person. Say what they can do to fix it.
- Match the tone to the moment. A failed payment is not the place for a joke.
- Give a clear reason when asking for permission.

## Simplicity and hierarchy

- Simplicity is not minimalism. Remove what doesn't serve the task, but keep labels, status, and recovery guidance.
- Every element should earn its place. Trace each one to the task model.
- Delight must not get in the way of the task, and it never justifies decoration that competes with the work.

## Trust

See [dark-patterns.md](dark-patterns.md) for what to avoid and how to name it.

- Collect only what the product needs, and say what is collected and why.
- Consider how a feature could be misused or cause harm, and design protections for it.
- Don't use defaults, wording, or layout to steer people against their own interest.

## Accessibility baseline

Target WCAG 2.2 Level AA unless the project sets a higher bar. Commonly missed requirements:

| Requirement | WCAG | Level |
|---|---|---|
| Text contrast of 4.5:1, or 3:1 for large text | 1.4.3 | AA |
| Contrast of 3:1 for controls, states, and meaningful graphics | 1.4.11 | AA |
| Color is not the only way information is conveyed | 1.4.1 | A |
| Everything works from a keyboard | 2.1.1 | A |
| A focused element is not fully hidden by sticky headers or overlays | 2.4.11 | AA |
| Dragging has a single-pointer alternative, unless dragging is essential | 2.5.7 | AA |
| Pointer targets are at least 24 by 24 CSS pixels, or meet a spacing or other listed exception | 2.5.8 | AA |
| Repeated help appears in the same relative order | 3.2.6 | A |
| Information already entered is not requested again | 3.3.7 | A |
| Login doesn't depend on a cognitive test | 3.3.8 | AA |

Beyond the checklist:
- Let people enlarge text; Apple advises at least 200 percent where possible. Check that layouts survive it.
- Respect system settings for dark mode, increased contrast, and reduced motion.
- Offer on-screen alternatives to gestures. Use the simplest gesture possible for frequent actions.
- Don't autoplay media without controls, and be careful with fast or blinking animation.

Platform minimums differ, so use the target platform's values for control size and spacing rather than copying another platform's.

## Sources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/getting-started): Design principles, Feedback, Entering data, Modality, Loading, Onboarding, Writing, Accessibility, Designing for iOS. Apple-platform guidance; its general principles transfer more readily than its specifics.
- [Nielsen's 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) and [NN/g on confirmation dialogs](https://www.nngroup.com/articles/confirmation-dialog/).
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) (W3C).
- GOV.UK Design System: [Question pages](https://design-system.service.gov.uk/patterns/question-pages/) and [Recover from validation errors](https://design-system.service.gov.uk/patterns/validation/). Written for public government services; other audiences may differ.
- [Ramotion, What are UI guidelines?](https://www.ramotion.com/blog/what-are-ui-guidelines/). An agency summary, useful for what a guideline set should cover.
- [Design with Intent](https://github.com/ghaida/intent) (CC0): the state catalog and stress tests are adapted from its `fortify` skill.
