import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

const GITHUB_URL = 'https://github.com/zeke/swiss-design-skill'

// Four original + four new accent colors
const ACCENTS = [
  { name: 'Swiss Red',    hex: '#C8102E', label: 'Default',    desc: 'Bold and assertive. The classic Swiss poster red.' },
  { name: 'Cobalt',       hex: '#003B8E', label: 'Technical',  desc: 'Corporate and trustworthy. Engineering and data.' },
  { name: 'Golden',       hex: '#F0B429', label: 'Editorial',  desc: 'Warm and cultural. Print, arts, food.' },
  { name: 'Forest',       hex: '#2D6A4F', label: 'Natural',    desc: 'Calm and grounded. Health, sustainability.' },
  { name: 'Vermilion',    hex: '#E8431A', label: 'Energy',     desc: 'High-contrast orange-red. Motion and urgency.' },
  { name: 'Violet',       hex: '#6B21A8', label: 'Creative',   desc: 'Deep purple. Fashion, beauty, luxury editorial.' },
  { name: 'Magenta',      hex: '#C0186C', label: 'Bold',       desc: 'Hot pink-red. Vibrant, fearless, high-impact.' },
  { name: 'Lavender',     hex: '#7C3AED', label: 'Electric',   desc: 'Electric purple. Digital, futuristic, cultural.' },
]

const HEAD = html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swiss Design System</title>
  <meta name="description" content="A Swiss International Style design system skill for AI agents. IBM Plex Sans, stone palette, grid, whitespace.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
            mono: ['IBM Plex Mono', 'monospace'],
          },
          fontSize: {
            'display': ['5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
          },
        },
      },
    }
  </script>
  <style>
    body { -webkit-font-smoothing: antialiased; }
    html { scroll-behavior: smooth; }
  </style>
  <script>
    // Apply stored preference or system preference immediately (no flash)
    (function() {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
</head>
<body class="bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 font-sans transition-colors duration-200">`

const FOOT = html`
  <script>
    // Manual toggle — stores override in localStorage
    function toggleDark() {
      const html = document.documentElement;
      html.classList.toggle('dark');
      localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    }

    // Listen for system preference changes and apply live, unless user has overridden
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    });
  </script>
</body>
</html>`

// ─── Navigation ─────────────────────────────────────────────────────────────

const Nav = () => html`
<nav class="fixed top-0 left-0 right-0 z-50 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-sm">
  <div class="max-w-6xl mx-auto px-8 flex items-center justify-between h-14">
    <a href="/" class="text-xs tracking-widest uppercase font-medium text-stone-900 dark:text-stone-50">
      Swiss Design
    </a>
    <div class="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
      <a href="#editorial" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Editorial</a>
      <a href="#poster" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Poster</a>
      <a href="#data" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Data</a>
      <a href="#cards" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Cards</a>
      <a href="#app" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">App</a>
      <a href="#type" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Type</a>
      <a href="#color" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Color</a>
      <a href="#form" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Form</a>
      <a href="#responsive" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Responsive</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="${GITHUB_URL}" target="_blank" class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        GitHub
      </a>
      <button onclick="toggleDark()" class="w-8 h-8 flex items-center justify-center border border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 transition-colors" aria-label="Toggle dark mode">
        <span class="dark:hidden text-xs text-stone-900">○</span>
        <span class="hidden dark:inline text-xs text-stone-50">●</span>
      </button>
    </div>
  </div>
</nav>`

// ─── Section 01: Hero ────────────────────────────────────────────────────────

const SectionHero = () => html`
<section id="hero" class="relative min-h-screen flex items-center overflow-hidden border-b border-stone-200 dark:border-stone-800">
  <!-- Large background numeral -->
  <div class="absolute top-0 right-0 text-[clamp(10rem,28vw,26rem)] font-light leading-none text-stone-900/5 dark:text-stone-50/5 select-none pointer-events-none translate-x-8">
    01
  </div>

  <div class="max-w-6xl mx-auto px-8 py-40 relative z-10 grid grid-cols-12 gap-8 w-full">
    <div class="col-span-12 md:col-span-8">
      <span class="text-sm tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Swiss Design System — A skill for AI agents</span>
      <div class="w-8 h-px bg-[#C8102E] mt-6 mb-10"></div>
      <h1 class="text-6xl md:text-8xl font-normal tracking-tight leading-none text-stone-900 dark:text-stone-50">
        Swiss<br>International<br>Style.
      </h1>
      <p class="text-xl leading-relaxed text-stone-900/70 dark:text-stone-50/70 mt-10 max-w-[52ch]">
        A design system rooted in the modernist movement that emerged from Zürich and Basel in the 1950s. Grotesque typography, mathematical grid, generous whitespace, restrained color — taught to your AI agent through Tailwind CSS.
      </p>
      <div class="mt-12 flex flex-col sm:flex-row items-start gap-4">
        <div class="bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 px-6 py-3 font-mono text-sm select-all">
          npx skills add zeke/swiss-design-skill
        </div>
        <a href="${GITHUB_URL}" target="_blank" class="px-6 py-3 border border-stone-300 dark:border-stone-700 text-stone-900/70 dark:text-stone-50/70 text-sm tracking-wide hover:border-stone-900 dark:hover:border-stone-50 transition-colors">
          View on GitHub ↗
        </a>
      </div>
    </div>

    <!-- Column of vertical labels -->
    <div class="hidden md:flex col-span-4 flex-col justify-end gap-6 pb-4">
      ${['IBM Plex Sans', 'Stone Palette', 'Opacity Hierarchy', '12-Column Grid', 'One Accent'].map((label, i) => html`
      <div class="flex items-center gap-3 border-t border-stone-200 dark:border-stone-800 pt-4">
        <span class="text-xs text-stone-900/40 dark:text-stone-50/40 font-mono">0${i + 1}</span>
        <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">${label}</span>
      </div>`)}
    </div>
  </div>
