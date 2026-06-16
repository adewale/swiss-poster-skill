# Lessons learned

## 2026-06-16 — Rebasing should preserve evidence, not just compile

### Answer

The rebase onto `origin/main` was not just a Git hygiene step. It needed evidence that the branch still produced the same public-facing poster artifacts and the same eval conclusions after absorbing upstream changes.

### What happened

- The rebase had expected conflicts in shared docs/eval/skill files because `origin/main` had advanced substantially.
- The resolved state kept upstream agent-compatibility/install-boundary context and the branch’s expanded eval, readability, artifact-fidelity, typography-breadth, and verification evidence.
- The post-rebase public tune benchmark stayed stable: `with_skill` mean objective `0.922`, `without_skill` mean objective `0.370`.
- The three-column contact sheet showed `before`, `after`, and `after rebase`; all ten pre-rebase after images were byte-identical to the after-rebase images in this evidence set.

### Concrete correction

- Added an after-rebase verification report and benchmark artifacts.
- Added `docs/pr/rebase-before-after-contact-sheet/` to make preservation visually auditable.
- Keep this pattern for future large rebases: conflict resolution + static checks + eval grading + visual artifact comparison.

## 2026-06-16 — Verification showed the skill is stronger but materially more expensive

### Answer

The current skill is measurably more effective than the no-skill baseline, but the improvement came with a real token-cost increase. That cost is not just documentation bloat: the always-loaded `SKILL.md` grew from roughly 2.5k to 6.5k harness-estimated tokens, and the full skill surface grew from roughly 9.9k to 18.4k tokens.

### What the verification showed

- Public tune evals: `with_skill` mean objective score `0.922` vs `without_skill` `0.370` across available artifacts.
- Remaining with-skill failures are concentrated in four known strict-oracle cases: Flue critical-text annotation/readability, travel photomontage lineage, lake-travel palette discipline, and print-proportion marker discipline.
- Ablation coverage is broad but not equally strong: `26/26` ablation IDs have targeted sentinel evidence, with `6` regressions, `16` saturated/no-drop cases, and `4` inconclusive cases where the with-skill baseline still fails.
- Full ablation generation is not practical as a routine local gate: current tune cases × ablations would require more than one thousand generations.
- Hidden holdout/holdback verification remains blocked unless private prompt/answer files are populated locally.

### Token-cost lesson

The added guidance improved historical breadth, rendered readability, source fidelity, and anti-template behavior, but `SKILL.md` is now carrying too much always-loaded policy. Future work should move rare/conditional material into focused references and keep the always-loaded file closer to an execution checklist:

- keep invariant rules in `SKILL.md`;
- move scholarly background and long lineage tables into conditional references;
- keep rendered-readability and source-fidelity requirements prominent because they catch real failures;
- profile token cost before and after every large guidance expansion.

### Concrete correction

- Added `docs/pr/verification/VERIFICATION_REPORT-20260616.md` with command evidence, eval summary, ablation summary, and token-cost comparison.
- Added profile artifacts comparing `origin/main` and current skill token counts.
- Treat token overhead as a PR review criterion, not an afterthought.

## 2026-06-16 — Academic literature: Swiss poster design is a contested public system, not a style preset

### Answer

The academic literature teaches a stronger lesson than “use more Helvetica” or “add more grid.” Swiss poster design is a historical system made from public display formats, printers, billposting infrastructure, clients, tourism and cultural diplomacy, schools, exhibitions, awards, collectors, and later canon-making. The International Typographic Style is one powerful chapter inside that system, not the system itself.

For the skill, the practical implication is: generate from **source, public function, lineage, format, client, production method, and audience**, not from a single visual recipe named “Swiss.”

### What the literature teaches us

