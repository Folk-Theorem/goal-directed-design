# Prototyping

A prototype is a working front end with no backend. It is for answering interaction questions quickly, before anyone pays for services, data, or integration. Prefer it to `build` when the flow is uncertain or when several models need trying.

Speed is the point, so test early. **The first build is one task: its normal path and its likeliest failure. Test that before building anything else.** Keep the up-front task model to what that path needs, because the prototype is how you find out the rest. If models compete, sketch them in a few lines and build the one you are least sure about.

Make it easy to open. A product manager or stakeholder should be able to double-click one file or follow one link, with no install or server. For simulated tests, the orchestrator also serves that same file on localhost, because browser tools usually block `file://` pages.

## What a prototype can answer

| Good for | Can't tell you |
|---|---|
| Task flow, navigation, and order | Real latency and performance |
| Labels, wording, and what a decision needs | How the real service fails |
| How empty, error, and recovery states work | Real permissions and data volume |
| Keyboard use and focus | Conflicts, stale data, and concurrent changes |
| Layout under long, short, and missing content | Touch ergonomics and performance on the real device |

Forced states are a real advantage here. A prototype can show a failure on demand, which a live system rarely does when you need it.

## Build it

1. **Start from the question.** Fidelity has three separate parts: interactivity, visuals, and content. Raise only the part the question needs. A flow question needs working interaction, not polish. A legibility question needs real visuals. Cut scope, not realism: keep real labels and working controls, and build less of the product instead of a vaguer version of it.
2. **Reuse what exists.** In an existing project, use its components and design system so findings carry over. With no project, plain HTML is fine.
3. **Keep it apart from production.** Use a dev-only route, a story, or a prototype folder, following the repository's conventions. Don't change production code paths.
4. **Fake at one boundary.** Put all fake behavior in a single in-memory data layer that implements the task model's dependencies. Screens call it the way they would call the real service, so replacing it later touches one place.
5. **Make states reachable.** Add a switch, such as a `state` URL parameter, that forces the states under test. Add others as rounds need them, drawing on empty, loading, error, partial, unauthorized, and stale.
6. **Add realistic delay.** A fake that answers instantly hides loading states and changes how the flow feels. Use a short default delay and a slow setting.
7. **Use awkward data.** Include long names, missing values, and many items. Label it as mock data, and never use real personal data, real credentials, or live endpoints.
8. **Keep a fake list.** Record everything the prototype pretends: latency, validation rules, error responses, permissions, and data shape. Each entry is an assumption the real service must meet.

## Avoid the fidelity traps

- **Polish critique:** styled screens get feedback about styling, and the structural questions go unasked. Unless visuals are the question, stay plain.
- **Done-looking artifact:** a finished-looking screen makes people reluctant to challenge it. Label it a prototype, and say what kind of feedback you want.
- **Premature convergence:** the first idea you build is usually the most familiar one, not the best.
- **Fidelity mismatch:** match what you show to the decision at hand. Don't bring a polished flow to people who haven't agreed on the structure.

## Iterate

1. Build the primary path and only the states the next test needs.
2. Test using [simulated-user-testing.md](simulated-user-testing.md), with the state switch reaching the failures. Use a fresh evaluator each round, because one that saw the last fix isn't independent.
3. Fix each problem at its layer, updating the task model first when the model is what's wrong.
4. Re-run the affected tasks and one primary task.

Stop when the primary tasks pass and a round finds no new high-impact issue, or after about three rounds, and report what is still open. Don't polish past the question: effort makes a design harder to give up, and the point of a prototype is that it can be thrown away.

This is also the cheapest moment for real people to try the design. If a question depends on human comprehension or trust, put the prototype in front of people rather than running more simulated rounds.

## Move to build

- Carry forward the task model, scenarios, decisions, test cards, and fake list. Prototype code carries forward only if it is reviewed to production standards.
- Replace the fake layer, and check each fake list entry against the real service. A mismatch is an interaction question, not only a technical one: if the real error differs, the error design may need to change.
- Re-run the primary scenarios on the build. Results labeled **verified (prototype)** do not carry over.
- Test on the target device for anything touch or performance related.

## Sources

- [NN/g on prototype fidelity](https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/): fidelity spans interactivity, visuals, and content. Realistic response speed keeps people's flow intact, and teams grow attached to polished designs.
- [Design with Intent](https://github.com/ghaida/intent) (CC0): the fidelity traps and "scope, not abstraction" are adapted from its `wireframe` skill.
- [GOV.UK Prototype Kit](https://prototype-kit.service.gov.uk/docs/): realistic, accessible prototypes built from design system components to gather feedback.
