import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

const GITHUB_URL = 'https://github.com/adewale/swiss-poster-skill'

const ACCENTS = [
  { name: 'Swiss Red',  hex: '#C8102E', label: 'Default',   desc: 'Bold and assertive. The classic Swiss poster red.' },
  { name: 'Cobalt',     hex: '#003B8E', label: 'Technical', desc: 'Corporate and trustworthy. Engineering and data.' },
  { name: 'Golden',     hex: '#F0B429', label: 'Editorial', desc: 'Warm and cultural. Print, arts, food.' },
  { name: 'Forest',     hex: '#2D6A4F', label: 'Natural',   desc: 'Calm and grounded. Health, sustainability.' },
  { name: 'Vermilion',  hex: '#E8431A', label: 'Energy',    desc: 'High-contrast orange-red. Motion and urgency.' },
  { name: 'Violet',     hex: '#6B21A8', label: 'Creative',  desc: 'Deep purple. Fashion, beauty, luxury editorial.' },
  { name: 'Magenta',    hex: '#C0186C', label: 'Bold',      desc: 'Hot pink-red. Vibrant, fearless, high-impact.' },
  { name: 'Lavender',   hex: '#7C3AED', label: 'Electric',  desc: 'Electric purple. Digital, futuristic, cultural.' },
]

const HEAD = html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Swiss Poster Design System</title>
  <meta name="description" content="A Swiss Poster design system skill for AI agents. Expressive typography at extreme scales, grid-breaking compositions, overlap, bleed, and bold geometric tension — expressed through Tailwind CSS.">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230c0a09'/%3E%3Ccircle cx='28' cy='28' r='18' fill='%23C8102E'/%3E%3Ccircle cx='28' cy='28' r='14' fill='none' stroke='%23C8102E' stroke-width='1' opacity='0.4'/%3E%3Cline x1='0' y1='10' x2='24' y2='0' stroke='%23fafaf9' stroke-width='1.5' opacity='0.3'/%3E%3Crect x='2' y='3' width='4' height='4' fill='%23003B8E' opacity='0.6'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:ital,wght@0,100;0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">
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
          lineHeight: {
            'poster': '0.85',
          },
        },
      },
    }
  </script>
  <style>
    body { -webkit-font-smoothing: antialiased; }
    html { scroll-behavior: smooth; }
    /* Halftone dot pattern — lithographic heritage */
    .halftone {
      background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
      background-size: 8px 8px;
    }
    .halftone-lg {
      background-image: radial-gradient(circle, currentColor 1.5px, transparent 1.5px);
      background-size: 12px 12px;
    }
    /* Rhythmic line pattern */
    .line-rhythm {
      background-image: repeating-linear-gradient(
        0deg,
        currentColor 0px,
        currentColor 1px,
        transparent 1px,
        transparent 8px
      );
    }
    .line-rhythm-h {
      background-image: repeating-linear-gradient(
        90deg,
        currentColor 0px,
        currentColor 1px,
        transparent 1px,
        transparent 8px
      );
    }
  </style>
  <script>
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
      const h = document.documentElement;
      h.classList.toggle('dark');
      localStorage.setItem('theme', h.classList.contains('dark') ? 'dark' : 'light');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        document.documentElement.classList.toggle('dark', e.matches);
      }
    });
    function copyInstall() {
      navigator.clipboard.writeText(document.getElementById('install-cmd').textContent).then(function() {
        var btn = document.getElementById('copy-btn');
        btn.textContent = 'copied';
        setTimeout(function() { btn.textContent = 'copy'; }, 2000);
      });
    }
  </script>
</body>
</html>`

// ─── Navigation ─────────────────────────────────────────────────────────────

const Nav = () => html`
<nav class="fixed top-0 left-0 right-0 z-50 border-b border-stone-200 dark:border-stone-800 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-sm">
  <div class="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
    <a href="/" class="text-xs tracking-widest uppercase font-medium text-stone-900 dark:text-stone-50">
      Swiss Poster
    </a>
    <div class="hidden md:flex items-center gap-6 text-xs tracking-widest uppercase">
      <a href="#manifesto" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Manifesto</a>
      <a href="#scale" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Scale</a>
      <a href="#geometry" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Geometry</a>
      <a href="#breakout" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Breakout</a>
      <a href="#overlap" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Overlap</a>
      <a href="#color" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Color</a>
      <a href="#type" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Type</a>
      <a href="#install" class="text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Install</a>
    </div>
    <div class="flex items-center gap-4">
      <a href="${GITHUB_URL}" target="_blank" class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">GitHub</a>
      <button onclick="toggleDark()" class="w-8 h-8 flex items-center justify-center border border-stone-300 dark:border-stone-700 hover:border-stone-500 dark:hover:border-stone-500 transition-colors" aria-label="Toggle dark mode">
        <span class="dark:hidden text-xs text-stone-900">&#9675;</span>
        <span class="hidden dark:inline text-xs text-stone-50">&#9679;</span>
      </button>
    </div>
  </div>
</nav>`

// ─── Section 01: Hero ────────────────────────────────────────────────────────

const SectionHero = () => html`
<section id="hero" class="relative min-h-screen flex items-end overflow-hidden border-b border-stone-200 dark:border-stone-800">
  <!-- Oversized background type — VISIBLE, cropped by left edge -->
  <div class="absolute top-0 left-0 right-0 pointer-events-none select-none overflow-hidden">
    <div class="text-[clamp(8rem,22vw,26rem)] font-bold leading-[0.85] text-stone-900/[0.08] dark:text-stone-50/[0.08] -ml-[8%] mt-12 tracking-tighter">
      SWISS<br>POSTER
    </div>
  </div>

  <!-- Rotated readable type along left edge — vertical axis -->
  <div class="absolute top-[30%] left-6 z-20 pointer-events-none hidden md:block">
    <span class="text-sm font-bold tracking-[0.3em] uppercase text-[#C8102E] -rotate-90 origin-top-left block whitespace-nowrap">Expressive Typography</span>
  </div>

  <!-- GEOMETRIC COMPOSITION — large shapes escaping the frame -->
  <!-- Giant circle, half-cropped by the right edge -->
  <div class="absolute -right-[15vw] top-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full border-[3px] border-[#C8102E]/30 pointer-events-none"></div>
  <div class="absolute -right-[12vw] top-[13%] w-[50vw] h-[50vw] max-w-[580px] max-h-[580px] rounded-full border-[2px] border-[#C8102E]/15 pointer-events-none"></div>
  <!-- Solid accent wedge — top-right, cropped -->
  <div class="absolute top-0 right-0 w-[35vw] max-w-[500px] h-[45vh] bg-[#C8102E] pointer-events-none" style="clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 70%)"></div>
  <!-- Bold diagonal bar cutting across -->
  <div class="absolute top-[20%] -right-[10%] w-[80vw] h-3 bg-[#C8102E]/20 -rotate-[18deg] origin-right pointer-events-none hidden md:block"></div>
  <div class="absolute top-[22%] -right-[10%] w-[80vw] h-px bg-stone-900/10 dark:bg-stone-50/10 -rotate-[18deg] origin-right pointer-events-none hidden md:block"></div>
  <!-- Small solid square — offset accent -->
  <div class="absolute top-[60%] right-[20%] w-16 h-16 bg-[#003B8E]/40 pointer-events-none hidden md:block"></div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 pb-16 md:pb-24 pt-40 md:pt-48 relative z-10 w-full">
    <div class="grid grid-cols-12 gap-4 md:gap-8">
      <div class="col-span-12 md:col-span-9">
        <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/50 dark:text-stone-50/50">Swiss Poster Design System — A skill for AI agents</span>
        <div class="w-16 h-1.5 bg-[#C8102E] mt-6 mb-10"></div>
        <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-stone-900 dark:text-stone-50">
          Elements<br><span class="text-[#C8102E]">escape</span> the<br>grid.
        </h1>
        <p class="text-lg md:text-xl leading-relaxed text-stone-900/70 dark:text-stone-50/70 mt-10 max-w-[52ch]">
          A design system rooted in the expressive tradition of Swiss poster design. Extreme typographic scale, overlapping layers, compositions that bleed past their containers — taught to your AI agent through Tailwind CSS.
        </p>
        <div class="mt-12 flex flex-col sm:flex-row items-start gap-4">
          <div class="bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 px-6 py-3 font-mono text-sm select-all">
            npx skills add adewale/swiss-poster-skill
          </div>
          <a href="${GITHUB_URL}" target="_blank" class="px-6 py-3 border border-stone-400 dark:border-stone-600 text-stone-900/80 dark:text-stone-50/80 text-sm tracking-wide hover:border-stone-900 dark:hover:border-stone-50 transition-colors">
            View on GitHub &#8599;
          </a>
        </div>
      </div>

      <div class="hidden md:flex col-span-3 flex-col justify-end gap-6 pb-4">
        ${['Grid as launchpad', 'Extreme scale contrast', 'Overlap & layer', 'Bleed & crop', 'One accent, used boldly', 'Tension over comfort'].map((label, i) => html`
        <div class="flex items-center gap-3 border-t border-stone-300 dark:border-stone-700 pt-4">
          <span class="text-xs text-stone-900/50 dark:text-stone-50/50 font-mono font-medium">0${i + 1}</span>
          <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/70 dark:text-stone-50/70">${label}</span>
        </div>`)}
      </div>
    </div>
  </div>
