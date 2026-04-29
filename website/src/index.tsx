import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

const GITHUB_URL = 'https://github.com/zeke/swiss-design-skill'

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
        },
      },
    }
  </script>
  <style>
    body { -webkit-font-smoothing: antialiased; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    html { scroll-behavior: smooth; }
  </style>
  <script>
    // Respect system preference, allow manual toggle
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
    function toggleDark() {
      const html = document.documentElement;
      html.classList.toggle('dark');
      localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    }
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
      <a href="#editorial" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Editorial</a>
      <a href="#poster" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Poster</a>
      <a href="#data" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Data</a>
      <a href="#cards" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Cards</a>
      <a href="#app" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">App</a>
      <a href="#type" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Type</a>
      <a href="#color" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Color</a>
      <a href="#form" class="text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Form</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="${GITHUB_URL}" target="_blank" class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        GitHub
      </a>
      <button onclick="toggleDark()" class="w-8 h-8 flex items-center justify-center border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors" aria-label="Toggle dark mode">
        <span class="dark:hidden text-xs">○</span>
        <span class="hidden dark:inline text-xs">●</span>
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
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Swiss Design System</span>
      <div class="w-8 h-px bg-[#C8102E] mt-6 mb-10"></div>
      <h1 class="text-5xl md:text-7xl font-light tracking-tight leading-none text-stone-900 dark:text-stone-50">
        Grid. Type.<br>Whitespace.
      </h1>
      <p class="text-lg leading-relaxed text-stone-900/60 dark:text-stone-50/60 mt-8 max-w-[52ch]">
        A design system rooted in the Swiss International Style of the 1950s–60s. Bold grotesque typography, rigorous grid, generous whitespace, and restrained color — expressed through Tailwind CSS.
      </p>
      <div class="mt-12 flex flex-col sm:flex-row items-start gap-4">
        <div class="bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 px-6 py-3 font-mono text-sm select-all">
          npx skills add zeke/swiss-design-skill
        </div>
        <a href="${GITHUB_URL}" target="_blank" class="px-6 py-3 border border-stone-200 dark:border-stone-800 text-stone-900/60 dark:text-stone-50/60 text-sm tracking-wide hover:border-stone-900 dark:hover:border-stone-50 transition-colors">
          View on GitHub ↗
        </a>
      </div>
    </div>

    <!-- Column of vertical labels -->
    <div class="hidden md:flex col-span-4 flex-col justify-end gap-6 pb-4">
      ${['IBM Plex Sans', 'Stone Palette', 'Opacity Hierarchy', '12-Column Grid', 'One Accent'].map((label, i) => html`
      <div class="flex items-center gap-3 border-t border-stone-200 dark:border-stone-800 pt-4">
        <span class="text-[10px] text-stone-900/30 dark:text-stone-50/30 font-mono">0${i + 1}</span>
        <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50">${label}</span>
      </div>`)}
    </div>
  </div>
</section>`

// ─── Section 02: Editorial ───────────────────────────────────────────────────

const SectionEditorial = () => html`
<section id="editorial" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <!-- Section label -->
    <div class="flex items-center gap-4 mb-20">
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">02</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Editorial</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Rotated side label -->
      <div class="col-span-1 hidden md:flex justify-center pt-2">
        <span class="text-[10px] tracking-widest uppercase text-stone-900/20 dark:text-stone-50/20 -rotate-90 whitespace-nowrap origin-center mt-16">
          On Grid Systems
        </span>
      </div>

      <!-- Main essay column -->
      <div class="col-span-12 md:col-span-6 md:col-start-2">
        <h2 class="text-4xl font-light tracking-tight text-stone-900 dark:text-stone-50 leading-tight mb-10">
          The grid system is an aid, not a guarantee.
        </h2>
        <p class="text-base leading-relaxed text-stone-900 dark:text-stone-50 max-w-[60ch] mb-6">
          It permits a number of possible uses and each designer can look for a solution appropriate to his personal style. But one must learn how to use the grid; it is an art that requires practice.
        </p>
        <p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[60ch] mb-6">
          The grid system is used by the typographer, graphic designer, photographer and exhibition designer for solving visual problems in two and three dimensions. Today the grid system is the expression of a certain mental attitude inasmuch as it shows that the designer conceives his work in terms that are constructive and oriented to the future.
        </p>
        <p class="text-base leading-relaxed text-stone-900/50 dark:text-stone-50/50 max-w-[60ch]">
          This is the expression of a professional ethos: the designer's work should have the clearly intelligible, objective, functional and aesthetic quality of mathematical thinking.
        </p>
        <div class="mt-10 pt-10 border-t border-stone-200 dark:border-stone-800">
          <span class="text-xs tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30">— Josef Müller-Brockmann, 1961</span>
        </div>
      </div>

      <!-- Pull quote column -->
      <div class="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-12">
        <div class="border-l-2 border-[#C8102E] pl-6">
          <p class="text-2xl font-light leading-snug tracking-tight text-stone-900 dark:text-stone-50">
            "The will to order."
          </p>
          <span class="text-xs tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 mt-4 block">Basel School</span>
        </div>

        <div class="bg-stone-100 dark:bg-stone-900 p-6">
          <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 block mb-4">Key principles</span>
          <ul class="space-y-3">
            ${['Objective clarity', 'Visual order', 'Grid discipline', 'Functional beauty'].map(p => html`
            <li class="text-sm text-stone-900/70 dark:text-stone-50/70 flex items-start gap-2">
              <span class="text-[#C8102E] mt-0.5">—</span>
              <span>${p}</span>
            </li>`)}
          </ul>
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
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">03</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Poster</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Dark full-bleed poster -->
      <div class="col-span-12 md:col-span-7 bg-stone-950 dark:bg-stone-900 p-12 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
        <!-- Geometric background element -->
        <div class="absolute bottom-0 right-0 w-64 h-64 border border-stone-700 translate-x-16 translate-y-16"></div>
        <div class="absolute bottom-8 right-8 w-64 h-64 border border-stone-700"></div>

        <div>
          <div class="flex items-center gap-3 mb-12">
            <div class="w-6 h-px bg-[#003B8E]"></div>
            <span class="text-[10px] tracking-widest uppercase text-stone-50/40">Kunsthaus Zürich</span>
          </div>
          <p class="text-[10px] tracking-widest uppercase text-stone-50/40 mb-4">15. März — 30. April 1962</p>
          <h2 class="text-5xl md:text-6xl font-light tracking-tight text-stone-50 leading-none">
            Form<br>und<br>Farbe
          </h2>
        </div>

        <div class="relative z-10">
          <div class="w-full h-px bg-stone-700 mb-6"></div>
          <div class="flex items-end justify-between">
            <div>
              <p class="text-xs text-stone-50/60 leading-relaxed max-w-[28ch]">
                Eine Ausstellung über die Beziehung zwischen Form, Farbe und Raum in der modernen Kunst.
              </p>
            </div>
            <div class="text-right">
              <div class="w-8 h-8 bg-[#003B8E] mb-2"></div>
              <span class="text-[10px] tracking-widest uppercase text-stone-50/30">Eintritt frei</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Light poster -->
      <div class="col-span-12 md:col-span-5 bg-stone-100 dark:bg-stone-900 p-10 relative overflow-hidden min-h-[480px] flex flex-col justify-between border border-stone-200 dark:border-stone-800">
        <div class="absolute top-0 left-0 w-full h-1 bg-[#C8102E]"></div>

        <div>
          <span class="text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">International Typography</span>
          <h2 class="text-4xl font-light tracking-tight text-stone-900 dark:text-stone-50 leading-tight mt-6">
            Neue<br>Typographie
          </h2>
          <p class="text-sm leading-relaxed text-stone-900/60 dark:text-stone-50/60 mt-6 max-w-[32ch]">
            A symposium on the principles of modern Swiss typography and the grid system.
          </p>
        </div>

        <div>
          <div class="grid grid-cols-2 gap-4 mb-8">
            ${[['Date', 'April 12, 1962'], ['Venue', 'Basler Kunsthalle'], ['Time', '14:00–18:00'], ['Entry', 'Free']].map(([label, value]) => html`
            <div>
              <span class="text-[10px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 block mb-1">${label}</span>
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
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">04</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Data</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 md:col-span-8">
        <h2 class="text-3xl font-light tracking-tight text-stone-900 dark:text-stone-50 mb-3">Font Specimen</h2>
        <p class="text-sm text-stone-900/50 dark:text-stone-50/50 mb-12 max-w-[52ch]">Grotesque typefaces in the Swiss tradition, ranked by fidelity to the International Style.</p>

        <table class="w-full text-sm">
          <thead>
            <tr class="border-t-2 border-stone-900 dark:border-stone-50 border-b border-b-stone-200 dark:border-b-stone-800">
              <th class="text-left text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3 pr-6">Typeface</th>
              <th class="text-left text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3 pr-6">Designer</th>
              <th class="text-left text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3 pr-6">Year</th>
              <th class="text-left text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3 pr-6">Source</th>
              <th class="text-right text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3">Fidelity</th>
            </tr>
          </thead>
          <tbody>
            ${[
              ['IBM Plex Sans', 'Mike Abbink', '2017', 'Google Fonts', '96', true],
              ['Hanken Grotesk', 'Hanken Design Co.', '2021', 'Google Fonts', '92', false],
              ['Barlow', 'Jeremy Tribby', '2017', 'Google Fonts', '88', false],
              ['Host Grotesk', 'Fraunhofer IAIS', '2018', 'Google Fonts', '84', false],
              ['DM Sans', 'Colophon Foundry', '2019', 'Google Fonts', '79', false],
              ['Neue Haas Grotesk', 'Max Miedinger', '1957', 'Linotype', '100', false],
              ['Helvetica Neue', 'D. Stempel AG', '1983', 'Monotype', '99', false],
            ].map(([name, designer, year, source, score, featured]) => html`
            <tr class="border-b border-stone-100 dark:border-stone-900 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors ${featured ? 'bg-[#C8102E]/5' : ''}">
              <td class="py-4 pr-6">
                <span class="text-stone-900 dark:text-stone-50 font-normal">${name}</span>
                ${featured ? html`<span class="ml-2 text-[10px] tracking-widest uppercase bg-[#C8102E]/10 text-[#C8102E] px-1.5 py-0.5">Primary</span>` : ''}
              </td>
              <td class="py-4 pr-6 text-stone-900/60 dark:text-stone-50/60">${designer}</td>
              <td class="py-4 pr-6 text-stone-900/60 dark:text-stone-50/60 font-mono text-xs">${year}</td>
              <td class="py-4 pr-6 text-stone-900/40 dark:text-stone-50/40 text-xs tracking-wide">${source}</td>
              <td class="py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="w-16 h-0.5 bg-stone-200 dark:bg-stone-800 relative">
                    <div class="absolute left-0 top-0 h-full bg-[#C8102E]" style="width: ${score}%"></div>
                  </div>
                  <span class="text-xs font-mono text-stone-900/50 dark:text-stone-50/50 w-6">${score}</span>
                </div>
              </td>
            </tr>`)}
          </tbody>
        </table>
      </div>

      <!-- Side stat blocks -->
      <div class="col-span-12 md:col-span-4 flex flex-col gap-6">
        ${[
          ['#C8102E', 'Swiss Red', 'Default accent. Bold and assertive.'],
          ['#003B8E', 'Cobalt', 'Technical and corporate.'],
          ['#F0B429', 'Golden', 'Warm and editorial.'],
          ['#2D6A4F', 'Forest', 'Natural and calm.'],
        ].map(([hex, name, desc]) => html`
        <div class="border border-stone-200 dark:border-stone-800 p-5 flex items-start gap-4">
          <div class="w-8 h-8 shrink-0 mt-0.5" style="background-color: ${hex}"></div>
          <div>
            <p class="text-sm font-medium text-stone-900 dark:text-stone-50">${name}</p>
            <p class="text-xs text-stone-900/40 dark:text-stone-50/40 font-mono mt-0.5">${hex}</p>
            <p class="text-xs text-stone-900/50 dark:text-stone-50/50 mt-2 leading-relaxed">${desc}</p>
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
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">05</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Cards</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="mb-12">
      <h2 class="text-3xl font-light tracking-tight text-stone-900 dark:text-stone-50">Objects of Swiss Design</h2>
      <p class="text-sm text-stone-900/50 dark:text-stone-50/50 mt-2 max-w-[48ch]">Six artefacts that defined an era of modernist design.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800">
      ${[
        { accent: '#C8102E', label: 'Chair', year: '1952', name: 'Basel Stacking Chair', desc: 'Steel rod frame with plywood seat. Designed for the Swiss Federal Railways waiting rooms.', tag: 'Furniture' },
        { accent: '#003B8E', label: 'Poster', year: '1958', name: 'Musica Viva Series', desc: 'Concert series posters by Josef Müller-Brockmann. Geometric forms conveying rhythm.', tag: 'Print' },
        { accent: '#F0B429', label: 'Clock', year: '1944', name: 'Station Clock', desc: 'Hans Hilfiker\'s railway clock. Red sweeping second hand. Adopted by Swiss Federal Railways.', tag: 'Industrial' },
        { accent: '#2D6A4F', label: 'Type', year: '1957', name: 'Helvetica', desc: 'Max Miedinger\'s neutral grotesque. Designed at the Haas Type Foundry in Münchenbuchsee.', tag: 'Typography' },
        { accent: '#C8102E', label: 'Building', year: '1961', name: 'Hallenstadion', desc: 'Large indoor arena in Zürich. Rationalist concrete structure with industrial precision.', tag: 'Architecture' },
        { accent: '#003B8E', label: 'Grid', year: '1961', name: 'Raster Systeme', desc: 'Müller-Brockmann\'s definitive guide to the typographic grid. Still in print today.', tag: 'Publication' },
      ].map(({ accent, label, year, name, desc, tag }) => html`
      <div class="bg-stone-50 dark:bg-stone-950 p-8 flex flex-col gap-6 hover:bg-white dark:hover:bg-stone-900 transition-colors">
        <div class="flex items-start justify-between">
          <div class="w-10 h-10" style="background-color: ${accent}; opacity: 0.15;"></div>
          <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">${year}</span>
        </div>
        <div>
          <div class="w-6 h-px mb-4" style="background-color: ${accent}"></div>
          <span class="text-[10px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 block mb-2">${label}</span>
          <h3 class="text-lg font-normal text-stone-900 dark:text-stone-50 leading-snug">${name}</h3>
          <p class="text-sm text-stone-900/50 dark:text-stone-50/50 leading-relaxed mt-3 max-w-[32ch]">${desc}</p>
        </div>
        <div class="mt-auto pt-4 border-t border-stone-100 dark:border-stone-900 flex items-center justify-between">
          <span class="text-[10px] tracking-widest uppercase px-2 py-1" style="background-color: ${accent}20; color: ${accent}">${tag}</span>
          <span class="text-stone-900/20 dark:text-stone-50/20 text-xs">→</span>
        </div>
      </div>`)}
    </div>
  </div>
</section>`

// ─── Section 06: App Chrome ───────────────────────────────────────────────────

const SectionApp = () => html`
<section id="app" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">06</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">App</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <!-- App shell -->
    <div class="border border-stone-200 dark:border-stone-800 overflow-hidden">
      <!-- App top bar -->
      <div class="border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 px-6 py-3 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="text-xs font-medium tracking-widest uppercase text-stone-900 dark:text-stone-50">Archiv</span>
          <span class="text-xs text-stone-900/40 dark:text-stone-50/40">Design Collection</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700"></span>
          <span class="w-2 h-2 rounded-full bg-stone-200 dark:bg-stone-700"></span>
          <span class="w-2 h-2 rounded-full bg-[#C8102E]"></span>
        </div>
      </div>

      <div class="flex">
        <!-- Sidebar -->
        <div class="w-48 border-r border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 p-6 min-h-72 shrink-0">
          <span class="text-[10px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 block mb-4">Collections</span>
          <ul class="space-y-0.5">
            ${[
              { label: 'All items', count: '128', active: false },
              { label: 'Typography', count: '34', active: true },
              { label: 'Architecture', count: '22', active: false },
              { label: 'Industrial', count: '41', active: false },
              { label: 'Print', count: '31', active: false },
            ].map(({ label, count, active }) => html`
            <li>
              <a href="#" class="flex items-center justify-between py-2 px-2 text-xs ${active ? 'text-[#C8102E] bg-[#C8102E]/5' : 'text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 hover:bg-stone-100 dark:hover:bg-stone-900'} transition-colors">
                <span>${label}</span>
                <span class="font-mono text-[10px] ${active ? 'text-[#C8102E]/60' : 'text-stone-900/30 dark:text-stone-50/30'}">${count}</span>
              </a>
            </li>`)}
          </ul>
        </div>

        <!-- Main content -->
        <div class="flex-1 p-8">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-xs text-stone-900/40 dark:text-stone-50/40 mb-6">
            <span>Collection</span>
            <span>/</span>
            <span class="text-stone-900 dark:text-stone-50">Typography</span>
          </div>

          <div class="flex items-start justify-between mb-8">
            <div>
              <h3 class="text-xl font-normal text-stone-900 dark:text-stone-50">Typography</h3>
              <p class="text-sm text-stone-900/50 dark:text-stone-50/50 mt-1">34 items in collection</p>
            </div>
            <button class="px-4 py-2 bg-[#C8102E] text-white text-xs tracking-widest uppercase hover:bg-[#C8102E]/90 transition-colors">
              Add item
            </button>
          </div>

          <!-- Item list -->
          <div class="space-y-0">
            ${[
              { name: 'Helvetica', year: '1957', designer: 'Max Miedinger' },
              { name: 'Univers', year: '1957', designer: 'Adrian Frutiger' },
              { name: 'Akzidenz-Grotesk', year: '1896', designer: 'Berthold' },
              { name: 'Folio', year: '1957', designer: 'Konrad Bauer' },
            ].map(({ name, year, designer }) => html`
            <div class="border-t border-stone-100 dark:border-stone-900 py-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-900/50 px-2 -mx-2 transition-colors cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-6 h-6 border border-stone-200 dark:border-stone-800 flex items-center justify-center">
                  <span class="text-[8px] font-mono text-stone-900/30 dark:text-stone-50/30">Aa</span>
                </div>
                <span class="text-sm text-stone-900 dark:text-stone-50">${name}</span>
              </div>
              <div class="flex items-center gap-8">
                <span class="text-xs text-stone-900/40 dark:text-stone-50/40">${designer}</span>
                <span class="text-xs font-mono text-stone-900/30 dark:text-stone-50/30">${year}</span>
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
      <span class="text-[10px] font-mono text-stone-50/20">07</span>
      <span class="text-xs tracking-widest uppercase text-stone-50/40">Type</span>
      <div class="flex-1 h-px bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 md:col-span-8 space-y-16">
        <!-- Display -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">Display — 72px light tracking-tight leading-none</span>
          <p class="text-7xl font-light tracking-tight leading-none">Form Folgt</p>
        </div>
        <!-- H1 -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">H1 — 48px light tracking-tight leading-tight</span>
          <p class="text-5xl font-light tracking-tight leading-tight">Grid Systems in<br>Graphic Design</p>
        </div>
        <!-- H2 -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">H2 — 36px light tracking-tight leading-snug</span>
          <p class="text-4xl font-light tracking-tight leading-snug">The Typographic Grid</p>
        </div>
        <!-- H3 -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">H3 — 24px normal leading-snug</span>
          <p class="text-2xl font-normal leading-snug">Alignment and Proportion</p>
        </div>
        <!-- Body -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">Body — 16px normal leading-relaxed max-w-[60ch]</span>
          <p class="text-base font-normal leading-relaxed max-w-[60ch]">The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style. But one must learn how to use the grid; it is an art that requires practice.</p>
        </div>
        <!-- Small -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">Small — 14px normal leading-relaxed</span>
          <p class="text-sm font-normal leading-relaxed text-stone-50/70 max-w-[60ch]">Supporting text at reduced opacity. Used for descriptions, metadata, and secondary content that accompanies primary body copy.</p>
        </div>
        <!-- Caption -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">Caption — 12px tracking-widest uppercase</span>
          <p class="text-xs tracking-widest uppercase text-stone-50/40">Figure 03 — Basel, Switzerland, 1961 — Offset Lithography</p>
        </div>
        <!-- Mono -->
        <div class="border-t border-stone-800 pt-8">
          <span class="text-[10px] font-mono text-stone-50/20 block mb-6">Mono — IBM Plex Mono 14px</span>
          <p class="font-mono text-sm text-stone-50/80">npx skills add zeke/swiss-design-skill</p>
        </div>
      </div>

      <!-- Right: weight / opacity ladder -->
      <div class="col-span-12 md:col-span-4">
        <div class="sticky top-24 space-y-8">
          <div>
            <span class="text-[10px] font-mono text-stone-50/20 block mb-6 border-t border-stone-800 pt-8">Weight ladder</span>
            ${[['Light 300', 'font-light'], ['Normal 400', 'font-normal'], ['Medium 500', 'font-medium'], ['Semi 600', 'font-semibold']].map(([label, cls]) => html`
            <div class="mb-4">
              <span class="text-[10px] text-stone-50/30 block mb-1">${label}</span>
              <p class="text-2xl ${cls} text-stone-50">Grotesque</p>
            </div>`)}
          </div>
          <div>
            <span class="text-[10px] font-mono text-stone-50/20 block mb-6 border-t border-stone-800 pt-8">Opacity ladder</span>
            ${[['100%', 'text-stone-50'], ['70%', 'text-stone-50/70'], ['40%', 'text-stone-50/40'], ['20%', 'text-stone-50/20']].map(([pct, cls]) => html`
            <div class="mb-4 flex items-baseline gap-3">
              <span class="text-[10px] font-mono text-stone-50/20 w-8">${pct}</span>
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
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">08</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Color</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <!-- Stone scale -->
    <div class="mb-20">
      <h3 class="text-sm tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 mb-8">Stone scale</h3>
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
          <span class="text-[9px] font-mono" style="color: ${parseInt(scale) < 500 ? '#1c1917' : '#fafaf9'}; opacity: 0.5">${scale}</span>
        </div>`)}
      </div>
    </div>

    <!-- Accent colors + opacity -->
    <div class="mb-20">
      <h3 class="text-sm tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 mb-8">Accent × opacity</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        ${[
          { name: 'Swiss Red', hex: '#C8102E', label: 'Default' },
          { name: 'Cobalt', hex: '#003B8E', label: 'Technical' },
          { name: 'Golden', hex: '#F0B429', label: 'Editorial' },
          { name: 'Forest', hex: '#2D6A4F', label: 'Natural' },
        ].map(({ name, hex, label }) => html`
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-stone-900 dark:text-stone-50">${name}</span>
            <span class="text-[10px] text-stone-900/30 dark:text-stone-50/30 tracking-widest uppercase">${label}</span>
          </div>
          <div class="space-y-1">
            ${[['100%', ''], ['60%', '99'], ['20%', '33'], ['10%', '1a']].map(([pct, _]) => html`
            <div class="h-10 flex items-center px-3" style="background-color: ${hex}; opacity: ${parseFloat(pct) / 100};">
              <span class="text-[10px] font-mono" style="color: ${parseFloat(pct) >= 40 ? 'white' : hex}; opacity: ${parseFloat(pct) >= 40 ? 0.7 : 1}">${pct}</span>
            </div>`)}
          </div>
          <div class="mt-2">
            <code class="text-[10px] font-mono text-stone-900/40 dark:text-stone-50/40">${hex}</code>
          </div>
        </div>`)}
      </div>
    </div>

    <!-- Opacity rule callout -->
    <div class="bg-stone-900 dark:bg-stone-900 p-8 border-l-2 border-[#C8102E]">
      <h3 class="text-base font-normal text-stone-50 mb-3">The opacity rule</h3>
      <p class="text-sm leading-relaxed text-stone-50/60 max-w-[60ch]">
        To make text less dominant, reduce opacity — never change the hue. <code class="font-mono text-[#C8102E]/80">text-stone-900/70</code> is secondary text. <code class="font-mono text-[#C8102E]/80">text-stone-900/40</code> is tertiary. Never use mid-scale stone values (stone-400–700) for text hierarchy.
      </p>
    </div>
  </div>
</section>`

// ─── Section 09: Form ────────────────────────────────────────────────────────

const SectionForm = () => html`
<section id="form" class="border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">09</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Form</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 md:col-span-5">
        <div class="w-6 h-px bg-[#F0B429] mb-8"></div>
        <h2 class="text-3xl font-light tracking-tight text-stone-900 dark:text-stone-50 mb-4">
          Symposium<br>Registration
        </h2>
        <p class="text-sm leading-relaxed text-stone-900/50 dark:text-stone-50/50 max-w-[36ch]">
          International Typographic Symposium. Zürich, 12–14 April 1962. Capacity limited to 120 participants.
        </p>
        <div class="mt-12 space-y-4">
          ${[['Venue', 'Kunstgewerbeschule Zürich'], ['Language', 'German, French, English'], ['Fee', 'CHF 45 / Students CHF 20'], ['Deadline', '1 March 1962']].map(([k, v]) => html`
          <div class="flex gap-4 border-t border-stone-200 dark:border-stone-800 pt-4">
            <span class="text-[10px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 w-20 shrink-0 pt-0.5">${k}</span>
            <span class="text-sm text-stone-900/70 dark:text-stone-50/70">${v}</span>
          </div>`)}
        </div>
      </div>

      <div class="col-span-12 md:col-span-6 md:col-start-7">
        <form class="space-y-6 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-8" onsubmit="return false">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-[10px] tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">First name</label>
              <input type="text" class="border border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-stone-50 text-sm px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/20 dark:placeholder:text-stone-50/20 transition-colors" placeholder="Josef">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Last name</label>
              <input type="text" class="border border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-stone-50 text-sm px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/20 dark:placeholder:text-stone-50/20 transition-colors" placeholder="Müller-Brockmann">
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Email address</label>
            <input type="email" class="border border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-stone-50 text-sm px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/20 dark:placeholder:text-stone-50/20 transition-colors" placeholder="jmb@schule.ch">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Institution</label>
            <input type="text" class="border border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-stone-50 text-sm px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/20 dark:placeholder:text-stone-50/20 transition-colors" placeholder="Kunstgewerbeschule Zürich">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Attendance</label>
            <select class="border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 text-sm px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 appearance-none">
              <option>Full symposium (3 days)</option>
              <option>Day 1 only</option>
              <option>Day 2 only</option>
              <option>Day 3 only</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Message (optional)</label>
            <textarea rows="3" class="border border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-stone-50 text-sm px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 resize-none transition-colors placeholder:text-stone-900/20 dark:placeholder:text-stone-50/20" placeholder="Dietary requirements, accessibility needs, etc."></textarea>
          </div>
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" class="mt-0.5 w-4 h-4 border border-stone-300 dark:border-stone-700 accent-[#F0B429]">
            <span class="text-xs text-stone-900/50 dark:text-stone-50/50 leading-relaxed">I agree to the symposium code of conduct and confirm that my registration fee will be paid by the deadline.</span>
          </label>
          <button type="submit" class="w-full py-4 bg-[#F0B429] text-stone-900 text-xs tracking-widest uppercase font-medium hover:bg-[#F0B429]/90 transition-colors">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  </div>
</section>`

// ─── Section 10: Install / Footer ────────────────────────────────────────────

const SectionInstall = () => html`
<section id="install" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-8 py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-[10px] font-mono text-stone-900/30 dark:text-stone-50/30">10</span>
      <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Install</span>
      <div class="flex-1 h-px bg-stone-200 dark:bg-stone-800"></div>
    </div>

    <div class="grid grid-cols-12 gap-8 items-start">
      <div class="col-span-12 md:col-span-6">
        <div class="w-6 h-px bg-[#C8102E] mb-8"></div>
        <h2 class="text-4xl font-light tracking-tight text-stone-900 dark:text-stone-50 mb-6">
          One command.<br>Every project.
        </h2>
        <p class="text-base leading-relaxed text-stone-900/60 dark:text-stone-50/60 max-w-[48ch] mb-12">
          Install the skill and your AI agent will apply Swiss design principles whenever you ask it to style a page, clean up a UI, or make something look great.
        </p>

        <div class="space-y-4">
          <div>
            <span class="text-[10px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 block mb-3">Install with skills CLI</span>
            <div class="bg-stone-900 dark:bg-stone-950 text-stone-50 px-5 py-4 font-mono text-sm flex items-center justify-between gap-4 border border-stone-800">
              <span class="select-all">npx skills add zeke/swiss-design-skill</span>
              <span class="text-stone-50/30 shrink-0 text-xs">copy</span>
            </div>
          </div>
          <div>
            <span class="text-[10px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 block mb-3">Or install manually</span>
            <div class="bg-stone-100 dark:bg-stone-900 px-5 py-4 font-mono text-xs text-stone-900/60 dark:text-stone-50/60 border border-stone-200 dark:border-stone-800 space-y-1">
              <div><span class="text-stone-900/30 dark:text-stone-50/30">$</span> gh repo clone zeke/swiss-design-skill</div>
              <div><span class="text-stone-900/30 dark:text-stone-50/30">$</span> cp -r swiss-design-skill/swiss-design ~/.config/opencode/skills/</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-5 md:col-start-8 space-y-6">
        <div class="border border-stone-200 dark:border-stone-800 p-6">
          <span class="text-[10px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 block mb-4">Works with</span>
          <div class="grid grid-cols-2 gap-3">
            ${['OpenCode', 'Claude Code', 'GitHub Copilot', 'Cursor', 'Windsurf', 'Cline', 'Codex', 'Gemini CLI'].map(agent => html`
            <div class="text-xs text-stone-900/60 dark:text-stone-50/60 flex items-center gap-2">
              <div class="w-1 h-1 bg-[#C8102E]"></div>
              ${agent}
            </div>`)}
          </div>
        </div>

        <div class="border border-stone-200 dark:border-stone-800 p-6">
          <span class="text-[10px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 block mb-4">What the skill teaches</span>
          <ul class="space-y-3">
            ${[
              'IBM Plex Sans typography system',
              'Stone color palette + opacity hierarchy',
              'One accent color per project',
              '12-column grid with 8px base unit',
              'Generous whitespace rules',
              'Light/dark mode via system preference',
              'Tailwind component patterns',
            ].map(item => html`
            <li class="text-xs text-stone-900/60 dark:text-stone-50/60 flex items-start gap-2">
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
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900 dark:text-stone-50">Swiss Design System</span>
      <p class="text-xs text-stone-900/40 dark:text-stone-50/40 mt-2">
        IBM Plex Sans · Stone palette · Tailwind CSS
      </p>
    </div>
    <div class="flex items-center gap-8">
      <a href="${GITHUB_URL}" target="_blank" class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        GitHub ↗
      </a>
      <a href="https://skills.sh/zeke/swiss-design-skill" target="_blank" class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        skills.sh ↗
      </a>
      <a href="https://fonts.google.com/specimen/IBM+Plex+Sans" target="_blank" class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        IBM Plex Sans ↗
      </a>
      <span class="text-xs text-stone-900/20 dark:text-stone-50/20">MIT</span>
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
    SectionInstall() +
    `</main>` +
    Footer() +
    FOOT
  )
})

export default app
