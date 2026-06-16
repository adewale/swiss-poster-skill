# swiss-poster-skill

[![skills.sh](https://skills.sh/b/adewale/swiss-poster-skill)](https://skills.sh/adewale/swiss-poster-skill)

A Swiss Poster design system for AI agents. Huge type, grid-breaking layouts, overlapping elements, bold color fields, cropped geometry, microtype, and hard figure/ground drama — all in Tailwind CSS.

## Install

```sh
npx skills add adewale/swiss-poster-skill
```

To opt out of skills CLI telemetry for the install:

```sh
DISABLE_TELEMETRY=1 npx skills add adewale/swiss-poster-skill
```

Or manually copy the skill directory:

```sh
gh repo clone adewale/swiss-poster-skill
cp -r swiss-poster-skill/swiss-poster ~/.config/opencode/skills/
```

## Agent compatibility

The installable skill directory is `swiss-poster`. It uses the Agent Skills `SKILL.md` format and is configured for Codex, OpenCode, Pi, Gemini CLI, and Claude Code.

| Agent/client | Install or use |
|---|---|
| Codex | `cp -R swiss-poster ~/.codex/skills/swiss-poster` |
| OpenCode | `cp -R swiss-poster ~/.config/opencode/skills/swiss-poster` or use `.opencode/skills/swiss-poster` in a project |
| Pi | `pi install https://github.com/adewale/swiss-poster-skill` or `pi --skill swiss-poster` |
| Gemini CLI | `gemini skills install https://github.com/adewale/swiss-poster-skill --path swiss-poster` or copy to `.gemini/skills/swiss-poster` |
| Claude Code | `npx skills add adewale/swiss-poster-skill` or copy to `.claude/skills/swiss-poster` |

## skills.sh

This repository is configured for skills.sh. Per the skills.sh docs, repositories appear after the skills CLI sees an install, and rankings use anonymous CLI telemetry.

## Usage

Once installed, tell your agent to apply it:

- "Apply the swiss-poster skill to this page"
- "Make this look dramatic — use the Swiss Poster style"
- "Break the grid — give this page poster energy"

The agent will use IBM Plex Sans, the stone color palette, opacity-based hierarchy, and grid-breaking compositions with one dominant poster-scale event, edge pressure, microtype/data layers, hard fields, graphic rhythm, overlap, and bleed.

## What's included

```
swiss-poster/
├── SKILL.md                    # Quick reference (always loaded)
└── references/
    ├── design-system.md        # Full token reference, CSS variables
    ├── components.md           # Tailwind component patterns + dramatic poster archetypes
    ├── tailwind-config.md      # Paste-ready tailwind.config.js
    ├── prompting.md            # Applying the system + 117-point checklist
    └── research.md             # Designer profiles, key works, source URLs

evals/
├── shared-benchmark.json       # Shared Skill Eval Harness manifest
└── oracles/                    # Deterministic script oracles for fixture/drama checks
```

The Anti-Slop principles live in `SKILL.md`. The full catalog and deterministic detector are maintained by Paul Bakaus at [impeccable.style/slop](https://impeccable.style/slop/) — install with `npx impeccable skills install` and run `npx impeccable detect <file>` to verify.

## Design principles

- **Grid as launchpad.** Start with a 12-column grid, then let key elements escape it
- **Extreme scale contrast.** 20rem display type next to 11px labels — 10x+ size ratio
- **Overlap and layer.** Elements collide: text over images, type over type, z-index stacking
- **Bleed and crop.** Type cropped by the viewport edge, elements that run off-screen
- **One accent, used boldly.** Swiss red (`#C8102E`) by default, in large confident fields
- **Tension over comfort.** Asymmetric whitespace, rotation, diagonal energy
- **Dominant graphic event.** Each major section chooses one anchor: cropped word, giant date, split field, geometry, masked photo, rhythm, or collage

## Evals

This repo includes shared Skill Eval Harness cases:

```sh
skill-benchmark validate evals/shared-benchmark.json
skill-benchmark prepare evals/shared-benchmark.json --split tune --out /tmp/swiss-poster-tasks.jsonl
skill-benchmark benchmark evals/shared-benchmark.json --runs eval-runs/latest --allow-scripts --out /tmp/swiss-poster-benchmark.json
```

The `drama_oracle.py` checks for code carriers that tend to produce actually dramatic posters: 12-column grid, fluid mega anchor, microtype, edge crop/bleed, one accent, hard field/inversion, graphic system, and mobile safety. `semantic_drama_oracle.py` checks the next failure mode: the big element must communicate the subject and the primary title/CTA path must remain readable. `motif_diversity_oracle.py` checks archetype-specific outputs and can score a whole run for motif coverage/template collapse. `readability_oracle.py` checks the protected-reading-zone / contrast-channel failure surfaced by the characterization sheet: critical title/body/CTA copy must get an uncontested local contrast channel while dramatic anchors, route lines, bars, diagrams, or photos stay severe outside/behind that zone. `artifact_integrity_oracle.py` checks the next after-image failures: source-ledger preservation, semantic image roles, encoded diagrams, embodied historical moves, prompt-shaped visible copy, period/genre breadth, palette lineage, material process, restraint, and avoiding accidental late-New-Wave template anchoring. `rendered_poster_oracle.py` renders generated HTML in headless Chrome and checks `[data-critical]` text boxes for viewport bounds, center obstruction, font size, opacity, local pixel contrast, high-variance backing, and horizontal overflow. `flue_framework_oracle.py` adds a regression check for source-support readability outside `[data-critical]` and filters web CTA leakage such as `View Documentation`.

## Typography

IBM Plex Sans is the default open neo-grotesk proxy, not the whole Swiss poster tradition. Choose type by lineage:

- Zurich/Basel grid: IBM Plex Sans, Hanken Grotesk, Helvetica-like system fallbacks
- Object/travel/Geigy labels: Barlow Condensed / Barlow
- Lithographic or historic placards: IBM Plex Serif, Georgia, or treated custom lettering
- Scientific/framework/source-ledger posters: IBM Plex Mono for measured labels
- New Wave/contemporary cultural: transformed, fragmented, or custom CSS lettering when subject-appropriate

## License

MIT