</section>`

// ─── Section 02: Manifesto ───────────────────────────────────────────────────

const SectionManifesto = () => html`
<section id="manifesto" class="border-b border-stone-200 dark:border-stone-800 relative overflow-hidden">
  <div class="h-1.5 bg-[#C8102E]"></div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">02</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Manifesto</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8">
      <div class="col-span-12 md:col-span-7 relative">
        <div class="absolute -left-4 md:-left-8 top-2 w-1.5 h-20 bg-[#C8102E] hidden md:block"></div>
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mb-10">
          The grid is a<br>launchpad, not<br>a prison.
        </h2>
        <p class="text-lg leading-relaxed text-stone-900 dark:text-stone-50 max-w-[60ch] mb-6">
          The Swiss International Style built the grid. The Swiss Poster style learned when to break it. Weingart, Troxler, Odermatt &amp; Tissi took the rational foundations of Brockmann and Ruder and made them <em>move</em>.
        </p>
        <p class="text-lg leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[60ch] mb-6">
          When type is large enough, it becomes image. When elements overlap, they create depth. When a composition bleeds past its edge, it implies a world larger than the frame. These are not violations of the grid — they are its ultimate expression.
        </p>
        <p class="text-lg leading-relaxed text-stone-900/50 dark:text-stone-50/50 max-w-[60ch]">
          Every breakout must be earned. The grid exists so the escape has meaning. Without structure, there is no tension — only chaos.
        </p>
        <div class="mt-10 pt-10 border-t border-stone-200 dark:border-stone-800">
          <span class="text-sm tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Informed by Weingart, Troxler, Hofmann, Ruder, Odermatt &amp; Tissi</span>
        </div>
      </div>

      <div class="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-8">
        <!-- Geometric composition — Hofmann-style abstract figure -->
        <div class="relative aspect-[3/4] bg-stone-900 dark:bg-stone-100 overflow-hidden">
          <!-- Large circle escaping top-right -->
          <div class="absolute -top-[20%] -right-[25%] w-[80%] h-0 pb-[80%] rounded-full bg-[#C8102E]"></div>
          <!-- Horizontal bar -->
          <div class="absolute top-[55%] left-0 w-full h-[4px] bg-stone-50/30 dark:bg-stone-900/30"></div>
          <!-- Vertical bar escaping bottom -->
          <div class="absolute bottom-0 left-[30%] w-[4px] h-[60%] bg-stone-50/20 dark:bg-stone-900/20"></div>
          <!-- Small accent square -->
          <div class="absolute bottom-[15%] left-[15%] w-[20%] h-0 pb-[20%] bg-[#003B8E]/60"></div>
          <!-- Triangle, bottom-right -->
          <div class="absolute bottom-0 right-0 w-[40%] h-[40%] bg-stone-50/10 dark:bg-stone-900/10" style="clip-path: polygon(100% 0, 100% 100%, 0 100%)"></div>
          <!-- Label -->
          <span class="absolute bottom-4 left-4 text-[11px] tracking-widest uppercase text-stone-50/40 dark:text-stone-900/40 font-medium">Komposition &#8212; 01</span>
        </div>

        <div class="flex gap-4">
          <div class="w-1 bg-[#C8102E] self-stretch shrink-0"></div>
          <div>
            <p class="text-2xl font-bold leading-snug tracking-tight text-stone-900 dark:text-stone-50">
              "Typography has one plain duty before it and that is to convey information in writing."
            </p>
            <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 mt-3 block">Emil Ruder</span>
          </div>
        </div>

        <div class="border-t-2 border-[#C8102E] pt-6 bg-stone-100 dark:bg-stone-900 p-6">
          <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 block mb-5">Six principles</span>
          <ul class="space-y-3">
            ${['Grid as launchpad', 'Extreme scale contrast', 'Overlap and layer', 'Bleed and crop', 'One accent, used boldly', 'Tension over comfort'].map(p => html`
            <li class="text-base text-stone-900/80 dark:text-stone-50/80 flex items-start gap-2">
              <span class="text-[#C8102E] mt-0.5 shrink-0">&#8212;</span>
              <span>${p}</span>
            </li>`)}
          </ul>
        </div>
      </div>
    </div>
  </div>