| Literature finding | Lesson for the skill |
| --- | --- |
| “Swiss Graphic Design” is an ambiguous national label, used as style, practice, economic argument, and export brand. The canon was substantially built by practitioner-authored books, lectures, and exhibitions. | Treat canonical names as biased reference points, not as a complete map. Do not make “Swiss” mean one master narrative or one visual fingerprint. |
| Newer historiography argues for fragmented, archival, microhistorical study instead of one linear heroic history. | For each poster, build a private source ledger and choose a historically plausible micro-lineage from the prompt instead of defaulting to a generic Swiss look. |
| The Swiss poster format was materially shaped by Weltformat/F4, APG billposting, standard hoardings, public exhibitions, printers, and city regulation. | A generated poster should feel like a public artifact: fixed-format proportion, street-distance hierarchy, edge pressure, caption discipline, print logic, no landing-page layout. |
| National poster awards judged artistic approach, advertising force, and print quality, but also exercised stylistic authority. | Evals should not reward style compliance alone. They should measure communication, persuasion/source fidelity, and rendered print plausibility. |
| “Basel School,” “Zurich School,” and “Swiss Style” are simplifying labels that conceal multiple actors, courses, practices, and motives. | Use labels only as shorthand for specific compositional methods. Do not stamp visible designer/school names as proof of historical grounding. |
| Typography changed with typesetting, phototypesetting, desktop tools, and digital foundries. | Font choice is production history. IBM Plex/Helvetica-like grotesk is one lineage; other eras need condensed, serif/display, mono/technical, custom lettering, or image-led type. |
| Swiss Style abroad was also cultural diplomacy and commercial distinction — “Swiss made” as a quality/export claim. | Avoid the myth that Swiss design is neutral or apolitical. Preserve client, institution, sector, and purpose. |
| Museums, collectors, awards, and exhibitions shaped what survived and what became canonical. | Contact sheets and baselines are biased samples. Compare across object, travel, cultural, scientific, commercial, and contemporary poster genres. |
| Cultural-institution posters and ephemera act as interfaces or paratexts: communication, commentary, advertisement, and institutional self-definition. | Poster text is not filler. Dates, venues, sponsors, captions, and institutional details must remain readable and source-faithful. |
| Postcolonial critiques of modernist typography warn against treating unfamiliar scripts as pure form. | Never use non-Latin writing or source language as decorative texture. If a script appears, it must be meaningful, readable, and accurate. |

### Concrete correction

- Keep the existing typography-breadth fix, but extend it from font choice to **historiographic humility**.
- Add or preserve rules that make the poster prove its lineage visually rather than by metadata or visible designer-name garnish.
- Treat `840 × 1200` / poster-ratio output as a public-format artifact inspired by Weltformat/F4 discipline, not a responsive SaaS page.
- Add future evals for:
  - canon-collapse: all prompts become Müller-Brockmann/Weingart clichés;
  - infrastructure-collapse: output looks like a website instead of public poster matter;
  - non-Latin-script misuse: script treated as unreadable exotic texture;
  - client/context loss: venue, sponsor, date, route, institution, or source facts disappear;
  - false school labels: `Basel`, `Zurich`, `Geigy`, or `Matter` metadata without rendered visual evidence.

### Academic sources consulted

- Roland Früh, Ueli Kaufmann, Peter J. Schneemann, Sara Zeller, “Reading between the Lines of Swiss Graphic Design History,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0300>.
- Sandra Bischler, Sarah Klein, Jonas Niedermann, “A Visual Approach to the History of Swiss Graphic Design and Typography,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0100>.
- Sara Zeller, “Weltformat—Setting (Swiss) Display Aesthetics for Posters,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0316>.
- Constance Delamadeleine, “Swiss Made,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0209>.
- Constance Delamadeleine, “Typography,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0211>.
- Sarah Klein, Sandra Bischler, “The Basel School—Deconstructing Labels of Swiss Graphic Design Education,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0313>.
- Sara Zeller, “Die besten Plakate / Les meilleures affiches—The Early Years of the National Poster Award,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0302>.
- Sara Zeller, “Iconophile—Debating the Role of the Poster Collector Fred Schneckenburger in the Historiography of Swiss Graphic Design,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0304>.
- Robert Lzicar, “Popular Culture—How the Museum für Gestaltung Zürich Promoted the Everyday in Graphic Design,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0310>.
- Ueli Kaufmann, “Unfamiliar Writing Forms—Instances of Various Scripts in Swiss Graphic Designers’ Publications,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0314>.
- Roland Früh, Ueli Kaufmann, Peter J. Schneemann, Sara Zeller, “Kunsthalle Bern—Graphic Design in the Context of an Institution for Contemporary Art,” in *Swiss Graphic Design Histories* (2021), DOI: <https://doi.org/10.53788/SWBE0306>.
- Constance Delamadeleine, “Promoting Swiss Graphic Design and Typography Abroad: The Case of Paris in the 1960s,” *Design Issues* 37, no. 1 (2021), DOI: <https://doi.org/10.1162/desi_a_00623>.
- Robin Kinross, “Emil Ruder’s Typography and ‘Swiss typography’,” *Information Design Journal* 4, no. 2 (1984), DOI: <https://doi.org/10.1075/idj.4.2.04kin>.
- L. Mauderli, “The Graphic Collection of the Museum für Gestaltung Zürich,” *Journal of Design History* 15, no. 1 (2002), DOI: <https://doi.org/10.1093/jdh/15.1.47>.

## 2026-06-16 — Swiss poster typography is broader than a Helvetica/Plex default

### Answer

Yes. We were still too narrow in both typography and font choices.

The skill had already learned to avoid one visual template, but its concrete typography defaults still over-indexed on IBM Plex Sans, neo-grotesk hierarchy, giant cropped wordforms, and International Typographic Style cues. That is valid for a Zurich/Basel grid-era poster, but it is not broad enough for Swiss poster design as a whole.

