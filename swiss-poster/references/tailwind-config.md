# Swiss Poster Design System — Tailwind Configuration

## Tailwind v3 (`tailwind.config.js`)

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'media', // respects prefers-color-scheme automatically
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'IBM Plex Sans',
          'Hanken Grotesk',
          'Barlow',
          'Host Grotesk',
          'DM Sans',
          'system-ui',
          'sans-serif',
        ],
        condensed: [
          'Barlow Condensed',
          'Barlow',
          'Arial Narrow',
          'sans-serif',
        ],
        serif: [
          'IBM Plex Serif',
          'Georgia',
          'serif',
        ],
        mono: [
          'IBM Plex Mono',
          'Fira Code',
          'ui-monospace',
          'monospace',
        ],
      },
      maxWidth: {
        prose: '60ch',
        'prose-wide': '72ch',
      },
      lineHeight: {
        'display': '0.85',
        'heading': '1.15',
      },
      letterSpacing: {
        'display': '-0.03em',
        'label': '0.08em',
      },
      fontSize: {
        'mega': 'clamp(6rem, 15vw, 20rem)',
        'mega-sm': 'clamp(3rem, 10vw, 10rem)',
      },
    },
  },
  plugins: [],
}
```

---

## Tailwind v4 CSS config (`@theme` block)

Add to your main CSS file:

```css
@import "tailwindcss";

@theme {
  --font-sans: 'IBM Plex Sans', 'Hanken Grotesk', 'Helvetica Neue', Arial, system-ui, sans-serif;
  --font-condensed: 'Barlow Condensed', 'Barlow', 'Arial Narrow', sans-serif;
  --font-serif: 'IBM Plex Serif', Georgia, serif;
  --font-mono: 'IBM Plex Mono', 'Fira Code', ui-monospace, monospace;

  --max-width-prose: 60ch;
  --max-width-prose-wide: 72ch;

  --line-height-display: 0.85;
  --line-height-heading: 1.15;

  --letter-spacing-display: -0.03em;
  --letter-spacing-label: 0.08em;

  --font-size-mega: clamp(6rem, 15vw, 20rem);
  --font-size-mega-sm: clamp(3rem, 10vw, 10rem);
}
```

---

## Google Fonts `<link>` tag

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=Barlow:wght@400;500;700&family=Hanken+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=IBM+Plex+Serif:wght@400;600;700&display=swap" rel="stylesheet">
```

Note: This broad link is for prototypes. Production outputs should load only the lineage families they use. Extreme weights support type-as-image posters, but condensed/serif/mono/custom lettering proxies are often more historically plausible for object, travel, Geigy/scientific, or contemporary cultural posters.

---

## Tailwind CDN Play (no build step)

For prototypes and demos:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    darkMode: 'media',
    theme: {
      extend: {
        fontFamily: {
          sans: ['IBM Plex Sans', 'Hanken Grotesk', 'system-ui', 'sans-serif'],
          condensed: ['Barlow Condensed', 'Barlow', 'Arial Narrow', 'sans-serif'],
          serif: ['IBM Plex Serif', 'Georgia', 'serif'],
          mono: ['IBM Plex Mono', 'monospace'],
        },
        lineHeight: {
          'display': '0.85',
        },
      },
    },
  }
</script>
```

---

## Full global CSS block

Paste after your Tailwind imports:

```css
/* Swiss Poster Design System — global tokens */
:root {
  --font-sans: 'IBM Plex Sans', 'Hanken Grotesk', 'Helvetica Neue', Arial, system-ui, sans-serif;
  --font-condensed: 'Barlow Condensed', 'Barlow', 'Arial Narrow', sans-serif;
  --font-serif: 'IBM Plex Serif', Georgia, serif;
  --font-mono: 'IBM Plex Mono', monospace;

  /* Accent — override this per project */
  --accent: #C8102E;
  --accent-80: rgba(200, 16, 46, 0.80);
  --accent-60: rgba(200, 16, 46, 0.60);
  --accent-20: rgba(200, 16, 46, 0.20);
  --accent-10: rgba(200, 16, 46, 0.10);
}

body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Swap accent globally: just update this block */
/*
:root { --accent: #003B8E; }  Cobalt
:root { --accent: #F0B429; }  Golden
:root { --accent: #2D6A4F; }  Forest
*/
```

---

## Switching accent colors

To change the accent for a project, update both the CSS variable and the Tailwind arbitrary values:

```css
:root { --accent: #003B8E; } /* Cobalt */
```

And in your HTML use `bg-[#003B8E]`, `text-[#003B8E]`, `border-[#003B8E]` consistently. Since there is only one accent per project, a global find-replace is safe.

---

## Utility classes for poster compositions

These custom utilities are useful for poster-style layouts. Add to your global CSS:

```css
/* Prevent breakout elements from causing horizontal scroll */
.poster-section {
  overflow: hidden;
  position: relative;
}

/* Full-bleed container escape */
.full-bleed {
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding-left: calc(50vw - 50%);
  padding-right: calc(50vw - 50%);
}

/* Decorative text that should not be read or selected */
.poster-bg-text {
  user-select: none;
  pointer-events: none;
  position: absolute;
}
```