</section>`

// ─── Section 02: Editorial ───────────────────────────────────────────────────

const SectionEditorial = () => html`
<section id="editorial" class="border-b border-stone-200 dark:border-stone-800">
  <!-- Full-bleed red pull-quote bar -->
  <div class="bg-[#C8102E] px-8 py-12">
    <div class="max-w-6xl mx-auto flex items-start justify-between gap-8">
      <p class="text-3xl md:text-4xl font-normal text-white leading-snug tracking-tight max-w-2xl">
        "The will to order."
      </p>
      <span class="text-xs tracking-widest uppercase text-white/60 mt-2 shrink-0 hidden md:block">Basel School of Design</span>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-8 py-32">
    <!-- Section label -->
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">02</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Editorial</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Main essay column — flush left, no indent -->
      <div class="col-span-12 md:col-span-7">
        <h2 class="text-4xl md:text-5xl font-normal tracking-tight text-stone-900 dark:text-stone-50 leading-tight mb-10">
          The grid system is an aid, not a guarantee.
        </h2>
        <p class="text-lg leading-relaxed text-stone-900 dark:text-stone-50 max-w-[60ch] mb-6">
          It permits a number of possible uses and each designer can look for a solution appropriate to his personal style. But one must learn how to use the grid; it is an art that requires practice.
        </p>
        <p class="text-lg leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[60ch] mb-6">
          The grid system is used by the typographer, graphic designer, photographer and exhibition designer for solving visual problems in two and three dimensions. Today the grid system is the expression of a certain mental attitude inasmuch as it shows that the designer conceives his work in terms that are constructive and oriented to the future.
        </p>
        <p class="text-lg leading-relaxed text-stone-900/60 dark:text-stone-50/60 max-w-[60ch]">
          This is the expression of a professional ethos: the designer's work should have the clearly intelligible, objective, functional and aesthetic quality of mathematical thinking.
        </p>
        <div class="mt-10 pt-10 border-t border-stone-200 dark:border-stone-800">
          <span class="text-sm tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50">— Josef Müller-Brockmann, <em>Grid Systems in Graphic Design</em>, 1961</span>
        </div>
      </div>

      <!-- Right column -->
      <div class="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-6">

        <!-- Bold cobalt block: key principles -->
        <div class="bg-[#003B8E] p-6">
          <span class="text-xs tracking-widest uppercase text-white/60 block mb-5">Key principles</span>
          <ul class="space-y-3">
            ${['Objective clarity', 'Visual order', 'Grid discipline', 'Functional beauty'].map(p => html`
            <li class="text-base text-white flex items-start gap-2">
              <span class="text-white/50 mt-0.5">—</span>
              <span>${p}</span>
            </li>`)}
          </ul>
        </div>

        <!-- Two schools -->
        <div class="border border-stone-200 dark:border-stone-800">
          <div class="bg-stone-900 dark:bg-stone-800 px-6 py-4">
            <span class="text-xs tracking-widest uppercase text-stone-50/60">Two schools</span>
          </div>
          <div class="divide-y divide-stone-200 dark:divide-stone-800">
            <div class="p-6">
              <p class="text-sm font-medium text-stone-900 dark:text-stone-50 mb-2">Zürich</p>
              <p class="text-sm text-stone-900/60 dark:text-stone-50/60 leading-relaxed">Müller-Brockmann, Lohse, Neuburg, Vivarelli. Mathematical grid, Helvetica, <em>Neue Grafik</em> journal (1958–65).</p>
            </div>
            <div class="p-6">
              <p class="text-sm font-medium text-stone-900 dark:text-stone-50 mb-2">Basel</p>
              <p class="text-sm text-stone-900/60 dark:text-stone-50/60 leading-relaxed">Armin Hofmann, Emil Ruder. Tonal contrast, Univers typeface, photography as primary element.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

// ─── Section 03: Poster ──────────────────────────────────────────────────────