</section>`

// ─── Section 03: Scale Contrast ──────────────────────────────────────────────

const SectionScale = () => html`
<section id="scale" class="border-b border-stone-200 dark:border-stone-800 bg-stone-900 dark:bg-stone-950 text-stone-50 relative overflow-hidden">
  <!-- Mega background type — VISIBLE, cropped off right edge -->
  <div class="absolute -top-8 -right-[10%] pointer-events-none select-none">
    <div class="text-[clamp(14rem,35vw,42rem)] font-bold leading-[0.85] text-stone-50/[0.07] tracking-tighter whitespace-nowrap">PLAKAT</div>
  </div>
  <!-- Halftone dot texture — lithographic reference -->
  <div class="absolute bottom-0 right-0 w-1/3 h-1/4 text-stone-50/[0.04] halftone pointer-events-none"></div>
  <!-- Rotated readable label on right edge -->
  <div class="absolute top-[20%] right-6 z-20 pointer-events-none hidden md:block">
    <span class="text-sm font-bold tracking-[0.3em] uppercase text-[#C8102E]/70 rotate-90 origin-top-right block whitespace-nowrap">Scale Contrast</span>
  </div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32 relative z-10">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-50/60">03</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-50/80">Scale</span>
      <div class="flex-1 h-px bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8 mb-24">
      <div class="col-span-12 md:col-span-8">
        <h2 class="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-6">
          Extreme scale contrast<br>is the hierarchy.
        </h2>
        <p class="text-base leading-relaxed text-stone-50/70 max-w-[52ch]">
          Place 20rem display type next to 11px labels. The tension between massive and tiny <em>is</em> the design. Moderate size differences feel timid. Aim for 10&#215;+ ratio between your largest and smallest type.
        </p>
      </div>
    </div>

    <!-- Type scale demonstration with extreme contrast -->
    <div class="space-y-16">
      <!-- Mega -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">Mega &#8212; clamp(6rem, 15vw, 20rem) bold</span>
        <p class="text-[clamp(4rem,12vw,14rem)] font-bold tracking-tighter leading-[0.85] text-[#C8102E]">Z&#220;RICH</p>
      </div>
      <!-- Mega thin -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">Mega thin &#8212; clamp(6rem, 15vw, 20rem) weight 100</span>
        <p class="text-[clamp(4rem,12vw,14rem)] font-thin tracking-tighter leading-[0.85]">FORME</p>
      </div>
      <!-- Display -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">Display &#8212; 72&#8211;128px light</span>
        <p class="text-7xl md:text-8xl lg:text-9xl font-light tracking-tight leading-none">Form Folgt</p>
      </div>
      <!-- Display bold -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">Display bold &#8212; weight contrast in one line</span>
        <p class="text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none"><span class="font-thin">Neue</span> <span class="font-bold">Grafik</span></p>
      </div>
      <!-- H1 -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">H1 &#8212; 48&#8211;64px light</span>
        <p class="text-5xl md:text-6xl font-light tracking-tight leading-tight">Grid Systems in<br>Graphic Design</p>
      </div>
      <!-- Body -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">Body &#8212; 16px normal leading-relaxed max-w-[60ch]</span>
        <p class="text-base font-normal leading-relaxed max-w-[60ch] text-stone-50/80">The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style. But one must learn how to use the grid; it is an art that requires practice.</p>
      </div>
      <!-- Caption -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">Caption &#8212; 12px tracking-widest uppercase</span>
        <p class="text-xs tracking-widest uppercase text-stone-50/50">Figure 03 &#8212; Basel, Switzerland, 1961 &#8212; Offset Lithography</p>
      </div>
      <!-- Label -->
      <div class="border-t border-stone-800 pt-8">
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6">Label &#8212; 11px tracking-widest uppercase medium</span>
        <p class="text-[11px] tracking-widest uppercase font-medium text-stone-50/50">Smallest text in the system</p>
      </div>
    </div>

    <!-- Weight + opacity ladders side by side -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-24">
      <div>
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6 border-t border-stone-800 pt-8">Weight ladder (poster range)</span>
        ${[['Thin 100', 'font-thin'], ['Light 300', 'font-light'], ['Normal 400', 'font-normal'], ['Medium 500', 'font-medium'], ['Semi 600', 'font-semibold'], ['Bold 700', 'font-bold']].map(([label, cls]) => html`
        <div class="mb-5">
          <span class="text-xs font-medium text-stone-50/40 block mb-1">${label}</span>
          <p class="text-3xl ${cls} text-stone-50">Grotesque</p>
        </div>`)}
      </div>
      <div>
        <span class="text-[11px] font-mono font-medium text-stone-50/40 tracking-widest uppercase block mb-6 border-t border-stone-800 pt-8">Opacity ladder</span>
        ${[['100%', 'text-stone-50'], ['70%', 'text-stone-50/70'], ['50%', 'text-stone-50/50'], ['30%', 'text-stone-50/30'], ['20%', 'text-stone-50/20']].map(([pct, cls]) => html`
        <div class="mb-4 flex items-baseline gap-3">
          <span class="text-xs font-mono font-medium text-stone-50/40 w-8">${pct}</span>
          <p class="text-base ${cls}">Primary text at ${pct}</p>
        </div>`)}
      </div>
    </div>
  </div>
