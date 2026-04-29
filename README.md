# swiss-poster-skill

A Swiss Poster design system for AI agents. Huge type, grid-breaking layouts, overlapping elements, and bold color fields — all in Tailwind CSS.

## Install

```sh
npx skills add adewale/swiss-poster-skill
```

Or manually copy the skill directory:

```sh
gh repo clone adewale/swiss-poster-skill
cp -r swiss-poster-skill/swiss-poster ~/.config/opencode/skills/
```

## Usage

Once installed, tell your agent to apply it:

- "Apply the swiss-poster skill to this page"
- "Make this look dramatic — use the Swiss Poster style"
- "Break the grid — give this page poster energy"

The agent will use IBM Plex Sans, the stone color palette, opacity-based hierarchy, and grid-breaking compositions with overlap and bleed.

## What's included

```
swiss-poster/
├── SKILL.md                    # Quick reference (always loaded)
└── references/
    ├── design-system.md        # Full token reference, CSS variables
    ├── components.md           # Tailwind component patterns + poster compositions
    ├── tailwind-config.md      # Paste-ready tailwind.config.js
    ├── prompting.md            # Applying the system + 71-point checklist
    └── research.md             # Designer profiles, key works, source URLs
```

## Design principles

- **Grid as launchpad.** Start with a 12-column grid, then let key elements escape it
- **Extreme scale contrast.** 20rem display type next to 11px labels — 10x+ size ratio
- **Overlap and layer.** Elements collide: text over images, type over type, z-index stacking
- **Bleed and crop.** Type cropped by the viewport edge, elements that run off-screen
- **One accent, used boldly.** Swiss red (`#C8102E`) by default, in large confident fields
- **Tension over comfort.** Asymmetric whitespace, rotation, diagonal energy

## Typography

Primary: **IBM Plex Sans** (Google Fonts) — weights 100 through 700

Fallbacks: Hanken Grotesk · Barlow · Host Grotesk · DM Sans

## License

MIT
