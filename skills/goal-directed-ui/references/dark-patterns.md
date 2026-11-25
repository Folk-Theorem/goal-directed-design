# Dark patterns and common failures

Use this in audits and when reviewing your own designs. A pattern here is a design choice that serves the business at the cost of the person using the product.

Judge the effect on people, not the name. Infinite scroll in a feed built to extend sessions is a dark pattern; the same control in a work log may be fine. State what the pattern does to someone, and what they would have chosen otherwise.

Severity uses the scale in [usability-evaluation.md](usability-evaluation.md). A confirmed dark pattern is always critical or major. Some of these are also regulated in some markets, so flag that for legal review rather than giving a legal verdict. If someone asks you to build one, say so, explain the harm, and offer an honest alternative.

## Deception

| Pattern | What it does | Severity |
|---|---|---|
| Bait and switch | Offers one thing and delivers another | Critical |
| Trick questions | Double negatives or inverted logic make people choose the opposite of what they intend | Critical |
| Hidden costs | Reveals fees or charges only at the final step | Critical |
| Sneak into basket | Adds items or donations without explicit action | Critical |
| Visual misdirection | Uses size, color, or position to make the preferred option look like the only one | Major |
| Disguised ads | Makes ads look like content, navigation, or system UI | Major |
| Confirmshaming | Uses guilt in opt-out wording, such as "No thanks, I don't want to save money" | Major |

## Defaults and consent

| Pattern | What it does | Severity |
|---|---|---|
| Prechecked consent | Pre-selects marketing, data sharing, or terms | Critical |
| Opt-out burden | Makes leaving much harder than joining | Critical |
| Forced continuity | Moves a free trial into paid without clear warning or easy cancellation | Critical |
| Exposed by default | Defaults to maximum data exposure and relies on people not changing it | Major |
| Default to most expensive | Pre-selects the highest-cost option | Major |

## False urgency

| Pattern | What it does | Severity |
|---|---|---|
| Fake countdown timers | Timers that reset or have no real deadline | Critical |
| Fabricated scarcity | Claims like "Only 2 left!" that don't reflect stock | Critical |
| Fake social proof | Made-up activity or reviews | Critical |
| Pressure selling | Time-limited offers meant to stop comparison | Major |
| Loss framing | Frames a choice as a loss to exploit loss aversion | Major |

## Compulsion

| Pattern | What it does | Severity |
|---|---|---|
| Variable rewards | Unpredictable rewards that drive compulsive checking | Major |
| Streak manipulation | Artificial loss for missing daily use | Major |
| Infinite scroll | Removes stopping points to extend sessions | Major |
| Autoplay chains | Starts the next item without consent | Major |
| Artificial incompleteness | Progress scores that exploit the urge to finish, to extract data or engagement | Major |

## Attention

| Pattern | What it does | Severity |
|---|---|---|
| Permission harassment | Keeps asking after someone has declined | Major |
| Notification spam | Sends low-value notifications to pull people back | Major |
| Obstruction interstitials | Overlays that block content and are hard to dismiss | Major |
| Attention bait | Misleading badges or unread counts | Major |
| Nagging | Repeated prompts for things someone has shown no interest in | Major |

## Accessibility used as a barrier

| Pattern | What it does | Severity |
|---|---|---|
| Inaccessible unsubscribe | Cancellation fails with a screen reader or keyboard | Critical |
| Assistive technology traps | Focus traps or reading-order tricks around consent or cancellation | Critical |
| CAPTCHA gatekeeping | Challenges with no accessible alternative | Major |
| Low-contrast opt-out | Decline options deliberately faint or tiny | Major |

## Exploiting vulnerability

All critical. Targeting children with game mechanics or peer pressure; confusing people with low digital literacy; pressure or inflated pricing during medical, financial, or legal crises; triggering known addictive behaviors; predatory products aimed at people showing financial stress.

## AI products

| Pattern | What it does | Severity |
|---|---|---|
| Algorithmic exploitation | Uses behavioral data to exploit individual vulnerabilities | Critical |
| Anthropomorphic manipulation | Gives AI emotions to create guilt or attachment | Major |
| Opaque personalization | Steers choices without people knowing why they see what they see | Major |
| Manufactured dependency | Designs help so that people's competence declines | Major |
| Undisclosed AI decisions | Hides that AI makes consequential decisions such as pricing or eligibility | Major |
| Simulated understanding | Makes AI seem to understand what it can't, creating false trust | Major |

## Common failures

These usually come from neglect rather than intent, so judge their severity by impact.

| Failure | What it looks like |
|---|---|
| Dead ends | Empty states or error pages with no way forward |
| Missing feedback | An action happens and nothing visibly changes |
| Destructive defaults | Irreversible actions that are too easy to trigger |
| Broken error recovery | "An error occurred", with no explanation or fix |
| Assumption of context | Expects people to remember something from elsewhere |
| Jargon overload | Internal terms the audience doesn't know |
| Inconsistent patterns | The same action works differently across the product |
| Mobile afterthought | Desktop-first design that breaks on small screens |

## Source

Condensed from the anti-pattern catalog in [Design with Intent](https://github.com/ghaida/intent) by Ghaida, released under CC0 1.0. Names and severities are adapted to this skill's scale, and regulatory notes are left out.