const SectionPoster = () => html`
<section id="poster" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">03</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Poster</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Dark full-bleed poster -->
      <div class="col-span-12 md:col-span-7 bg-stone-950 dark:bg-stone-900 p-12 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
        <!-- Geometric background elements -->
        <div class="absolute bottom-0 right-0 w-64 h-64 border border-stone-700 translate-x-16 translate-y-16"></div>
        <div class="absolute bottom-8 right-8 w-64 h-64 border border-stone-700"></div>

        <div>
          <div class="flex items-center gap-3 mb-12">
            <div class="w-6 h-px bg-[#003B8E]"></div>
            <span class="text-xs tracking-widest uppercase text-stone-50/60">Kunsthaus Zürich</span>
          </div>
          <p class="text-xs tracking-widest uppercase text-stone-50/50 mb-4">15. März — 30. April 1962</p>
          <h2 class="text-5xl md:text-7xl font-normal tracking-tight text-stone-50 leading-none">
            Form<br>und<br>Farbe
          </h2>
        </div>

        <div class="relative z-10">
          <div class="w-full h-px bg-stone-700 mb-6"></div>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-sm text-stone-50/70 leading-relaxed max-w-[28ch]">
                Eine Ausstellung über die Beziehung zwischen Form, Farbe und Raum in der modernen Kunst.
              </p>
            </div>
            <div class="text-right">
              <div class="w-8 h-8 bg-[#003B8E] mb-2"></div>
              <span class="text-xs tracking-widest uppercase text-stone-50/40">Eintritt frei</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Light poster -->
      <div class="col-span-12 md:col-span-5 bg-stone-100 dark:bg-stone-900 p-10 relative overflow-hidden min-h-[480px] flex flex-col justify-between border border-stone-200 dark:border-stone-800">
        <div class="absolute top-0 left-0 w-full h-1 bg-[#C8102E]"></div>

        <div>
          <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">International Typography</span>
          <h2 class="text-4xl md:text-5xl font-normal tracking-tight text-stone-900 dark:text-stone-50 leading-tight mt-6">
            Neue<br>Typographie
          </h2>
          <p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 mt-6 max-w-[32ch]">
            A symposium on the principles of modern Swiss typography and the mathematical grid.
          </p>
        </div>

        <div>
          <div class="grid grid-cols-2 gap-4 mb-8">
            ${[['Date', 'April 12, 1962'], ['Venue', 'Kunstgewerbeschule Zürich'], ['Time', '14:00–18:00'], ['Entry', 'Free']].map(([label, value]) => html`
            <div>
              <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 block mb-1">${label}</span>
              <span class="text-sm text-stone-900 dark:text-stone-50">${value}</span>
            </div>`)}
          </div>
          <button class="w-full py-3 bg-[#C8102E] text-white text-xs tracking-widest uppercase hover:bg-[#C8102E]/90 transition-colors">
            Register Now
          </button>
        </div>
      </div>
    </div>
  </div>
</section>`

// ─── Section 04: Data / Table ────────────────────────────────────────────────

const SectionData = () => html`
<section id="data" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">04</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Data</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 md:col-span-8">
        <h2 class="text-3xl md:text-4xl font-normal tracking-tight text-stone-900 dark:text-stone-50 mb-3">Font Specimen</h2>
        <p class="text-base text-stone-900/60 dark:text-stone-50/60 mb-12 max-w-[52ch]">Grotesque typefaces in the Swiss tradition, ranked by fidelity to the International Style.</p>

        <table class="w-full text-sm">
          <thead>
            <tr class="border-t-2 border-stone-900 dark:border-stone-50 border-b border-b-stone-200 dark:border-b-stone-800">
              <th class="text-left text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium py-3 pr-6 pl-4">Typeface</th>
              <th class="text-left text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium py-3 pr-6">Designer</th>
              <th class="text-left text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium py-3 pr-6">Year</th>
              <th class="text-left text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium py-3 pr-6">Source</th>
              <th class="text-right text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium py-3 pr-4">Fidelity</th>
            </tr>
          </thead>
          <tbody>
            ${[
              // Neue Haas Grotesk: Miedinger designed letterforms, Hoffmann (Haas) directed/commissioned — both credited
              ['IBM Plex Sans',      'Mike Abbink / Bold Monday', '2017', 'Google Fonts', '96', true],
              ['Hanken Grotesk',     'Hanken Design Co.',         '2021', 'Google Fonts', '92', false],
              ['Barlow',             'Jeremy Tribby',             '2017', 'Google Fonts', '88', false],
              ['Host Grotesk',       'Fraunhofer IAIS',           '2018', 'Google Fonts', '84', false],
              ['DM Sans',            'Colophon Foundry',          '2019', 'Google Fonts', '79', false],
              // Neue Haas Grotesk: launched 1957 as "Neue Haas Grotesk", renamed Helvetica 1960
              ['Neue Haas Grotesk',  'Miedinger & Hoffmann',      '1957', 'Linotype',     '100', false],
              // Univers: Frutiger, also 1957 — favored by Basel school
              ['Univers',            'Adrian Frutiger',           '1957', 'Linotype',     '98', false],
            ].map(([name, designer, year, source, score, featured]) => html`
            <tr class="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors ${featured ? 'bg-[#C8102E]/5' : ''}">
              <td class="py-4 pr-6 pl-4">
                <span class="text-stone-900 dark:text-stone-50 font-normal">${name}</span>
                ${featured ? html`<span class="ml-2 text-xs tracking-widest uppercase bg-[#C8102E]/10 text-[#C8102E] px-1.5 py-0.5">Primary</span>` : ''}
              </td>
              <td class="py-4 pr-6 text-stone-900/70 dark:text-stone-50/70">${designer}</td>
              <td class="py-4 pr-6 text-stone-900/70 dark:text-stone-50/70 font-mono text-sm">${year}</td>
              <td class="py-4 pr-6 text-stone-900/60 dark:text-stone-50/60 text-sm tracking-wide">${source}</td>
              <td class="py-4 pr-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-16 h-0.5 bg-stone-200 dark:bg-stone-800 relative">
                    <div class="absolute left-0 top-0 h-full bg-[#C8102E]" style="width: ${score}%"></div>
                  </div>
                  <span class="text-sm font-mono text-stone-900/60 dark:text-stone-50/60 w-6">${score}</span>
                </div>
              </td>
            </tr>`)}
          </tbody>
        </table>

        <p class="text-sm text-stone-900/50 dark:text-stone-50/50 mt-6 leading-relaxed max-w-[60ch]">
          Neue Haas Grotesk (1957) was the original name for what became Helvetica in 1960, when it was renamed for international distribution by Haas and D. Stempel AG. Univers, released the same year by Adrian Frutiger, was favored by the Basel school while the Zürich school championed Helvetica.
        </p>
      </div>

      <!-- Side accent blocks -->
      <div class="col-span-12 md:col-span-4 flex flex-col gap-4">
        ${ACCENTS.slice(0, 4).map(({ hex, name, desc }) => html`
        <div class="border border-stone-200 dark:border-stone-800 p-5 flex items-start gap-4">
          <div class="w-8 h-8 shrink-0 mt-0.5" style="background-color: ${hex}"></div>
          <div>
            <p class="text-sm font-medium text-stone-900 dark:text-stone-50">${name}</p>
            <p class="text-xs text-stone-900/50 dark:text-stone-50/50 font-mono mt-0.5">${hex}</p>
            <p class="text-sm text-stone-900/60 dark:text-stone-50/60 mt-2 leading-relaxed">${desc}</p>
          </div>
        </div>`)}
      </div>
    </div>
  </div>
</section>`