</section>`

// ─── Section 03b: Geometry ────────────────────────────────────────────────────

const SectionGeometry = () => html`
<section id="geometry" class="border-b border-stone-200 dark:border-stone-800 relative overflow-hidden">
  <div class="max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-8">
    <div class="flex items-center gap-4 mb-12">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">03b</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Geometry</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>
    <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mb-4">
      Shapes as images.
    </h2>
    <p class="text-base leading-relaxed text-stone-900/60 dark:text-stone-50/60 max-w-[52ch] mb-16">
      Geometric forms at poster scale are compositional anchors, not decoration. A circle cropped by the frame, a bar slicing across columns, a triangle escaping its container &#8212; these are the images of the Swiss poster tradition.
    </p>
  </div>

  <!-- Three poster compositions side by side, each straining at its frame -->
  <div class="max-w-6xl mx-auto px-4 md:px-8 pb-24 md:pb-32">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Composition 1: Concentric arcs cropped by frame (Brockmann) -->
      <div class="relative aspect-[3/4] bg-stone-900 dark:bg-stone-800 overflow-hidden group">
        <!-- Concentric arcs — all escaping bottom-right -->
        <div class="absolute -bottom-[30%] -right-[30%] w-[90%] h-0 pb-[90%] rounded-full border-[6px] border-[#C8102E] opacity-90"></div>
        <div class="absolute -bottom-[20%] -right-[20%] w-[70%] h-0 pb-[70%] rounded-full border-[5px] border-[#C8102E]/60"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-0 pb-[50%] rounded-full border-[4px] border-[#C8102E]/30"></div>
        <div class="absolute -bottom-[2%] -right-[2%] w-[30%] h-0 pb-[30%] rounded-full border-[3px] border-[#C8102E]/15"></div>
        <!-- Horizontal rules -->
        <div class="absolute top-[15%] left-0 w-full h-px bg-stone-50/10"></div>
        <div class="absolute top-[30%] left-0 w-[60%] h-px bg-stone-50/10"></div>
        <!-- Label -->
        <div class="absolute top-6 left-6 z-10">
          <span class="text-[11px] tracking-widest uppercase text-stone-50/50 font-medium block">Musica Viva</span>
          <span class="text-[11px] tracking-widest uppercase text-stone-50/30 font-medium block mt-1">Z&#252;rich / 1958</span>
        </div>
        <!-- Title escaping the bottom -->
        <div class="absolute bottom-6 left-6 right-6 z-10">
          <h3 class="text-3xl md:text-4xl font-bold text-stone-50 leading-[0.9]">Tonhalle</h3>
        </div>
      </div>

      <!-- Composition 2: Diagonal slash with overlapping blocks (Weingart) -->
      <div class="relative aspect-[3/4] bg-stone-100 dark:bg-stone-900 overflow-hidden border border-stone-200 dark:border-stone-800">
        <!-- Large diagonal bar escaping both edges -->
        <div class="absolute top-[10%] -left-[10%] w-[140%] h-12 bg-[#C8102E] -rotate-[25deg] origin-left"></div>
        <div class="absolute top-[12%] -left-[10%] w-[140%] h-2 bg-[#003B8E]/40 -rotate-[25deg] origin-left"></div>
        <!-- Overlapping rectangles -->
        <div class="absolute top-[40%] left-[10%] w-[45%] h-[30%] bg-stone-900/10 dark:bg-stone-50/10"></div>
        <div class="absolute top-[50%] left-[25%] w-[45%] h-[30%] bg-[#C8102E]/15 border-2 border-[#C8102E]/30"></div>
        <!-- Large numeral escaping top-right — visible -->
        <div class="absolute -top-4 -right-2 text-[10rem] font-bold leading-none text-stone-900/[0.12] dark:text-stone-50/[0.12] select-none">W</div>
        <!-- Label -->
        <div class="absolute top-6 left-6 z-10">
          <span class="text-[11px] tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium block">Typografische Monatsbl&#228;tter</span>
          <span class="text-[11px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 font-medium block mt-1">Basel / 1972</span>
        </div>
        <div class="absolute bottom-6 left-6 right-6 z-10">
          <h3 class="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-50 leading-[0.9]">Weingart</h3>
        </div>
      </div>

      <!-- Composition 3: Large triangle + circle collision (Hofmann) -->
      <div class="relative aspect-[3/4] bg-stone-950 overflow-hidden">
        <!-- Massive triangle escaping the top-left corner -->
        <div class="absolute -top-[10%] -left-[10%] w-[80%] h-[80%] bg-stone-50/90" style="clip-path: polygon(0 0, 100% 0, 0 100%)"></div>
        <!-- Circle punching through the triangle -->
        <div class="absolute top-[25%] left-[30%] w-[55%] h-0 pb-[55%] rounded-full bg-stone-950"></div>
        <div class="absolute top-[27%] left-[32%] w-[51%] h-0 pb-[51%] rounded-full border-2 border-[#C8102E]/60"></div>
        <!-- Accent bar across bottom -->
        <div class="absolute bottom-[20%] left-0 w-full h-1 bg-[#C8102E]/40"></div>
        <!-- Label -->
        <div class="absolute top-6 right-6 z-10 text-right">
          <span class="text-[11px] tracking-widest uppercase text-stone-50/50 font-medium block">Schule f&#252;r Gestaltung</span>
          <span class="text-[11px] tracking-widest uppercase text-stone-50/30 font-medium block mt-1">Basel / 1960</span>
        </div>
        <div class="absolute bottom-6 left-6 right-6 z-10">
          <h3 class="text-3xl md:text-4xl font-bold text-stone-50 leading-[0.9]">Hofmann</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- Full-bleed geometric band — rhythmic repetition + shapes -->
  <div class="relative h-56 md:h-72 bg-stone-900 dark:bg-stone-800 overflow-hidden">
    <!-- Rhythmic horizontal line field — Troxler-style visual rhythm -->
    <div class="absolute inset-0 text-stone-50/[0.06] line-rhythm pointer-events-none"></div>
    <!-- Giant circle cropped by top and right edges -->
    <div class="absolute -top-[50%] -right-[15%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full border-[8px] border-[#C8102E]/40 pointer-events-none"></div>
    <!-- Halftone dot field — bottom-left corner -->
    <div class="absolute bottom-0 left-0 w-1/3 h-2/3 text-stone-50/[0.05] halftone pointer-events-none"></div>
    <!-- Small square accents -->
    <div class="absolute top-[25%] left-[45%] w-12 h-12 bg-[#C8102E] opacity-60"></div>
    <div class="absolute top-[30%] left-[47%] w-8 h-8 bg-[#003B8E] opacity-40"></div>
    <!-- Diagonal accent bar across the band -->
    <div class="absolute top-[40%] -left-[5%] w-[110%] h-1 bg-[#C8102E]/25 -rotate-2 pointer-events-none"></div>
    <!-- Label — right-aligned (break top-left convention) -->
    <div class="max-w-6xl mx-auto px-4 md:px-8 relative z-10 h-full flex items-end justify-end pb-8">
      <div class="text-right">
        <span class="text-[11px] tracking-widest uppercase text-stone-50/40 font-medium block">Geometric forms at poster scale are compositional anchors</span>
        <span class="text-[11px] tracking-widest uppercase text-stone-50/20 font-medium block mt-1">Not ornament &#8212; not decoration &#8212; structure</span>
      </div>
    </div>
  </div>
</section>`

// ─── Section 04: Grid Breakout ───────────────────────────────────────────────

const SectionBreakout = () => html`
<section id="breakout" class="border-b border-stone-200 dark:border-stone-800 relative overflow-hidden">
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">04</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Breakout</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8 mb-24">
      <div class="col-span-12 md:col-span-7">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mb-6">
          The grid exists so<br>the breakout has<br>meaning.
        </h2>
        <p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[52ch]">
          Every layout starts with <code class="font-mono text-sm bg-stone-100 dark:bg-stone-900 px-1.5 py-0.5">grid grid-cols-12</code>. Then key elements escape using negative margins, absolute positioning, or overflow. Without the grid, there is nothing to break.
        </p>
      </div>
    </div>

    <!-- Demo 1: Negative margin breakout -->
    <div class="mb-24">
      <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Pattern 01 &#8212; Negative margin breakout</span>
      <div class="grid grid-cols-12 gap-4 md:gap-8 relative">
        <div class="col-span-12 md:col-span-7">
          <h3 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] text-stone-900 dark:text-stone-50 md:-mr-24 lg:-mr-32 relative z-10">Gestaltung</h3>
          <p class="text-sm leading-relaxed text-stone-900/60 dark:text-stone-50/60 mt-6 max-w-[40ch]">
            The heading escapes its column with a negative right margin, overlapping the neighboring column. The grid is visible. The escape is deliberate.
          </p>
        </div>
        <div class="col-span-12 md:col-span-5 flex items-end">
          <div class="border-t border-stone-200 dark:border-stone-800 pt-4 w-full">
            <code class="font-mono text-xs text-stone-900/50 dark:text-stone-50/50 leading-relaxed block">md:-mr-24 lg:-mr-32 relative z-10</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo 2: Accent block escaping -->
    <div class="mb-24">
      <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Pattern 02 &#8212; Absolute breakout</span>
      <div class="relative min-h-[300px] md:min-h-[400px]">
        <div class="grid grid-cols-12 gap-4 md:gap-8 relative z-10">
          <div class="col-span-12 md:col-span-6 flex flex-col justify-end pb-8">
            <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 mb-4">Kunsthaus Z&#252;rich / 1962</span>
            <h3 class="text-3xl md:text-4xl font-light tracking-tight text-stone-900 dark:text-stone-50 leading-snug">Form und Farbe</h3>
            <p class="text-sm leading-relaxed text-stone-900/60 dark:text-stone-50/60 mt-4 max-w-[36ch]">
              An accent block floats above the grid with absolute positioning, creating a compositional anchor that the text works against.
            </p>
          </div>
        </div>
        <div class="absolute top-0 right-0 w-1/3 md:w-2/5 h-full bg-[#C8102E] z-0"></div>
        <div class="absolute top-8 right-8 text-7xl md:text-9xl font-bold text-white/20 select-none pointer-events-none leading-none z-0">02</div>
      </div>
    </div>

    <!-- Demo 3: Full-bleed band -->
    <div class="mb-24">
      <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Pattern 03 &#8212; Full-bleed accent band</span>
    </div>
  </div>

  <!-- Full-bleed: escapes the max-w container -->
  <div class="bg-[#C8102E] py-16 md:py-24 relative overflow-hidden">
    <div class="absolute top-0 left-0 text-[clamp(8rem,25vw,24rem)] font-bold leading-none text-white/10 select-none pointer-events-none -translate-y-1/4 -ml-4">CH</div>
    <div class="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
      <span class="text-xs tracking-widest uppercase text-white/40">Helvetica / 1957</span>
      <h3 class="text-4xl md:text-6xl lg:text-7xl font-light text-white mt-6 leading-tight">
        The typeface that<br>defined a century.
      </h3>
      <p class="text-base leading-relaxed text-white/60 mt-6 max-w-[48ch]">
        A full-bleed band ignores the content container entirely. The accent color runs edge to edge while content stays within <code class="font-mono text-sm text-white/80">max-w-6xl</code>.
      </p>
    </div>
  </div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32">
    <!-- Demo 4: Viewport-width type, VISIBLY cropped by right edge -->
    <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Pattern 04 &#8212; Type cropped by the viewport edge</span>
    <div class="overflow-hidden relative">
      <div class="text-[clamp(5rem,16vw,18rem)] font-bold leading-[0.85] tracking-tighter text-stone-900/[0.12] dark:text-stone-50/[0.12] -ml-[2%] whitespace-nowrap select-none">
        TYPOGRAPHIE
      </div>
      <!-- Rhythmic vertical line field — Troxler-style repetition -->
      <div class="absolute top-0 left-[10%] w-[60%] h-full text-stone-900/[0.06] dark:text-stone-50/[0.06] line-rhythm-h pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 ml-4 mb-4">
        <code class="font-mono text-xs text-stone-900/50 dark:text-stone-50/50 leading-relaxed block bg-stone-50/80 dark:bg-stone-950/80 px-2 py-1">Visible at 12% &#8212; type runs off the right edge</code>
      </div>
    </div>

    <!-- Demo 5: Extreme letterspacing -->
    <div class="mt-24">
      <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Pattern 05 &#8212; Extreme letterspacing</span>
      <div class="overflow-hidden">
        <p class="text-4xl md:text-6xl font-bold tracking-[0.3em] uppercase text-stone-900 dark:text-stone-50 whitespace-nowrap">B &nbsp;A &nbsp;S &nbsp;E &nbsp;L</p>
        <p class="text-base leading-relaxed text-stone-900/60 dark:text-stone-50/60 mt-4 max-w-[40ch]">
          Letters spaced to the point of disintegration. Each character becomes a solo figure. <code class="font-mono text-sm">tracking-[0.3em]</code>
        </p>
      </div>
    </div>
  </div>
