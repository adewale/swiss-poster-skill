# Swiss Poster Design System — Component Patterns

All components use IBM Plex Sans, the stone palette, and a single accent color (`[#C8102E]` shown as default — swap to your project's accent).

---

## Typography

```html
<!-- Mega — viewport-scale type, one word or short phrase -->
<h1 class="text-[clamp(6rem,15vw,20rem)] font-bold leading-[0.85] tracking-tighter text-stone-900 dark:text-stone-50">
  PLAKAT
</h1>

<!-- Mega thin — delicate at massive scale -->
<h1 class="text-[clamp(6rem,15vw,20rem)] font-thin leading-[0.85] tracking-tighter text-stone-900 dark:text-stone-50">
  FORME
</h1>

<!-- Display -->
<h1 class="text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-stone-900 dark:text-stone-50 leading-none">
  Form und Funktion
</h1>

<!-- H1 -->
<h1 class="text-5xl md:text-6xl font-light tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
  Grid Systems in Graphic Design
</h1>

<!-- H2 -->
<h2 class="text-3xl md:text-4xl font-light tracking-tight text-stone-900 dark:text-stone-50 leading-snug">
  The Typographic Grid
</h2>

<!-- H3 -->
<h3 class="text-xl font-normal text-stone-900 dark:text-stone-50 leading-snug">
  Alignment and Proportion
</h3>

<!-- Body -->
<p class="text-base font-normal leading-relaxed text-stone-900 dark:text-stone-50 max-w-[60ch]">
  The grid system is an aid, not a guarantee. It permits a number of possible uses
  and each designer can look for a solution appropriate to his personal style.
</p>

<!-- Secondary body -->
<p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[60ch]">
  Supporting text at reduced opacity.
</p>

<!-- Caption / label -->
<span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">
  Figure 01 — Basel, 1961
</span>

<!-- Mono -->
<code class="font-mono text-sm text-stone-900 dark:text-stone-50 bg-stone-100 dark:bg-stone-900 px-1.5 py-0.5">
  npx skills add adewale/swiss-poster-skill
</code>
```

---

## Poster Compositions

These are the signature patterns of the Swiss Poster style — compositions where elements deliberately escape their containers.

### Protected reading zone / contrast-channel pattern

Use this wrapper whenever a dramatic route, slash, giant word, photo, or diagram could collide with primary copy. The graphic can break the grid; the critical copy gets a quiet field and higher layer. Do not reduce the whole poster's contrast; allocate it into channels.

```html
<section data-reference="hofmann-figure-ground" class="relative min-h-[100svh] overflow-hidden bg-stone-50 text-stone-900">
  <!-- Dramatic signal: allowed to crop, overlap, and bleed. It is not the reading path. -->
  <div data-channel="dramatic" aria-hidden="true" class="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div class="absolute -right-[18vw] top-[12vh] h-[62vw] w-[62vw] rounded-full border-[2rem] border-[#C8102E]"></div>
    <div class="absolute left-[8vw] top-[46vh] h-3 w-[90vw] -rotate-6 bg-[#C8102E]"></div>
    <p data-channel="texture" class="absolute -left-[4vw] bottom-[6vh] text-[clamp(8rem,28vw,28rem)] font-bold leading-none tracking-[-0.1em] text-stone-900/[0.06]">
      SIGNAL
    </p>
  </div>

  <div class="relative z-10 grid min-h-[100svh] grid-cols-12 gap-6 px-6 py-8 md:px-12">
    <p class="col-span-5 text-[11px] uppercase tracking-widest text-stone-900/55">Basel / Public notice / 01</p>

    <!-- Critical signal: uninterrupted quiet field, strong local contrast, above graphic layer. -->
    <div class="relative z-40 col-span-12 mt-[18vh] max-w-[46rem] bg-stone-50/95 p-1 md:col-span-7">
      <h1 data-critical="title" class="text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.82] tracking-[-0.06em]">
        Clear title stays readable.
      </h1>
      <p data-critical="body" class="mt-5 max-w-[44ch] text-lg leading-snug text-stone-900/80">
        Body copy never sits directly on high-contrast mega-type, diagrams, or route lines.
      </p>
      <a data-critical="cta" class="mt-7 inline-flex min-h-[44px] items-center bg-stone-900 px-5 text-[11px] font-bold uppercase tracking-widest text-stone-50">
        Action remains clear
      </a>
    </div>
  </div>
</section>
```

### Source-ledger / encoded-diagram pattern

Use this when the source has tweets, images, historical facts, or a real system diagram. The visible result stays poster-like; the markup remains auditable.

```html
<section data-reference="matter-photomontage" class="relative min-h-[100svh] overflow-hidden bg-stone-50 text-stone-950">
  <div class="grid min-h-[100svh] grid-cols-12 gap-4 px-6 py-8 md:px-10">
    <figure data-image-role="place" class="col-span-12 overflow-hidden bg-stone-950 md:col-span-7">
      <img src="assets/venue.jpg" alt="County Hall view across the Thames" class="h-full w-full object-cover grayscale contrast-125" />
    </figure>

    <div class="relative z-40 col-span-12 bg-stone-50 p-6 md:col-span-5">
      <h1 data-critical="title" class="text-[clamp(3rem,9vw,7rem)] font-bold leading-[0.84] tracking-[-0.06em]">London Thread</h1>
      <p data-critical="body" class="mt-4 max-w-[34ch] text-lg font-semibold leading-snug">Six public notes become one evening map.</p>
      <ol class="mt-8 space-y-3 text-sm leading-tight">
        <li data-beat="01" data-source="tweet-01"><b>01</b> County Hall opens the sequence.</li>
        <li data-beat="02" data-source="tweet-02"><b>02</b> Prada marks the entrance.</li>
        <li data-beat="03" data-source="tweet-03"><b>03</b> Demos move from links to room.</li>
      </ol>
    </div>

    <svg data-channel="dramatic" data-encoding="tweet order → route position; topic → node shape" aria-hidden="true" class="pointer-events-none absolute inset-0 z-10">
      <!-- real diagram marks only; no decorative fake nodes -->
    </svg>
  </div>
</section>
```

```html
<!-- 1. Oversized type with overlapping accent block -->
<section class="relative py-32 overflow-hidden">
  <div class="absolute top-16 right-0 w-1/3 h-2/3 bg-[#C8102E]"></div>
  <div class="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
    <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Ausstellung</span>
    <h1 class="text-[clamp(4rem,12vw,14rem)] font-bold leading-[0.85] tracking-tighter mt-8 -mr-[5%]">
      NEUE<br>GRAFIK
    </h1>
    <p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[48ch] mt-8">
      Supporting description that stays within the grid.
    </p>
  </div>
</section>

<!-- 2. Split composition — dark/light halves with type crossing the boundary -->
<section class="relative min-h-[600px] overflow-hidden">
  <div class="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
    <div class="bg-stone-900 dark:bg-stone-100 p-8 md:p-16 flex items-end">
      <span class="text-xs tracking-widest uppercase text-stone-50/40 dark:text-stone-900/40">Zürich 1959</span>
    </div>
    <div class="bg-stone-50 dark:bg-stone-950 p-8 md:p-16 flex items-end">
      <p class="text-sm leading-relaxed text-stone-900/70 dark:text-stone-50/70 max-w-[36ch]">
        Body text in the light half.
      </p>
    </div>
  </div>
  <h2 class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl md:text-8xl font-bold text-white mix-blend-difference whitespace-nowrap z-10">
    KONTRAST
  </h2>
</section>

<!-- 3. Stacked layers with offset cards -->
<section class="relative py-32">
  <div class="max-w-6xl mx-auto px-4 md:px-8">
    <div class="relative h-[500px]">
      <div class="absolute top-0 left-0 w-64 md:w-80 h-72 md:h-80 bg-stone-900 dark:bg-stone-100 p-8 z-10">
        <span class="text-[11px] tracking-widest uppercase text-stone-50/40 dark:text-stone-900/40 font-medium">Layer 01</span>
        <h3 class="text-2xl font-light text-stone-50 dark:text-stone-900 mt-auto">Depth</h3>
      </div>
      <div class="absolute top-16 left-16 w-64 md:w-80 h-72 md:h-80 bg-[#C8102E] p-8 z-20">
        <span class="text-[11px] tracking-widest uppercase text-white/40 font-medium">Layer 02</span>
        <h3 class="text-2xl font-light text-white mt-auto">Through</h3>
      </div>
      <div class="absolute top-32 left-32 w-64 md:w-80 h-72 md:h-80 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-8 z-30">
        <span class="text-[11px] tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium">Layer 03</span>
        <h3 class="text-2xl font-light text-stone-900 dark:text-stone-50 mt-auto">Overlap</h3>
      </div>
    </div>
  </div>
</section>

<!-- 4. Full-bleed accent band with breakout type -->
<section class="bg-[#C8102E] py-24 md:py-32 relative overflow-hidden">
  <div class="absolute top-0 left-0 text-[clamp(10rem,30vw,30rem)] font-bold leading-none text-white/10 select-none pointer-events-none -translate-y-1/4">
    CH
  </div>
  <div class="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
    <span class="text-xs tracking-widest uppercase text-white/40">Helvetica / 1957</span>
    <h2 class="text-5xl md:text-7xl font-light text-white mt-6 leading-tight">
      The typeface<br>that defined<br>a century.
    </h2>
  </div>
</section>

<!-- 5. Rotated sidebar label with content -->
<section class="py-24">
  <div class="max-w-6xl mx-auto px-4 md:px-8">
    <div class="grid grid-cols-12 gap-4 md:gap-8">
      <div class="hidden md:block col-span-1 relative">
        <span class="text-[11px] tracking-widest uppercase text-stone-900/30 dark:text-stone-50/30 -rotate-90 origin-top-left absolute top-0 left-4 whitespace-nowrap font-medium">
          Typografie — 03
        </span>
      </div>
      <div class="col-span-12 md:col-span-11">
        <h2 class="text-4xl md:text-5xl font-light tracking-tight text-stone-900 dark:text-stone-50">Section Content</h2>
        <p class="text-base leading-relaxed text-stone-900/70 dark:text-stone-50/70 mt-6 max-w-[60ch]">
          Content that lives within the grid while the label escapes vertically.
        </p>
      </div>
    </div>
  </div>
</section>
```

---

## Dramatic Poster Archetypes

Use these when the first attempt feels like a tidy Swiss webpage rather than a poster. Each archetype has one dominant anchor, an edge crop, microtype, and a hard field/graphic system.

### 1. Cropped word + corner metadata

```html
<section class="relative min-h-[100svh] overflow-hidden bg-stone-50 text-stone-900 px-4 md:px-8 py-8 font-sans">
  <div class="grid grid-cols-12 gap-4 md:gap-8 min-h-[calc(100svh-4rem)]">
    <p class="col-span-6 md:col-span-2 text-[11px] leading-none tracking-widest uppercase text-stone-900/50">Kunsthalle<br>Basel<br>1962</p>
    <p class="col-span-6 md:col-span-2 md:col-start-11 text-right text-[11px] leading-none tracking-widest uppercase text-stone-900/50">Fig. 01<br>Grid 12<br>Offset</p>
    <div class="col-span-12 self-end relative">
      <div class="absolute -right-[12vw] bottom-[12%] h-[38vh] w-[68vw] bg-[#C8102E] z-0"></div>
      <h1 class="relative z-10 -ml-[0.07em] whitespace-nowrap text-[clamp(5.5rem,24vw,24rem)] font-bold uppercase leading-[0.78] tracking-[-0.08em]">
        FORM
      </h1>
    </div>
    <p class="col-span-12 md:col-span-4 md:col-start-8 self-start max-w-[42ch] text-base leading-relaxed text-stone-900/70">
      One cropped word does the visual labor. The content stays small and gridded.
    </p>
  </div>
</section>
```

### 2. Giant date / event poster

```html
<section class="relative min-h-[90svh] overflow-hidden bg-stone-900 text-stone-50 px-4 md:px-8 py-8">
  <div class="absolute inset-y-0 right-0 w-[32vw] bg-[#C8102E]"></div>
  <div class="grid grid-cols-12 gap-4 md:gap-8 relative z-10 min-h-[calc(90svh-4rem)]">
    <div class="col-span-12 md:col-span-7 self-center overflow-hidden">
      <p class="-ml-[0.08em] whitespace-nowrap text-[clamp(9rem,34vw,34rem)] font-bold leading-[0.75] tracking-[-0.1em]">19</p>
      <p class="-mt-[0.18em] ml-[0.18em] whitespace-nowrap text-[clamp(9rem,34vw,34rem)] font-thin leading-[0.75] tracking-[-0.1em]">62</p>
    </div>
    <div class="col-span-12 md:col-span-4 md:col-start-9 self-end pb-8">
      <p class="text-[11px] uppercase tracking-widest leading-normal text-stone-50/50">Zürich / Tonhalle / 20:00 / Grid 04</p>
      <h2 class="mt-8 text-4xl md:text-6xl font-bold leading-none tracking-tight">Musica Viva</h2>
      <a class="mt-8 inline-flex min-h-11 items-center bg-stone-50 px-6 text-sm font-medium uppercase tracking-widest text-stone-900">Reserve</a>
    </div>
  </div>
</section>
```

### 3. Masked photo as graphic material

```html
<section class="relative min-h-[85svh] overflow-hidden bg-stone-50 text-stone-900">
  <div class="grid grid-cols-12 min-h-[85svh]">
    <div class="col-span-12 md:col-span-7 relative overflow-hidden bg-stone-950">
      <img src="/image.jpg" alt="" class="absolute inset-0 h-full w-full object-cover grayscale contrast-150 opacity-80 mix-blend-screen" />
      <div class="absolute bottom-0 left-0 h-24 w-full bg-[#C8102E]/90 mix-blend-multiply"></div>
    </div>
    <div class="col-span-12 md:col-span-5 relative p-6 md:p-10 overflow-hidden">
      <p class="text-[11px] tracking-widest uppercase text-stone-900/50">Photo becomes field / not card</p>
      <h2 class="absolute -left-[0.08em] bottom-8 whitespace-nowrap text-[clamp(5rem,16vw,18rem)] font-bold leading-[0.8] tracking-[-0.08em]">CUT</h2>
    </div>
  </div>
</section>
```

### 4. Rhythm / optical vibration layer

```html
<section class="relative overflow-hidden bg-stone-50 text-stone-900 px-4 md:px-8 py-24 md:py-32">
  <div class="absolute inset-0 text-stone-900/[0.08] pointer-events-none"
    style="background-image: repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 9px)"></div>
  <div class="absolute -right-[20%] -bottom-[40%] h-[75vw] w-[75vw] rounded-full border-[12px] border-[#C8102E]"></div>
  <div class="grid grid-cols-12 gap-4 md:gap-8 relative z-10">
    <p class="col-span-12 md:col-span-2 text-[11px] uppercase tracking-widest text-stone-900/50">Line field / moiré / repetition</p>
    <h2 class="col-span-12 md:col-span-8 md:col-start-4 text-[clamp(4rem,14vw,15rem)] font-bold uppercase leading-[0.85] tracking-[-0.06em]">Signal</h2>
  </div>
</section>
```

---

## Buttons

```html
<!-- Primary: filled accent -->
<button class="px-6 py-3 bg-[#C8102E] text-white text-sm font-medium tracking-wide hover:bg-[#C8102E]/90 active:scale-[0.98] transition-all duration-150">
  Get started
</button>

<!-- Secondary: ghost with accent border -->
<button class="px-6 py-3 border border-[#C8102E] text-[#C8102E] text-sm font-medium tracking-wide hover:bg-[#C8102E]/10 active:scale-[0.98] transition-all duration-150">
  Learn more
</button>

<!-- Tertiary: text only -->
<button class="px-6 py-3 text-stone-900 dark:text-stone-50 text-sm font-medium tracking-wide hover:text-[#C8102E] transition-colors duration-150">
  View details →
</button>

<!-- Neutral: filled stone -->
<button class="px-6 py-3 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 text-sm font-medium tracking-wide hover:bg-stone-800 dark:hover:bg-stone-200 active:scale-[0.98] transition-all duration-150">
  Download
</button>

<!-- Poster: oversized accent button -->
<button class="px-12 py-6 bg-[#C8102E] text-white text-lg font-medium tracking-wide hover:bg-[#C8102E]/90 active:scale-[0.98] transition-all duration-150">
  Enter Exhibition →
</button>
```

Note: No `rounded-*` on buttons. Swiss style is rectilinear.

---

## Cards

```html
<!-- Basic card -->
<div class="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8">
  <span class="text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40">Category</span>
  <h3 class="text-xl font-normal text-stone-900 dark:text-stone-50 mt-4 leading-snug">Card Title</h3>
  <p class="text-sm leading-relaxed text-stone-900/70 dark:text-stone-50/70 mt-3 max-w-[48ch]">
    Supporting description text.
  </p>
</div>

<!-- Card with accent top border -->
<div class="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 border-t-2 border-t-[#C8102E] p-8">
  ...
</div>

<!-- Poster card — oversized number with offset content -->
<div class="relative bg-stone-100 dark:bg-stone-900 p-8 pt-20 border border-stone-200 dark:border-stone-800">
  <span class="absolute -top-6 -left-2 text-8xl font-bold text-[#C8102E]/20 select-none leading-none">01</span>
  <h3 class="text-xl font-normal text-stone-900 dark:text-stone-50 leading-snug relative z-10">Card Title</h3>
  <p class="text-sm leading-relaxed text-stone-900/70 dark:text-stone-50/70 mt-3 max-w-[48ch] relative z-10">
    Supporting description text.
  </p>
</div>

<!-- Horizontal rule card / entry -->
<div class="border-t border-stone-200 dark:border-stone-800 py-6 flex items-start justify-between gap-8">
  <div>
    <h3 class="text-base font-normal text-stone-900 dark:text-stone-50">Entry title</h3>
    <p class="text-sm text-stone-900/60 dark:text-stone-50/60 mt-1">Subtitle or metadata</p>
  </div>
  <span class="text-sm text-stone-900/40 dark:text-stone-50/40 shrink-0">2024</span>
</div>
```

---

## Navigation

```html
<!-- Top nav -->
<nav class="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
  <div class="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
    <a href="/" class="text-sm font-medium tracking-widest uppercase text-stone-900 dark:text-stone-50">
      Swiss Poster
    </a>
    <div class="hidden md:flex items-center gap-8">
      <a href="#" class="text-sm text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Typography</a>
      <a href="#" class="text-sm text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 transition-colors">Grid</a>
      <a href="#" class="text-sm text-[#C8102E]">Color</a>
    </div>
  </div>
</nav>

<!-- Sidebar nav -->
<nav class="border-r border-stone-200 dark:border-stone-800 w-48 min-h-screen p-8">
  <ul class="space-y-1">
    <li>
      <a href="#" class="block text-sm text-[#C8102E] font-medium py-1.5">Active item</a>
    </li>
    <li>
      <a href="#" class="block text-sm text-stone-900/60 dark:text-stone-50/60 hover:text-stone-900 dark:hover:text-stone-50 py-1.5 transition-colors">Inactive item</a>
    </li>
  </ul>
</nav>
```

---

## Badges & Labels

```html
<!-- Neutral badge -->
<span class="inline-block px-2 py-0.5 text-[11px] font-medium tracking-widest uppercase bg-stone-200 dark:bg-stone-800 text-stone-900/70 dark:text-stone-50/70">
  Sans-serif
</span>

<!-- Accent badge -->
<span class="inline-block px-2 py-0.5 text-[11px] font-medium tracking-widest uppercase bg-[#C8102E]/10 text-[#C8102E]">
  Featured
</span>

<!-- Outline badge -->
<span class="inline-block px-2 py-0.5 text-[11px] font-medium tracking-widest uppercase border border-stone-300 dark:border-stone-700 text-stone-900/60 dark:text-stone-50/60">
  Draft
</span>
```

---

## Dividers

```html
<!-- Standard hairline -->
<hr class="border-none border-t border-stone-200 dark:border-stone-800 my-16">

<!-- Bold accent rule (poster weight) -->
<div class="w-16 h-1.5 bg-[#C8102E] my-8"></div>

<!-- Full-width bold rule -->
<div class="w-full h-px bg-stone-900 dark:bg-stone-50 my-16"></div>

<!-- Diagonal accent slash (poster decoration) -->
<div class="w-full h-1 bg-[#C8102E] -rotate-2 scale-110 origin-center my-16"></div>
```

---

## Form Elements

```html
<!-- Input -->
<div class="flex flex-col gap-2">
  <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">
    Full name
  </label>
  <input
    type="text"
    class="border border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 placeholder:text-stone-900/30 dark:placeholder:text-stone-50/30 transition-colors"
    placeholder="Josef Müller-Brockmann"
  >
</div>

<!-- Select -->
<div class="flex flex-col gap-2">
  <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">
    Country
  </label>
  <select class="border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 appearance-none">
    <option>Switzerland</option>
  </select>
</div>

<!-- Textarea -->
<div class="flex flex-col gap-2">
  <label class="text-xs tracking-widest uppercase text-stone-900/60 dark:text-stone-50/60 font-medium">
    Message
  </label>
  <textarea
    rows="4"
    class="border border-stone-200 dark:border-stone-800 bg-transparent text-stone-900 dark:text-stone-50 text-base px-4 py-3 outline-none focus:border-stone-900 dark:focus:border-stone-50 resize-none transition-colors"
  ></textarea>
</div>

<!-- Checkbox -->
<label class="flex items-start gap-3 cursor-pointer group">
  <input type="checkbox" class="mt-0.5 w-4 h-4 border border-stone-300 dark:border-stone-700 accent-[#C8102E]">
  <span class="text-sm text-stone-900/70 dark:text-stone-50/70 group-hover:text-stone-900 dark:group-hover:text-stone-50 transition-colors">
    I agree to the terms
  </span>
</label>
```

---

## Tables

```html
<div class="overflow-x-auto">
  <table class="w-full text-sm border-t border-stone-200 dark:border-stone-800">
    <thead>
      <tr class="border-b border-stone-200 dark:border-stone-800">
        <th class="text-left text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3 pr-8">Font</th>
        <th class="text-left text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3 pr-8">Year</th>
        <th class="text-left text-xs tracking-widest uppercase text-stone-900/40 dark:text-stone-50/40 font-medium py-3">Origin</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-stone-100 dark:border-stone-900 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
        <td class="py-4 pr-8 text-stone-900 dark:text-stone-50 font-normal">IBM Plex Sans</td>
        <td class="py-4 pr-8 text-stone-900/60 dark:text-stone-50/60">2017</td>
        <td class="py-4 text-stone-900/60 dark:text-stone-50/60">USA</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Code Block

```html
<pre class="bg-stone-900 dark:bg-stone-950 text-stone-50 p-8 overflow-x-auto">
  <code class="font-mono text-sm leading-relaxed">
npx skills add adewale/swiss-poster-skill
  </code>
</pre>
```

---

## Hero Section — Poster Style

```html
<section class="relative min-h-screen flex items-end bg-stone-50 dark:bg-stone-950 overflow-hidden">
  <!-- Oversized background type — VISIBLE at 8%+, cropped by left edge -->
  <div class="absolute top-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
    <div class="text-[clamp(8rem,22vw,26rem)] font-bold leading-[0.85] text-stone-900/[0.08] dark:text-stone-50/[0.08] -ml-[8%] mt-12 tracking-tighter">
      SWISS<br>POSTER
    </div>
  </div>

  <!-- Rotated readable type along left edge -->
  <div class="absolute top-[30%] left-6 pointer-events-none hidden md:block">
    <span class="text-sm font-bold tracking-[0.3em] uppercase text-[#C8102E] -rotate-90 origin-top-left block whitespace-nowrap">Expressive Typography</span>
  </div>

  <!-- Geometric composition — shapes escaping the frame -->
  <div class="absolute -right-[15vw] top-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full border-[3px] border-[#C8102E]/30 pointer-events-none"></div>
  <div class="absolute top-0 right-0 w-[35vw] max-w-[500px] h-[45vh] bg-[#C8102E] pointer-events-none" style="clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 70%)"></div>
  <div class="absolute top-[20%] -right-[10%] w-[80vw] h-3 bg-[#C8102E]/20 -rotate-[18deg] origin-right pointer-events-none hidden md:block"></div>

  <div class="max-w-6xl mx-auto px-4 md:px-8 pb-16 md:pb-24 pt-40 relative z-10 w-full">
    <span class="text-[11px] tracking-widest uppercase font-medium text-stone-900/50 dark:text-stone-50/50">Swiss Poster Design System</span>
    <div class="w-16 h-1.5 bg-[#C8102E] mt-6 mb-10"></div>
    <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[0.9] max-w-4xl">
      Elements <span class="text-[#C8102E]">escape</span><br>the grid.
    </h1>
    <p class="text-lg leading-relaxed text-stone-900/60 dark:text-stone-50/60 mt-8 max-w-[52ch]">
      Swiss poster design for your AI agent, in Tailwind CSS.
    </p>
    <div class="flex flex-wrap items-center gap-4 mt-12">
      <button class="px-8 py-4 bg-stone-900 dark:bg-stone-50 text-stone-50 dark:text-stone-900 text-sm font-medium tracking-wide hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors">
        Get started
      </button>
      <button class="px-8 py-4 border border-stone-200 dark:border-stone-800 text-stone-900/60 dark:text-stone-50/60 text-sm font-medium tracking-wide hover:border-stone-900 dark:hover:border-stone-50 transition-colors">
        View examples
      </button>
    </div>
  </div>
</section>
```