// ─── Section 05: Cards Grid ──────────────────────────────────────────────────

const SectionCards = () => html`
<section id="cards" class="border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">05</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Cards</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="mb-12">
      <h2 class="text-3xl md:text-4xl font-normal tracking-tight text-stone-900 dark:text-stone-50">Objects of Swiss Design</h2>
      <p class="text-base text-stone-900/60 dark:text-stone-50/60 mt-3 max-w-[48ch]">Six artefacts that defined the modernist era in Swiss design.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800">
      ${[
        {
          accent: '#C8102E', label: 'Chair', year: '1938',
          name: 'Landi Chair',
          desc: 'Hans Coray\u2019s aluminium Landi chair, designed for the 1939 Swiss National Exhibition. A landmark of Swiss industrial design.',
          tag: 'Furniture',
          href: 'https://en.wikipedia.org/wiki/Hans_Coray'
        },
        {
          accent: '#003B8E', label: 'Poster', year: '1953',
          name: 'Musica Viva',
          desc: 'Josef M\u00fcller-Brockmann\u2019s concert posters for Tonhalle Z\u00fcrich. Geometric forms used to express musical rhythm and structure.',
          tag: 'Print',
          href: 'https://www.stedelijk.nl/en/collection/57037-josef-muller-brockmann-volkskonzert-der-tonhalle-gesellschaft-zurich-musica-viva'
        },
        {
          accent: '#F0B429', label: 'Clock', year: '1944',
          name: 'SBB Railway Clock',
          desc: 'Hans Hilfiker\u2019s station clock for Swiss Federal Railways. The iconic red sweep second hand was finalised in 1955.',
          tag: 'Industrial',
          href: 'https://www.eguide.ch/en/objekt/sbb-bahnhofsuhr/'
        },
        {
          accent: '#2D6A4F', label: 'Type', year: '1957',
          name: 'Neue Haas Grotesk',
          desc: 'Max Miedinger and Eduard Hoffmann\u2019s neutral grotesque, designed at the Haas Type Foundry in M\u00fcnchenbuchsee. Renamed Helvetica in 1960.',
          tag: 'Typography',
          href: 'https://en.wikipedia.org/wiki/Max_Miedinger'
        },
        {
          accent: '#C8102E', label: 'Journal', year: '1958',
          name: 'Neue Grafik',
          desc: 'Trilingual journal edited by Lohse, M\u00fcller-Brockmann, Neuburg, and Vivarelli. Published 18 issues from 1958 to 1965.',
          tag: 'Publication',
          href: 'https://designreviewed.com/series/neue-grafik-new-graphic-design-graphisme-actuel/'
        },
        {
          accent: '#003B8E', label: 'Book', year: '1961',
          name: 'Raster Systeme',
          desc: 'M\u00fcller-Brockmann\u2019s definitive guide to the typographic grid system. Published in German, English, and French. Still in print.',
          tag: 'Reference',
          href: 'https://archive.org/details/gridsystemsingra0000muml'
        },
      ].map(({ accent, label, year, name, desc, tag, href }) => html`
      <a href="${href}" target="_blank" rel="noopener" class="bg-stone-50 dark:bg-stone-950 p-8 flex flex-col gap-6 hover:bg-white dark:hover:bg-stone-900 transition-colors group">
        <div class="flex items-start justify-between">
          <div class="w-10 h-10" style="background-color: ${accent};"></div>
          <span class="text-sm font-mono text-stone-900/50 dark:text-stone-50/50">${year}</span>
        </div>
        <div>
          <div class="w-6 h-px mb-4" style="background-color: ${accent}"></div>
          <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 block mb-2">${label}</span>
          <h3 class="text-xl font-normal text-stone-900 dark:text-stone-50 leading-snug group-hover:text-[${accent}] transition-colors">${name}</h3>
          <p class="text-sm text-stone-900/60 dark:text-stone-50/60 leading-relaxed mt-3 max-w-[32ch]">${desc}</p>
        </div>
        <div class="mt-auto pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span class="text-xs tracking-widest uppercase px-2 py-1" style="background-color: ${accent}20; color: ${accent}">${tag}</span>
          <span class="text-stone-900/40 dark:text-stone-50/40 text-sm group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors">↗</span>
        </div>
      </a>`)}
    </div>
  </div>
</section>`

// ─── Section 06: App Chrome ───────────────────────────────────────────────────