</section>`

// ─── Section 05: Overlap ─────────────────────────────────────────────────────

const SectionOverlap = () => html`
<section id="overlap" class="border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 relative overflow-hidden">
  <!-- Halftone texture — top-left corner -->
  <div class="absolute top-0 left-0 w-1/4 h-1/3 text-stone-900/[0.03] dark:text-stone-50/[0.03] halftone-lg pointer-events-none"></div>
  <!-- Rotated readable type — right edge -->
  <div class="absolute top-[15%] right-8 z-20 pointer-events-none hidden md:block">
    <span class="text-base font-bold tracking-[0.2em] uppercase text-[#C8102E]/50 rotate-90 origin-top-right block whitespace-nowrap">Overlap &#8212; Depth &#8212; Collision</span>
  </div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">05</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Overlap</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8 mb-24">
      <div class="col-span-12 md:col-span-7">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mb-6">
          Layers <span class="text-[#C8102E]">collide.</span>
        </h2>
        <p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[52ch]">
          Elements collide on purpose. Text over color blocks, cards stacked with offset, type crossing a dividing line. Every overlap has a clear z-index order &#8212; random collision looks like a bug.
        </p>
      </div>
    </div>

    <!-- Stacked cards with offset -->
    <div class="mb-24">
      <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Stacked layers with offset</span>
      <div class="relative h-[320px] md:h-[380px]">
        <div class="absolute top-0 left-0 w-60 md:w-80 h-52 md:h-64 bg-stone-900 dark:bg-stone-100 p-6 md:p-8 z-10 flex flex-col justify-between">
          <span class="text-[11px] tracking-widest uppercase text-stone-50/40 dark:text-stone-900/40 font-medium">Layer 01</span>
          <h3 class="text-2xl font-light text-stone-50 dark:text-stone-900">Depth</h3>
        </div>
        <!-- Near-miss: only 6px offset — edges almost touching -->
        <div class="absolute top-[6px] md:top-2 left-12 md:left-16 w-60 md:w-80 h-52 md:h-64 bg-[#C8102E] p-6 md:p-8 z-20 flex flex-col justify-between">
          <span class="text-[11px] tracking-widest uppercase text-white/40 font-medium">Layer 02</span>
          <h3 class="text-2xl font-light text-white">Through</h3>
        </div>
        <div class="absolute top-3 md:top-4 left-24 md:left-32 w-60 md:w-80 h-52 md:h-64 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-6 md:p-8 z-30 flex flex-col justify-between">
          <span class="text-[11px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium">Layer 03</span>
          <h3 class="text-2xl font-light text-stone-900 dark:text-stone-50">Overlap</h3>
        </div>
      </div>
    </div>

    <!-- Split composition -->
    <div class="mb-24">
      <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Split composition &#8212; type crossing the boundary</span>
      <div class="relative min-h-[400px] md:min-h-[500px] overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 min-h-[400px] md:min-h-[500px]">
          <div class="bg-stone-900 dark:bg-stone-100 p-8 md:p-16 flex items-end min-h-[200px]">
            <span class="text-xs tracking-widest uppercase text-stone-50/40 dark:text-stone-900/40">Z&#252;rich 1959</span>
          </div>
          <div class="bg-stone-50 dark:bg-stone-950 p-8 md:p-16 flex items-end min-h-[200px]">
            <p class="text-sm leading-relaxed text-stone-900/60 dark:text-stone-50/60 max-w-[36ch]">
              Type uses <code class="font-mono text-xs">mix-blend-difference</code> to remain legible across both halves.
            </p>
          </div>
        </div>
        <h3 class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-6xl md:text-8xl font-bold text-white mix-blend-difference whitespace-nowrap z-10 pointer-events-none">
          KONTRAST
        </h3>
      </div>
    </div>

    <!-- Poster cards grid -->
    <div>
      <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/40 dark:text-stone-50/40 block mb-8">Poster cards &#8212; oversized numerals escape their containers</span>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200 dark:bg-stone-800">
        ${[
          { num: '01', accent: '#C8102E', name: 'Musica Viva', desc: 'Concert posters for Tonhalle Z\u00fcrich. Geometric forms express musical rhythm.', designer: 'M\u00fcller-Brockmann', year: '1953' },
          { num: '02', accent: '#003B8E', name: 'Neue Grafik', desc: 'Trilingual journal. 18 issues from 1958 to 1965. The voice of the Zurich school.', designer: 'Lohse, Vivarelli et al.', year: '1958' },
          { num: '03', accent: '#F0B429', name: 'Jazz Willisau', desc: 'Festival posters that pushed Swiss design into expressive new territory.', designer: 'Niklaus Troxler', year: '1975' },
          { num: '04', accent: '#2D6A4F', name: 'Raster Systeme', desc: 'The definitive guide to the typographic grid. Still in print.', designer: 'M\u00fcller-Brockmann', year: '1961' },
          { num: '05', accent: '#E8431A', name: 'Geigy Posters', desc: 'Pharmaceutical advertising elevated to art. Basel school influence.', designer: 'Various designers', year: '1950s' },
          { num: '06', accent: '#6B21A8', name: 'Weingart Type', desc: 'Post-punk typography that broke every rule the Swiss style established.', designer: 'Wolfgang Weingart', year: '1970s' },
        ].map(({ num, accent, name, desc, designer, year }) => html`
        <div class="bg-stone-50 dark:bg-stone-950 p-6 md:p-8 relative overflow-hidden min-h-[240px] flex flex-col justify-between group hover:bg-white dark:hover:bg-stone-900 transition-colors">
          <span class="absolute -top-4 -left-1 text-7xl md:text-8xl font-bold leading-none select-none pointer-events-none" style="color: ${accent}; opacity: 0.15">${num}</span>
          <div class="relative z-10">
            <div class="w-6 h-1" style="background-color: ${accent}"></div>
            <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 block mt-4 mb-2">${designer} / ${year}</span>
            <h4 class="text-xl font-medium text-stone-900 dark:text-stone-50 leading-snug">${name}</h4>
            <p class="text-sm text-stone-900/60 dark:text-stone-50/60 leading-relaxed mt-2 max-w-[32ch]">${desc}</p>
          </div>
        </div>`)}
      </div>
    </div>
  </div>
