# Goal-directed design of this skill

This applies the skill's own method to the skill. Its users and situations were stated by the maintainer. No one outside the project has used it yet, so everything below about their behavior is **inferred** unless marked otherwise.

## Primary goal

Someone with an interface problem gets to a better interface, with a clear idea of what is known and what isn't, without having to learn a design method first.

## Who uses it

| Person | Actual goal | Likely worries | What they bring | Owns |
|---|---|---|---|---|
| Developer | Ship a change that works and won't come back as a bug | Ceremony, being stopped for things that don't matter | Code, a ticket | Implementation |
| Product manager | Decide what to build and get others behind it | Jargon, needing a developer to see anything, overpromising | An idea, customer feedback, metrics | Product tradeoffs |
| Designer | Reach a better design with sound reasoning | Generic output, being overruled, false claims of validation | Research, sketches, a design file | Design decisions |

Roles are not fixed to people. A founder may be all three in one afternoon, so the skill reads the request rather than asking.

## Situations

| Situation | Starting point | What goes wrong without care |
|---|---|---|
| Something is wrong with an existing interface | A complaint or symptom | Fixing the reported symptom at the wrong layer |
| New feature in an existing product | A product and its patterns | Designing as if the rest of the product didn't exist |
| Greenfield | An idea | Analysis built entirely on assumptions, with nothing to react to |

## Objects and dependencies

| Object | Meaning |
|---|---|
| Request | What the person asked for, which is not yet the goal |
| Task model | The source of truth, updated first when things change |
| Decision | A choice with an owner, which depends on the person |
| Finding | An issue with severity and evidence level |
| Prototype | A front end with a fake list |
| Handoff | What the next person needs without this conversation |

- Person -> who decides, and how results are written.
- Situation -> where work starts and the usual mode.
- What was provided -> the strongest evidence level available.

## Scenarios

1. **A developer has a ticket.** Customers can't find invoices on the billing page. They get a reproduced cause, a change, and what was checked, with few or no questions.
2. **A product manager has an idea.** Nothing exists, and stakeholders meet next week. They get something clickable they can open themselves, and a summary they can forward.
3. **A designer is torn between two options.** They have interviews and wireframes. They get both options judged against the same tasks, then the decision is left to them.
4. **Someone is unclear about the cause.** Conversion dropped. They get hypotheses tied to evidence, not a confident diagnosis from a description.

## Audit of the skill against these

| Severity | Issue | Person affected | Change |
|---|---|---|---|
| Major | No way in except design vocabulary, and modes assumed you knew them | Product manager | Start from situation and person, and read them from the request |
| Major | The orchestrator always chose the design and carried on | Designer | Added who decides, by person |
| Major | Step 1 assumed a codebase | Anyone on a greenfield project | Added a path for when nothing exists |
| Major | "Fix" went straight to build | Developer | "Fix" now means reproduce first |
| Major | Output was one format, written for designers | Developer, product manager | Output now leads with what each person needs |
| Major | Fixes started as audit then build, under the full evidence rules | Everyone, most often developers | Added a light path as the default, with triggers for the full flow |
| Minor | No handoff between roles | All | Added a short handoff |
| Minor | Prototypes needed a server to open | Product manager | One file or link, with no setup |

**What works and should be protected:** the evidence labels, the small and substantial split, the refusal to report simulated runs as user tests, and the independent evaluator.

## Checks so far

Routing was checked by giving fresh sessions each request and asking what they would do. These results are **verified** for routing only. They show what the skill says it will do, not that real people find it useful.

| Request | Picked up the skill | Result with skill loaded |
|---|---|---|
| Developer, invoice ticket | Yes | Audit then fix, reproduce first, decides itself |
| Product manager, clinic idea | Yes | Prototype, plain language, recommends and leaves the decision to them |
| Designer, bulk edit options | Yes | Design, uses their research, presents options and stops |
| Unclear role, conversion drop | Yes | Audit, plain language, treats the cause as a hypothesis |
| Fake countdown timer | Yes | Refuses the fake timer and offers a real deadline |
| One-line label change | No, correctly | Not applicable |
| Backend race condition | No, correctly | Not applicable |

One full run, for scenario 2 (product manager, clinic idea), took 17 minutes, with first browser activity at about 7 minutes. It produced a single file that opens with a double-click, a forwardable brief, and a handoff with the fake list, in plain language. No-memory tests caught a status that misled staff, which a scripted check had missed. Full runs for the developer and designer scenarios have not been done.

Three real fixes on a small test app took about a minute or two each through the light path, against 15 to 17 minutes for a full run. An earlier version deleted a whole screen when asked to improve its error message, so the light path now stays inside the request and flags bigger problems in one line.

## What we don't know

- Whether real developers, product managers, and designers feel served by this. The next step is to watch one of each use it on real work.
- Whether reading the role from the request is accurate outside these examples. A wrong guess costs the most for a designer, because the skill may then decide for them.
- How well it works in Codex and Antigravity.