const SectionApp = () => html`
<section id="app" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">06</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">App</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <!-- App shell -->
    <div class="border border-stone-200 dark:border-stone-800 overflow-hidden">
      <!-- App top bar -->
      <div class="border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="text-sm font-medium tracking-widest uppercase text-stone-900 dark:text-stone-50">Archiv</span>
          <span class="text-sm text-stone-900/50 dark:text-stone-50/50">Design Collection</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700"></span>
          <span class="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-700"></span>
          <span class="w-2 h-2 rounded-full bg-[#C8102E]"></span>
        </div>
      </div>

      <div class="flex">
        <!-- Sidebar -->
        <div class="w-48 border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-6 min-h-72 shrink-0">
          <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 block mb-4">Collections</span>
          <ul class="space-y-0.5">
            ${[
              { label: 'All items', count: '128', active: false },
              { label: 'Typography', count: '34', active: true },
              { label: 'Architecture', count: '22', active: false },
              { label: 'Industrial', count: '41', active: false },
              { label: 'Print', count: '31', active: false },
            ].map(({ label, count, active }) => html`
            <li>
              <a href="#" class="flex items-center justify-between py-2 px-2 text-sm ${active ? 'text-[#C8102E] bg-[#C8102E]/5' : 'text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-900'} transition-colors">
                <span>${label}</span>
                <span class="font-mono text-xs ${active ? 'text-[#C8102E]/70' : 'text-stone-900/40 dark:text-stone-50/40'}">${count}</span>
              </a>
            </li>`)}
          </ul>
        </div>

        <!-- Main content -->
        <div class="flex-1 p-8">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-stone-900/50 dark:text-stone-50/50 mb-6">
            <span>Collection</span>
            <span>/</span>
            <span class="text-stone-900 dark:text-stone-50">Typography</span>
          </div>

          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="text-2xl font-normal text-stone-900 dark:text-stone-50">Typography</h3>
              <p class="text-sm text-stone-900/60 dark:text-stone-50/60 mt-1">34 items in collection</p>
            </div>
            <button class="px-4 py-2 bg-[#C8102E] text-white text-xs tracking-widest uppercase hover:bg-[#C8102E]/90 transition-colors">
              Add item
            </button>
          </div>

          <!-- Item list -->
          <div class="space-y-0">
            ${[
              // Helvetica released 1957 as Neue Haas Grotesk, renamed 1960
              { name: 'Helvetica',         year: '1957/1960', designer: 'Miedinger & Hoffmann' },
              // Univers 1957 — Frutiger ✓
              { name: 'Univers',           year: '1957',      designer: 'Adrian Frutiger' },
              // Akzidenz-Grotesk 1896 — Berthold ✓ (preceded Swiss Style, influenced it)
              { name: 'Akzidenz-Grotesk',  year: '1896',      designer: 'H. Berthold AG' },
              // Folio 1957 — Bauer & Baum (not just Bauer)
              { name: 'Folio',             year: '1957',      designer: 'Bauer & Baum' },
            ].map(({ name, year, designer }) => html`
            <div class="border-t border-stone-200 dark:border-stone-800 py-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-900/50 px-2 -mx-2 transition-colors cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-6 h-6 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                  <span class="text-[9px] font-mono text-stone-900/50 dark:text-stone-50/50">Aa</span>
                </div>
                <span class="text-base text-stone-900 dark:text-stone-50">${name}</span>
              </div>
              <div class="flex items-center gap-8">
                <span class="text-sm text-stone-900/60 dark:text-stone-50/60">${designer}</span>
                <span class="text-sm font-mono text-stone-900/50 dark:text-stone-50/50">${year}</span>
              </div>
            </div>`)}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

// ─── Section 07: Typography Specimen ─────────────────────────────────────────

const SectionType = () => html`
<section id="type" class="border-b border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-stone-50">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-50/40">07</span>
      <span class="text-xs tracking-widest uppercase text-stone-50/60">Type</span>
      <div class="flex-1 h-px bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 md:col-span-8 space-y-16">
        <!-- Display -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">Display — 80px normal tracking-tight leading-none</span>
          <p class="text-8xl font-normal tracking-tight leading-none">Form Folgt</p>
        </div>
        <!-- H1 -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">H1 — 60px normal tracking-tight leading-tight</span>
          <p class="text-6xl font-normal tracking-tight leading-tight">Grid Systems in<br>Graphic Design</p>
        </div>
        <!-- H2 -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">H2 — 48px normal tracking-tight leading-snug</span>
          <p class="text-5xl font-normal tracking-tight leading-snug">The Typographic Grid</p>
        </div>
        <!-- H3 -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">H3 — 30px medium leading-snug</span>
          <p class="text-3xl font-medium leading-snug">Alignment and Proportion</p>
        </div>
        <!-- Body -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">Body — 18px normal leading-relaxed max-w-[60ch]</span>
          <p class="text-lg font-normal leading-relaxed max-w-[60ch]">The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style. But one must learn how to use the grid; it is an art that requires practice.</p>
        </div>
        <!-- Small -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">Small — 15px normal leading-relaxed</span>
          <p class="text-[15px] font-normal leading-relaxed text-stone-50/70 max-w-[60ch]">Supporting text at reduced opacity. Used for descriptions, metadata, and secondary content that accompanies primary body copy.</p>
        </div>
        <!-- Caption -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">Caption — 12px tracking-widest uppercase</span>
          <p class="text-xs tracking-widest uppercase text-stone-50/50">Figure 03 — Basel, Switzerland, 1961 — Offset Lithography</p>
        </div>
        <!-- Mono -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-xs font-mono text-stone-50/40 block mb-6">Mono — IBM Plex Mono 15px</span>
          <p class="font-mono text-[15px] text-stone-50/80">npx skills add zeke/swiss-design-skill</p>
        </div>
      </div>

      <!-- Right: weight / opacity ladder -->
      <div class="col-span-12 md:col-span-4">
        <div class="sticky top-24 space-y-8">
          <div>
            <span class="text-xs font-mono text-stone-50/40 block mb-6 border-t border-stone-800 pt-8">Weight ladder</span>
            ${[['Light 300', 'font-light'], ['Normal 400', 'font-normal'], ['Medium 500', 'font-medium'], ['Semi 600', 'font-semibold']].map(([label, cls]) => html`
            <div class="mb-5">
              <span class="text-xs text-stone-50/40 block mb-1">${label}</span>
              <p class="text-3xl ${cls} text-stone-50">Grotesque</p>
            </div>`)}
          </div>
          <div>
            <span class="text-xs font-mono text-stone-50/40 block mb-6 border-t border-stone-800 pt-8">Opacity ladder</span>
            ${[['100%', 'text-stone-50'], ['70%', 'text-stone-50/70'], ['50%', 'text-stone-50/50'], ['30%', 'text-stone-50/30']].map(([pct, cls]) => html`
            <div class="mb-4 flex items-baseline gap-3">
              <span class="text-xs font-mono text-stone-50/30 w-8">${pct}</span>
              <p class="text-base ${cls}">Primary text at ${pct}</p>
            </div>`)}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