</section>`

// ─── Section 06: Color ───────────────────────────────────────────────────────

const SectionColor = () => html`
<section id="color" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">06</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Color</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8 mb-16">
      <!-- Negative space on left creates active L-shape -->
      <div class="col-span-12 md:col-span-5 md:col-start-8 md:text-right">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mb-6">
          One accent.<br><span class="text-[#C8102E]">Used boldly.</span>
        </h2>
        <p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 md:ml-auto max-w-[52ch]">
          The International Style limited accent to 10&#8211;15% of visual surface. Poster style can push to 30&#8211;40% &#8212; full-width bands, oversized shapes, dramatic backgrounds. The discipline of a single accent remains.
        </p>
      </div>
    </div>

    <!-- Grayscale -->
    <div class="mb-20">
      <h3 class="text-sm font-medium tracking-widest uppercase text-stone-900/70 dark:text-stone-50/70 mb-8">Stone palette</h3>
      <div class="grid grid-cols-5 md:grid-cols-11 gap-px bg-stone-200 dark:bg-stone-800">
        ${[
          ['50', '#fafaf9'], ['100', '#f5f5f4'], ['200', '#e7e5e4'], ['300', '#d6d3d1'],
          ['400', '#a8a29e'], ['500', '#78716c'], ['600', '#57534e'], ['700', '#44403c'],
          ['800', '#292524'], ['900', '#1c1917'], ['950', '#0c0a09'],
        ].map(([scale, hex]) => html`
        <div class="aspect-square flex flex-col justify-end p-2" style="background-color: ${hex}">
          <span class="text-[10px] font-mono" style="color: ${parseInt(scale) < 500 ? '#1c1917' : '#fafaf9'}; opacity: 0.6">${scale}</span>
        </div>`)}
      </div>
    </div>

    <!-- All accents x opacity -->
    <div class="mb-20">
      <h3 class="text-sm font-medium tracking-widest uppercase text-stone-900/70 dark:text-stone-50/70 mb-8">Accent palette &#215; opacity</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        ${ACCENTS.map(({ name, hex, label }) => html`
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-stone-900 dark:text-stone-50">${name}</span>
            <span class="text-xs text-stone-900/40 dark:text-stone-50/40 tracking-widest uppercase">${label}</span>
          </div>
          <div class="space-y-1">
            ${[['100%', 1], ['80%', 0.8], ['60%', 0.6], ['20%', 0.2], ['10%', 0.1]].map(([pct, opacity]) => html`
            <div class="h-10 flex items-center px-3 relative overflow-hidden">
              <div class="absolute inset-0" style="background-color: ${hex}; opacity: ${opacity};"></div>
              <span class="relative text-xs font-mono" style="color: ${opacity >= 0.4 ? 'white' : hex}">${pct}</span>
            </div>`)}
          </div>
          <code class="text-xs font-mono text-stone-900/40 dark:text-stone-50/40 mt-2 block">${hex}</code>
        </div>`)}
      </div>
    </div>

    <!-- Opacity rule callout -->
    <div class="bg-stone-900 p-8 border-l-4 border-[#C8102E]">
      <h3 class="text-lg font-medium text-stone-50 mb-3">The opacity rule still holds</h3>
      <p class="text-base leading-relaxed text-stone-50/70 max-w-[60ch]">
        To make text less dominant, reduce opacity &#8212; never change the hue. <code class="font-mono font-semibold text-stone-50">text-stone-900/70</code> is secondary text. <code class="font-mono font-semibold text-stone-50">text-stone-900/40</code> is tertiary. The poster style uses accent more aggressively in <em>surfaces</em>, but text hierarchy still follows this rule.
      </p>
    </div>
  </div>
</section>`

// ─── Section 07: Type Specimen ───────────────────────────────────────────────

const SectionType = () => html`
<section id="type" class="border-b border-stone-200 dark:border-stone-800">
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">07</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Type</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8">
      <div class="col-span-12 md:col-span-8">
        <h2 class="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-3">Font Specimen</h2>
        <p class="text-base text-stone-900/70 dark:text-stone-50/70 mb-12 max-w-[52ch]">Grotesque typefaces in the Swiss tradition. The poster style uses the full weight range &#8212; 100 to 700 &#8212; for extreme contrast.</p>

        <div class="overflow-x-auto">
          <table class="w-full text-sm min-w-[600px]">
            <thead>
              <tr class="border-t-2 border-stone-900 dark:border-stone-50 border-b border-b-stone-200 dark:border-b-stone-800">
                <th class="text-left text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium py-3 pr-6 pl-4">Typeface</th>
                <th class="text-left text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium py-3 pr-6">Designer</th>
                <th class="text-left text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium py-3 pr-6">Year</th>
                <th class="text-left text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium py-3 pr-6">Source</th>
                <th class="text-right text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium py-3 pr-4">Fidelity</th>
              </tr>
            </thead>
            <tbody>
              ${[
                ['IBM Plex Sans',      'Mike Abbink / Bold Monday', '2017', 'Google Fonts', '96', true],
                ['Hanken Grotesk',     'Hanken Design Co.',         '2021', 'Google Fonts', '92', false],
                ['Barlow',             'Jeremy Tribby',             '2017', 'Google Fonts', '88', false],
                ['Host Grotesk',       'Fraunhofer IAIS',           '2018', 'Google Fonts', '84', false],
                ['DM Sans',            'Colophon Foundry',          '2019', 'Google Fonts', '79', false],
                ['Neue Haas Grotesk',  'Miedinger & Hoffmann',      '1957', 'Linotype',     '100', false],
                ['Univers',            'Adrian Frutiger',           '1957', 'Linotype',     '98', false],
              ].map(([name, designer, year, source, score, featured]) => html`
              <tr class="border-b border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors ${featured ? 'bg-[#C8102E]/5' : ''}">
                <td class="py-4 pr-6 pl-4">
                  <span class="text-stone-900 dark:text-stone-50 font-normal">${name}</span>
                  ${featured ? html`<span class="ml-2 text-[11px] tracking-widest uppercase bg-[#C8102E]/10 text-[#C8102E] px-1.5 py-0.5">Primary</span>` : ''}
                </td>
                <td class="py-4 pr-6 text-stone-900/60 dark:text-stone-50/60">${designer}</td>
                <td class="py-4 pr-6 text-stone-900/60 dark:text-stone-50/60 font-mono text-sm">${year}</td>
                <td class="py-4 pr-6 text-stone-900/50 dark:text-stone-50/50 text-sm tracking-wide">${source}</td>
                <td class="py-4 pr-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <div class="w-16 h-1 bg-stone-200 dark:bg-stone-800 relative">
                      <div class="absolute left-0 top-0 h-full bg-[#C8102E]" style="width: ${score}%"></div>
                    </div>
                    <span class="text-sm font-mono text-stone-900/50 dark:text-stone-50/50 w-6">${score}</span>
                  </div>
                </td>
              </tr>`)}
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-span-12 md:col-span-4 flex flex-col gap-4">
        ${ACCENTS.slice(0, 4).map(({ hex, name, desc }) => html`
        <div class="border border-stone-200 dark:border-stone-800 p-5 flex items-start gap-4">
          <div class="w-8 h-8 shrink-0 mt-0.5" style="background-color: ${hex}"></div>
          <div>
            <p class="text-sm font-medium text-stone-900 dark:text-stone-50">${name}</p>
            <p class="text-xs text-stone-900/40 dark:text-stone-50/40 font-mono mt-0.5">${hex}</p>
            <p class="text-sm text-stone-900/60 dark:text-stone-50/60 mt-2 leading-relaxed">${desc}</p>
          </div>
        </div>`)}
      </div>
    </div>
  </div>
</section>`