IBM Plex Sans should be treated as an open implementation proxy, not as the historical voice of Swiss posters.

### What the research shows

Swiss poster design is plural across period, sector, image method, and typography:

| Period / lineage | Typographic lesson | Implication for the skill |
| --- | --- | --- |
| Sachplakat / object poster | Sparse product names, custom/commercial wordmarks, object-led hierarchy | Do not force giant neutral grotesk type; let the object and a direct name carry the poster |
| Travel / lithographic poster | Scenic image, chromolithographic color, destination lettering that may be condensed, serifed, painted, or custom | Permit serif/display/condensed/custom lettering and richer flat-ink palettes |
| Herbert Matter photomontage | Type integrates with cropped photography, scale shifts, diagonals, and overprint | Evaluate image/type authorship, not just grid/type tokens |
| Zurich / International Typographic Style | Akzidenz/Univers/Neue Haas/Helvetica-like rational sans, asymmetric grid, objective hierarchy | Keep IBM Plex/Hanken/Helvetica-like stacks here, but label it as one lineage |
| Basel / Hofmann/Ruder | Restrained grotesk, spacing, point-line-plane, negative space | Restraint can be drama; fewer weights and fewer effects can be more Swiss |
| Geigy / scientific/corporate diversity | Technical captions, narrow/mono/specimen labels, diagrams, scientific illustration, varied image systems | Add condensed/mono technical typography and measured plate grammar |
| Weingart / New Wave | Broken grid, fragments, spacing, halftone, type as image | Use typographic disruption only when subject warrants rupture |
| Troxler / contemporary cultural posters | Rhythm, illustration, custom display lettering, photo/type fusion | Permit event-specific display lettering and image-led composition beyond Helvetica modernism |

### Concrete correction

- Reframed IBM Plex Sans as a **safe open neo-grotesk fallback**, not the universal Swiss poster font.
- Added lineage-specific type guidance to `swiss-poster/SKILL.md`.
- Broadened implementation font categories:
  - neo-grotesk sans: IBM Plex Sans, Hanken Grotesk, Helvetica-like system fallbacks;
  - condensed sans: Barlow Condensed / Barlow;
  - serif/display proxy: IBM Plex Serif / Georgia;
  - mono/technical: IBM Plex Mono / ui-monospace;
  - custom lettering: CSS transforms, outlines, masks, layered fragments.
- Updated the config/reference docs so font loading and Tailwind families can support more than one IBM Plex treatment.

### Eval implication

Current period/genre evals catch some template collapse, but not font monoculture directly. We should add a future typography-breadth eval that fails if a mixed set of object, travel, scientific, New Wave, and contemporary cultural prompts all use the same IBM Plex Sans mega-word formula.

A useful suite would include:

1. Swiss object poster for a pocket watch, c. 1925 — object-led, sparse product name, custom/commercial wordmark.
2. Swiss alpine rail poster, c. 1910–1935 — lithographic travel lettering and scenic/image-led hierarchy.
3. Basel/Zurich concert or museum poster, c. 1960 — strict neo-grotesk grid.
4. Geigy/scientific specimen plate, c. 1958 — technical labels and measured captions.
5. Photomontage tourism/editorial poster, c. 1930s — type integrated with cropped imagery.
6. Basel New Wave typography workshop, c. 1974 — disrupted spacing/fragments/halftone.
7. Willisau/Troxler-like jazz/cultural poster — custom rhythm/image/type fusion.

### Sources consulted

- Museum für Gestaltung Zürich eMuseum — Swiss poster/design collection corpus: <https://www.emuseum.ch/>
- Swiss National Library poster collection: <https://www.nb.admin.ch/snl/en/home/collections/posters.html>
- Britannica on postwar Swiss graphic design / Zurich and Basel schools: <https://www.britannica.com/art/graphic-design/Postwar-graphic-design-in-Japan-and-Switzerland>
- AIGA medalist essays:
  - Josef Müller-Brockmann: <https://www.aiga.org/medalist-josefmullerbrockmann>
  - Armin Hofmann: <https://www.aiga.org/medalist-arminhofmann>
  - Herbert Matter: <https://www.aiga.org/medalist-herbertmatter>
  - Wolfgang Weingart: <https://www.aiga.org/medalist-wolfgangweingart>
- Lars Müller Publishers, *Corporate Diversity* / Geigy design: <https://www.lars-mueller-publishers.com/corporate-diversity>
- MoMA collection searches for Herbert Matter and Niklaus Troxler posters: <https://www.moma.org/search/?query=Herbert%20Matter%20Swiss%20poster>, <https://www.moma.org/search/?query=Niklaus%20Troxler>
- Cooper Hewitt collection searches for early object/travel poster references such as Baumberger/Cardinaux: <https://collection.cooperhewitt.org/search/collection/>