// ─── Section 08: Color & Opacity ─────────────────────────────────────────────

const SectionColor = () => html`
<section id="color" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">08</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Color</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <!-- Stone scale -->
    <div class="mb-20">
      <h3 class="text-sm tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 mb-8">Stone scale</h3>
      <div class="grid grid-cols-5 md:grid-cols-11 gap-px bg-stone-200 dark:bg-stone-800">
        ${[
          ['50', '#fafaf9'],
          ['100', '#f5f5f4'],
          ['200', '#e7e5e4'],
          ['300', '#d6d3d1'],
          ['400', '#a8a29e'],
          ['500', '#78716c'],
          ['600', '#57534e'],
          ['700', '#44403c'],
          ['800', '#292524'],
          ['900', '#1c1917'],
          ['950', '#0c0a09'],
        ].map(([scale, hex]) => html`
        <div class="aspect-square flex flex-col justify-end p-2" style="background-color: ${hex}">
          <span class="text-[10px] font-mono" style="color: ${parseInt(scale) < 500 ? '#1c1917' : '#fafaf9'}; opacity: 0.6">${scale}</span>
        </div>`)}
      </div>
    </div>

    <!-- All 8 accent colors + opacity -->
    <div class="mb-20">
      <h3 class="text-sm tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 mb-8">Accent palette × opacity</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        ${ACCENTS.map(({ name, hex, label }) => html`
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-stone-900 dark:text-stone-50">${name}</span>
            <span class="text-xs text-stone-900/50 dark:text-stone-50/50 tracking-widest uppercase">${label}</span>
          </div>
          <div class="space-y-1">
            ${[['100%', 1], ['60%', 0.6], ['20%', 0.2], ['10%', 0.1]].map(([pct, opacity]) => html`
            <div class="h-10 flex items-center px-3 relative overflow-hidden">
              <div class="absolute inset-0" style="background-color: ${hex}; opacity: ${opacity};"></div>
              <span class="relative text-xs font-mono" style="color: ${opacity >= 0.4 ? 'white' : hex}">${pct}</span>
            </div>`)}
          </div>
          <code class="text-xs font-mono text-stone-900/50 dark:text-stone-50/50 mt-2 block">${hex}</code>
        </div>`)}
      </div>
    </div>

    <!-- Opacity rule callout -->
    <div class="bg-stone-900 p-8 border-l-2 border-[#C8102E]">
      <h3 class="text-lg font-normal text-stone-50 mb-3">The opacity rule</h3>
      <p class="text-base leading-relaxed text-stone-50/70 max-w-[60ch]">
        To make text less dominant, reduce opacity — never change the hue. <code class="font-mono text-[#C8102E]">text-stone-900/70</code> is secondary text. <code class="font-mono text-[#C8102E]">text-stone-900/50</code> is tertiary. Never use mid-scale stone values (stone-400–700) for text hierarchy.
      </p>
    </div>
  </div>
</section>`

// ─── Section 09: Form ────────────────────────────────────────────────────────

const SectionForm = () => html`
<section id="form" class="border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">09</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Form</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 md:col-span-5">
        <div class="w-6 h-px bg-[#F0B429] mb-8"></div>
        <h2 class="text-3xl md:text-4xl font-normal tracking-tight text-stone-900 dark:text-stone-50 mb-4">
          Symposium<br>Registration
        </h2>
        <p class="text-base leading-relaxed text-stone-900/60 dark:text-stone-50/60 max-w-[36ch]">
          International Typographic Symposium. Zürich, 12–14 April 1962. Capacity limited to 120 participants.
        </p>
        <div class="mt-12 space-y-4">
          ${[
            ['Venue',    'Kunstgewerbeschule Zürich'],
            ['Language', 'German, French, English'],
            ['Fee',      'CHF 45 / Students CHF 20'],
            ['Deadline', '1 March 1962']
          ].map(([k, v]) => html`
          <div class="flex gap-4 border-t border-stone-200 dark:border-stone-800 pt-4">
            <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 w-20 shrink-0 pt-0.5">${k}</span>
            <span class="text-sm text-stone-900/80 dark:text-stone-50/80">${v}</span>
          </div>`)}
        </div>
      </div>

      <div class="col-span-12 md:col-span-6 md:col-start-7">
        <form class="space-y-6 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-8" onsubmit="return false">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">First name</label>
              <input type="text" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="Josef">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">Last name</label>
              <input type="text" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="Müller-Brockmann">
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">Email address</label>
            <input type="email" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="jmb@schule.ch">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">Institution</label>
            <input type="text" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="Kunstgewerbeschule Zürich">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">Attendance</label>
            <select class="border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 appearance-none">
              <option>Full symposium (3 days)</option>
              <option>Day 1 only</option>
              <option>Day 2 only</option>
              <option>Day 3 only</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">Message (optional)</label>
            <textarea rows="3" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 resize-none transition-colors placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30" placeholder="Dietary requirements, accessibility needs, etc."></textarea>
          </div>
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" class="mt-0.5 w-4 h-4 border border-stone-400 dark:border-stone-600 accent-[#F0B429]">
            <span class="text-sm text-stone-900/60 dark:text-stone-50/60 leading-relaxed">I agree to the symposium code of conduct and confirm that my registration fee will be paid by the deadline.</span>
          </label>
          <button type="submit" class="w-full py-4 bg-[#F0B429] text-stone-900 text-xs tracking-widest uppercase font-medium hover:bg-[#F0B429]/90 transition-colors">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  </div>
</section>`