// ─── Section 08: Poster Compositions ─────────────────────────────────────────

const SectionPosters = () => html`
<section id="posters" class="border-b border-stone-200 dark:border-stone-800 relative overflow-hidden">
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">08</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Posters</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8">
      <!-- Dark poster -->
      <div class="col-span-12 md:col-span-7 bg-stone-950 dark:bg-stone-900 p-8 md:p-12 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
        <!-- Geometric: large circle -->
        <div class="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-stone-700/50 pointer-events-none"></div>
        <div class="absolute -top-8 -right-8 w-64 h-64 rounded-full border border-stone-700/30 pointer-events-none"></div>
        <!-- Oversized numeral -->
        <div class="absolute top-4 right-8 text-[10rem] md:text-[14rem] font-bold leading-none text-stone-50/[0.04] select-none pointer-events-none">03</div>
        <!-- Triangle -->
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-[#003B8E]/30 pointer-events-none" style="clip-path: polygon(0 100%, 100% 100%, 0 0)"></div>

        <div class="relative z-10">
          <div class="flex items-center gap-3 mb-12">
            <div class="w-8 h-1.5 bg-[#003B8E]"></div>
            <span class="text-xs tracking-widest uppercase text-stone-50/50">Kunsthaus Z&#252;rich</span>
          </div>
          <p class="text-xs tracking-widest uppercase text-stone-50/40 mb-4">15. M&#228;rz &#8212; 30. April 1962</p>
          <h3 class="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
            <span class="text-stone-50">Form</span><br><span class="text-stone-50">und</span><br><span class="text-[#003B8E]">Farbe</span>
          </h3>
        </div>

        <div class="relative z-10">
          <div class="w-full h-px bg-stone-700 mb-6"></div>
          <div class="flex items-end justify-between">
            <p class="text-sm text-stone-50/60 leading-relaxed max-w-[28ch]">
              Eine Ausstellung &#252;ber die Beziehung zwischen Form, Farbe und Raum in der modernen Kunst.
            </p>
            <div class="text-right">
              <div class="w-8 h-8 bg-[#003B8E] mb-2"></div>
              <span class="text-xs tracking-widest uppercase text-stone-50/30">Eintritt frei</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Light poster -->
      <div class="col-span-12 md:col-span-5 bg-stone-100 dark:bg-stone-900 p-8 md:p-10 relative overflow-hidden min-h-[480px] flex flex-col justify-between border border-stone-200 dark:border-stone-800">
        <div class="absolute top-0 left-0 w-full h-1.5 bg-[#C8102E]"></div>
        <!-- Background type bleed -->
        <div class="absolute -bottom-4 -right-4 text-8xl md:text-9xl font-bold text-stone-900/[0.04] dark:text-stone-50/[0.04] leading-none select-none pointer-events-none">NT</div>

        <div class="relative z-10">
          <span class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50">International Typography</span>
          <h3 class="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mt-6">
            Neue<br>Typographie
          </h3>
          <p class="text-base leading-relaxed text-stone-900/60 dark:text-stone-50/60 mt-6 max-w-[32ch]">
            A symposium on the expressive potential of modern Swiss typography beyond the grid.
          </p>
        </div>

        <div class="relative z-10">
          <div class="grid grid-cols-2 gap-4 mb-8">
            ${[['Date', 'April 12, 1962'], ['Venue', 'Kunstgewerbeschule'], ['Time', '14:00\u201318:00'], ['Entry', 'Free']].map(([label, value]) => html`
            <div>
              <span class="text-xs tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 block mb-1">${label}</span>
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

// ─── Section 09: Form ────────────────────────────────────────────────────────

const SectionForm = () => html`
<section id="form" class="border-b border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 relative overflow-hidden">
  <!-- Rotated background text — VISIBLE -->
  <div class="absolute -top-4 -right-8 text-[clamp(8rem,22vw,18rem)] font-bold leading-none text-stone-900/[0.08] dark:text-stone-50/[0.08] select-none pointer-events-none -rotate-12 origin-top-right">REG</div>
  <!-- Rhythmic line texture — bottom-left -->
  <div class="absolute bottom-0 left-0 w-1/4 h-1/3 text-stone-900/[0.04] dark:text-stone-50/[0.04] line-rhythm pointer-events-none"></div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32 relative z-10">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">09</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Form</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8">
      <div class="col-span-12 md:col-span-5">
        <div class="w-8 h-1.5 bg-[#F0B429] mb-8"></div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mb-4">
          Symposium<br>Registration
        </h2>
        <p class="text-base leading-relaxed text-stone-900/60 dark:text-stone-50/60 max-w-[36ch]">
          International Typographic Symposium. Z&#252;rich, 12&#8211;14 April 1962. Capacity limited to 120 participants.
        </p>
        <div class="mt-12 space-y-4">
          ${[
            ['Venue', 'Kunstgewerbeschule Z\u00fcrich'],
            ['Language', 'German, French, English'],
            ['Fee', 'CHF 45 / Students CHF 20'],
            ['Deadline', '1 March 1962']
          ].map(([k, v]) => html`
          <div class="flex gap-4 border-t border-stone-200 dark:border-stone-800 pt-4">
            <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 w-20 shrink-0 pt-0.5">${k}</span>
            <span class="text-sm text-stone-900/80 dark:text-stone-50/80">${v}</span>
          </div>`)}
        </div>
      </div>

      <div class="col-span-12 md:col-span-6 md:col-start-7">
        <form class="space-y-6 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-6 md:p-8" onsubmit="return false">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">First name</label>
              <input type="text" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="Wolfgang">
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Last name</label>
              <input type="text" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="Weingart">
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Email</label>
            <input type="email" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="ww@schule.ch">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Institution</label>
            <input type="text" class="border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors" placeholder="Kunstgewerbeschule Basel">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-xs tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 font-medium">Attendance</label>
            <select class="border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 appearance-none">
              <option>Full symposium (3 days)</option>
              <option>Day 1 only</option>
              <option>Day 2 only</option>
              <option>Day 3 only</option>
            </select>
          </div>
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" class="mt-0.5 w-4 h-4 border border-stone-400 dark:border-stone-600 accent-[#F0B429]">
            <span class="text-sm text-stone-900/60 dark:text-stone-50/60 leading-relaxed">I agree to the symposium code of conduct.</span>
          </label>
          <button type="submit" class="w-full py-4 bg-[#F0B429] text-stone-900 text-xs tracking-widest uppercase font-medium hover:bg-[#F0B429]/90 transition-colors">
            Submit Registration
          </button>
        </form>
      </div>
    </div>
  </div>
</section>`

