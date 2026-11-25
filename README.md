# Goal-directed UI

Work out how an interface should behave from what people are trying to do, then design, prototype, build, or audit it and test it against real tasks.

It adapts to who is asking and where they are starting:

| | Something is wrong | New feature | Greenfield |
|---|---|---|---|
| **Developer** | Reproduce it, fix it, say what was checked | Fit the product's patterns and build it | A working starting point |
| **Product manager** | What's wrong, in plain language, and what to do | Options, tradeoffs, and something clickable | A prototype to show people |
| **Designer** | Severity-ranked critique | Alternatives and rationale, and you decide | A task model and a test plan |

Installs in Claude Code, Codex, and Antigravity, and can be copied into anything that reads `SKILL.md` skills.

## Install

Replace `<owner>/<repo>` with where this repository is hosted, or use a local path to the repository.

### Claude Code

```sh
claude plugin marketplace add <owner>/<repo>
claude plugin install goal-directed-ui@goal-directed-ui
```

This installs the skill, all four agents, and the browser server.

### Codex

```sh
codex plugin marketplace add <owner>/<repo>
codex plugin add goal-directed-ui@goal-directed-ui
```

This installs the skill. For simulated user tests, clone this repository somewhere permanent and add its browser server:

```sh
codex mcp add playwright -- node /path/to/your/clone/scripts/browser.mjs
```

### Antigravity

```sh
agy plugin install https://github.com/<owner>/<repo>
```

### Any other tool

```sh
npx skills add <owner>/<repo> --all
```

Or copy `skills/goal-directed-ui/` into the tool's skills folder. Both routes install the skill without the agents, and it runs by following the role contracts in its references.

Start a new session after installing.

### Browser for simulated user tests

Simulated tests need Node and a one-time browser install:

```sh
npx -y -p @playwright/mcp@0.0.83 playwright install chromium
```

Point tests only at prototypes or at local or staging builds with test data. The evaluator can click anything a user can, including real payment or send actions. In Claude Code, the server loads only in a trusted folder, so check that first if the evaluator reports no browser tools. The plugin also makes the browser tools available to the main session.

The bundled server runs through `scripts/browser.mjs`, which enforces limits whatever the model asks for:

- **Files:** it runs in a throwaway folder, ignores file names, and offers no code execution outside the page (JavaScript inside the page is still possible in the main session), so it can't write to your project.
- **Sites:** only `localhost` and `127.0.0.1` are reachable, on any port, so other services running locally are in reach too. To test staging, set `GDUI_ALLOWED_ORIGINS`, for example `https://staging.example.com`, before starting. Separate several with `;`, and include any separate API or asset hosts. Don't list production.
- **Uploads:** only generated sample files can be uploaded, including empty, corrupt, and oversized ones.

These limits cover this server only. If you have another browser server, it has its own rules, and the evaluator isn't given it. A local app that connects to live services can still act on them. `npx` downloads the pinned server and its dependencies at run time, and `interface-implementer` runs with the session's full tools.

In tools other than Claude Code, the server isn't set up automatically. Add the same `node .../scripts/browser.mjs` command, from a clone, to that tool's MCP settings, or use the skill without simulated tests.

To check the limits: `node --test tests/browser.test.mjs`.

## Use

Describe what you need in your own words, and the skill works out the rest. Fixes and small changes take a light path: reproduce, fix, check, and report in a few lines. The full flow is only for work that needs it. You can also name a mode. The command name varies by tool; in a Claude Code plugin install, it is `/goal-directed-ui:goal-directed-ui`.

```text
goal-directed-ui audit [interface]
goal-directed-ui design [user task]
goal-directed-ui prototype [flow]
goal-directed-ui build [feature]
```

Use `prototype` while a flow is uncertain. It makes a front end with no backend so you can test and change it quickly, and it keeps a list of everything it faked for the build to check against real services.

The orchestrator delegates only for substantial work. The researcher, architect, and evaluator can't edit files: they return results in their responses, and the orchestrator saves anything worth keeping. The evaluator can also drive a browser. The implementer handles code edits and checks after a design is selected.

See `docs/design/task-model.md` for how this skill was designed, and what is still unknown about its users.

## Reference files

In `skills/goal-directed-ui/references/`:

- `interaction-guidelines.md`: states, stress tests, specific guidance by decision, how to resolve conflicts between guidelines, and the accessibility baseline.
- `usability-evaluation.md`: evidence levels, how to review with an AI evaluator, and the research behind the method.
- `prototyping.md`: building and testing a front-end prototype with no backend, and moving from it to a build.
- `simulated-user-testing.md`: persona tests, no-memory and full-memory modes, and enforced conditions. Simulated tests rehearse for real user testing and don't replace it.
- `dark-patterns.md`: deceptive and manipulative patterns to catch in audits, with severity.
- `agent-orchestration.md`: running the roles on different hosts, role contracts, and handoff schemas.