// ─── Section 10: Responsive ──────────────────────────────────────────────────

const SectionResponsive = () => html`
<section id="responsive" class="border-b border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-stone-50">
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24 lg:py-32">
    <div class="flex items-center gap-4 mb-16 md:mb-20">
      <span class="text-xs font-mono text-stone-50/40">10</span>
      <span class="text-xs tracking-widest uppercase text-stone-50/60">Responsive</span>
      <div class="flex-1 h-px bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24">
      <div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight leading-tight text-stone-50 mb-6">
          Mobile first.<br>Always.
        </h2>
        <p class="text-lg leading-relaxed text-stone-50/70 max-w-[52ch]">
          The Swiss grid adapts from 320px to 1440px. Default classes target mobile. Breakpoint prefixes layer in structure as the viewport widens. Never build desktop-first and retrofit mobile.
        </p>
      </div>
      <div class="space-y-4">
        ${[
          { bp: 'none', width: '0px+',   label: 'Mobile',  desc: 'Single column. px-4. py-16. Stacked layouts.' },
          { bp: 'sm:', width: '640px+',  label: 'Large phone', desc: 'Wider gutters. 2-col grids begin to emerge.' },
          { bp: 'md:', width: '768px+',  label: 'Tablet',  desc: 'Multi-column. px-8. py-24. Nav links visible.' },
          { bp: 'lg:', width: '1024px+', label: 'Desktop', desc: 'Full 12-col grid. max-w-6xl. py-32.' },
        ].map(({ bp, width, label, desc }) => html`
        <div class="flex items-start gap-4 border-t border-stone-800 pt-4">
          <div class="shrink-0 w-12">
            <code class="font-mono text-xs text-[#C8102E]">${bp || '—'}</code>
          </div>
          <div class="shrink-0 w-16">
            <span class="font-mono text-xs text-stone-50/40">${width}</span>
          </div>
          <div>
            <span class="text-sm font-medium text-stone-50 block">${label}</span>
            <span class="text-sm text-stone-50/60">${desc}</span>
          </div>
        </div>`)}
      </div>
    </div>

    <!-- Code examples -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-px bg-stone-800">
      <div class="bg-stone-900 dark:bg-stone-950 p-6 md:p-8">
        <span class="text-xs tracking-widest uppercase text-stone-50/40 block mb-4">Responsive grid</span>
        <pre class="font-mono text-sm text-stone-50/80 leading-relaxed overflow-x-auto"><code>&lt;div class="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4 md:gap-8
"&gt;</code></pre>
      </div>
      <div class="bg-stone-900 dark:bg-stone-950 p-6 md:p-8">
        <span class="text-xs tracking-widest uppercase text-stone-50/40 block mb-4">Fluid type</span>
        <pre class="font-mono text-sm text-stone-50/80 leading-relaxed overflow-x-auto"><code>&lt;h1 class="
  text-4xl
  md:text-6xl
  lg:text-7xl
  font-normal
  tracking-tight
"&gt;</code></pre>
      </div>
      <div class="bg-stone-900 dark:bg-stone-950 p-6 md:p-8">
        <span class="text-xs tracking-widest uppercase text-stone-50/40 block mb-4">Section wrapper</span>
        <pre class="font-mono text-sm text-stone-50/80 leading-relaxed overflow-x-auto"><code>&lt;section class="
  py-16 md:py-24 lg:py-32
  border-b border-stone-200
  dark:border-stone-800
"&gt;
  &lt;div class="
    max-w-6xl mx-auto
    px-4 md:px-8
  "&gt;</code></pre>
      </div>
      <div class="bg-stone-900 dark:bg-stone-950 p-6 md:p-8">
        <span class="text-xs tracking-widest uppercase text-stone-50/40 block mb-4">Mobile nav</span>
        <pre class="font-mono text-sm text-stone-50/80 leading-relaxed overflow-x-auto"><code>&lt;!-- Show only on md+ --&gt;
&lt;div class="hidden md:flex
  items-center gap-6"&gt;
  &lt;a href="#"&gt;Link&lt;/a&gt;
&lt;/div&gt;

&lt;!-- Touch target: min 44px --&gt;
&lt;button class="min-h-[44px]
  px-6"&gt;</code></pre>
      </div>
    </div>

    <!-- Gotchas row -->
    <div class="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-800">
      ${[
        { rule: 'Always col-span-12 on mobile', bad: 'grid-cols-3', good: 'grid-cols-1 md:grid-cols-3' },
        { rule: 'Wrap wide tables', bad: '<table>', good: '<div class="overflow-x-auto">' },
        { rule: '44px touch targets', bad: 'py-1 px-2', good: 'min-h-[44px] px-4' },
        { rule: 'Reduce padding at sm', bad: 'px-8 py-24', good: 'px-4 md:px-8 py-16 md:py-24' },
      ].map(({ rule, bad, good }) => html`
      <div class="bg-stone-900 dark:bg-stone-950 p-6">
        <p class="text-sm font-medium text-stone-50 mb-4 leading-snug">${rule}</p>
        <div class="space-y-2">
          <div class="flex items-start gap-2">
            <span class="text-stone-50/30 text-xs mt-0.5 shrink-0">✗</span>
            <code class="font-mono text-xs text-stone-50/40 leading-relaxed">${bad}</code>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-[#C8102E] text-xs mt-0.5 shrink-0">✓</span>
            <code class="font-mono text-xs text-stone-50/70 leading-relaxed">${good}</code>
          </div>
        </div>
      </div>`)}
    </div>
  </div>
</section>`

// ─── Section 11: Install ─────────────────────────────────────────────────────

const SectionInstall = () => html`
<section id="install" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40">11</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60">Install</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8 items-start">
      <div class="col-span-12 md:col-span-6">
        <div class="w-6 h-px bg-[#C8102E] mb-8"></div>
        <h2 class="text-4xl md:text-5xl font-normal tracking-tight text-stone-900 dark:text-stone-50 mb-6">
          One command.<br>Every project.
        </h2>
        <p class="text-lg leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[48ch] mb-12">
          Install the skill and your AI agent will apply Swiss design principles whenever you ask it to style a page, clean up a UI, or make something look great.
        </p>

        <div class="space-y-4">
          <div>
            <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 block mb-3">Install with skills CLI</span>
            <div class="bg-stone-900 dark:bg-stone-950 text-stone-50 px-5 py-4 font-mono text-sm flex items-center justify-between gap-4 border border-stone-800">
              <span class="select-all">npx skills add zeke/swiss-design-skill</span>
              <span class="text-stone-50/40 shrink-0 text-xs">copy</span>
            </div>
          </div>
          <div>
            <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 block mb-3">Or install manually</span>
            <div class="bg-stone-100 dark:bg-stone-900 px-5 py-4 font-mono text-sm text-stone-900/70 dark:text-stone-50/70 border border-stone-200 dark:border-stone-800 space-y-1">
              <div><span class="text-stone-900/40 dark:text-stone-50/40">$</span> gh repo clone zeke/swiss-design-skill</div>
              <div><span class="text-stone-900/40 dark:text-stone-50/40">$</span> cp -r swiss-design-skill/swiss-design ~/.config/opencode/skills/</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-5 md:col-start-8 space-y-6">
        <div class="border border-stone-200 dark:border-stone-800 p-6">
          <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 block mb-4">Works with</span>
          <div class="grid grid-cols-2 gap-3">
            ${['OpenCode', 'Claude Code', 'GitHub Copilot', 'Cursor', 'Windsurf', 'Cline', 'Codex', 'Gemini CLI'].map(agent => html`
            <div class="text-sm text-stone-900/70 dark:text-stone-50/70 flex items-center gap-2">
              <div class="w-1 h-1 bg-[#C8102E]"></div>
              ${agent}
            </div>`)}
          </div>
        </div>

        <div class="border border-stone-200 dark:border-stone-800 p-6">
          <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 block mb-4">What the skill teaches</span>
          <ul class="space-y-3">
            ${[
              'IBM Plex Sans typography system',
              'Stone color palette + opacity hierarchy',
              'Eight accent colors at multiple opacities',
              '12-column grid with 8px base unit',
              'Generous whitespace rules',
              'Light/dark mode via system preference',
              'Tailwind component patterns',
            ].map(item => html`
            <li class="text-sm text-stone-900/70 dark:text-stone-50/70 flex items-start gap-2">
              <span class="text-[#C8102E] mt-0.5 shrink-0">—</span>
              ${item}
            </li>`)}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => html`
<footer class="border-t border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
    <div>
      <span class="text-sm tracking-widest uppercase font-medium text-stone-900 dark:text-stone-50">Swiss Design System</span>
      <p class="text-sm text-stone-900/50 dark:text-stone-50/50 mt-2">
        IBM Plex Sans · Stone palette · Tailwind CSS
      </p>
    </div>
    <div class="flex items-center gap-8">
      <a href="${GITHUB_URL}" target="_blank" class="text-sm tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        GitHub ↗
      </a>
      <a href="https://skills.sh/zeke/swiss-design-skill" target="_blank" class="text-sm tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        skills.sh ↗
      </a>
      <a href="https://fonts.google.com/specimen/IBM+Plex+Sans" target="_blank" class="text-sm tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        IBM Plex Sans ↗
      </a>
      <span class="text-sm text-stone-900/30 dark:text-stone-50/30">MIT</span>
    </div>
  </div>
</footer>`

// ─── Route ────────────────────────────────────────────────────────────────────

app.get('*', (c) => {
  return c.html(
    HEAD +
    Nav() +
    `<main class="pt-14">` +
    SectionHero() +
    SectionEditorial() +
    SectionPoster() +
    SectionData() +
    SectionCards() +
    SectionApp() +
    SectionType() +
    SectionColor() +
    SectionForm() +
    SectionResponsive() +
    SectionInstall() +
    `</main>` +
    Footer() +
    FOOT
  )
})

export default app