// ─── Section 10: Install ─────────────────────────────────────────────────────

const SectionInstall = () => html`
<section id="install" class="border-b border-stone-200 dark:border-stone-800 relative overflow-hidden">
  <!-- Background accent block -->
  <div class="absolute top-0 right-0 w-1/4 h-full bg-[#C8102E]/[0.06] pointer-events-none hidden md:block"></div>
  <!-- Visible type cropped by right edge -->
  <div class="absolute -right-[5%] top-[20%] pointer-events-none select-none hidden md:block">
    <div class="text-[clamp(6rem,15vw,14rem)] font-bold leading-[0.85] text-stone-900/[0.06] dark:text-stone-50/[0.06] tracking-tighter whitespace-nowrap">INSTALL</div>
  </div>
  <!-- Rotated label — left edge -->
  <div class="absolute bottom-[20%] left-6 z-20 pointer-events-none hidden md:block">
    <span class="text-xs font-bold tracking-[0.25em] uppercase text-[#C8102E]/40 -rotate-90 origin-bottom-left block whitespace-nowrap">One Command</span>
  </div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 py-24 md:py-32 relative z-10">
    <div class="flex items-center gap-4 mb-20">
      <span class="text-xs font-mono font-medium text-stone-900/60 dark:text-stone-50/60">10</span>
      <span class="text-xs tracking-widest uppercase font-medium text-stone-900/80 dark:text-stone-50/80">Install</span>
      <div class="flex-1 h-px bg-stone-300 dark:bg-stone-700"></div>
    </div>

    <div class="grid grid-cols-12 gap-4 md:gap-8 items-start">
      <div class="col-span-12 md:col-span-6">
        <div class="w-8 h-1.5 bg-[#C8102E] mb-8"></div>
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.95] mb-6">
          One command.<br>Every project.
        </h2>
        <p class="text-lg leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[48ch] mb-12">
          Install the skill and your AI agent will apply Swiss Poster design principles &#8212; grid-breaking compositions, extreme scale, overlap, and bold accent usage.
        </p>

        <div>
          <span class="text-xs tracking-widest uppercase font-medium text-stone-900/60 dark:text-stone-50/60 block mb-3">Install with skills CLI</span>
          <div class="bg-stone-900 dark:bg-stone-950 text-stone-50 px-5 py-4 font-mono text-sm flex items-center justify-between gap-4 border border-stone-800">
            <span id="install-cmd">npx skills add adewale/swiss-poster-skill</span>
            <button onclick="copyInstall()" id="copy-btn" class="text-stone-50/50 hover:text-stone-50 shrink-0 text-xs tracking-widest uppercase transition-colors min-h-[44px] px-2">copy</button>
          </div>
        </div>
      </div>

      <div class="col-span-12 md:col-span-5 md:col-start-8 space-y-6">
        <div class="border border-stone-200 dark:border-stone-800 p-6">
          <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 block mb-4">Works with</span>
          <div class="grid grid-cols-2 gap-3">
            ${['OpenCode', 'Claude Code', 'GitHub Copilot', 'Cursor', 'Windsurf', 'Cline', 'Codex', 'Gemini CLI'].map(agent => html`
            <div class="text-sm text-stone-900/70 dark:text-stone-50/70 flex items-center gap-2">
              <div class="w-1.5 h-1.5 bg-[#C8102E]"></div>
              ${agent}
            </div>`)}
          </div>
        </div>

        <div class="border border-stone-200 dark:border-stone-800 p-6">
          <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 block mb-4">What the skill teaches</span>
          <ul class="space-y-3">
            ${[
              'Extreme typographic scale contrast',
              'Grid-breaking compositions with overlap',
              'Bleed, crop, and diagonal energy',
              'Stone palette + opacity hierarchy',
              'Eight accent colors at poster scale',
              'Bold/thin weight contrast at display sizes',
              'Light/dark mode via system preference',
              'Tailwind component + composition patterns',
            ].map(item => html`
            <li class="text-sm text-stone-900/70 dark:text-stone-50/70 flex items-start gap-2">
              <span class="text-[#C8102E] mt-0.5 shrink-0">&#8212;</span>
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
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
    <div class="flex items-center gap-4">
      <!-- Poster mark — circle escaping its square -->
      <svg width="36" height="36" viewBox="0 0 32 32" class="shrink-0">
        <rect width="32" height="32" class="fill-stone-900 dark:fill-stone-100"/>
        <circle cx="28" cy="28" r="18" fill="#C8102E"/>
        <circle cx="28" cy="28" r="14" fill="none" stroke="#C8102E" stroke-width="1" opacity="0.4"/>
        <line x1="0" y1="10" x2="24" y2="0" class="stroke-stone-50 dark:stroke-stone-900" stroke-width="1.5" opacity="0.3"/>
        <rect x="2" y="3" width="4" height="4" fill="#003B8E" opacity="0.6"/>
      </svg>
      <div>
        <span class="text-sm tracking-widest uppercase font-medium text-stone-900 dark:text-stone-50">Swiss Poster</span>
        <p class="text-sm text-stone-900/40 dark:text-stone-50/40 mt-1">
          Expressive typography &#183; Grid-breaking compositions &#183; Tailwind CSS
        </p>
      </div>
    </div>
    <div class="flex items-center gap-8 flex-wrap">
      <a href="${GITHUB_URL}" target="_blank" class="text-sm tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        GitHub &#8599;
      </a>
      <a href="https://fonts.google.com/specimen/IBM+Plex+Sans" target="_blank" class="text-sm tracking-widest uppercase text-stone-900/50 dark:text-stone-50/50 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">
        IBM Plex Sans &#8599;
      </a>
      <span class="text-sm text-stone-900/30 dark:text-stone-50/30">MIT</span>
    </div>
  </div>
</footer>`

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('*', (c) => {
  return c.html(
    HEAD +
    Nav() +
    `<main class="pt-14">` +
    SectionHero() +
    SectionManifesto() +
    SectionScale() +
    SectionBreakout() +
    SectionOverlap() +
    SectionColor() +
    SectionType() +
    SectionPosters() +
    SectionForm() +
    SectionInstall() +
    `</main>` +
    Footer() +
    FOOT
  )
})

export default app
