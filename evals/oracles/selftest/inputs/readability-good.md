Audit: the giant anchor overlaps the title and the body copy, so the critical copy is unreadable where they collide.

Fix it without losing the poster:
- Keep a protected reading zone for title, date and CTA; nothing crosses it.
- Move the anchor behind the text layer (`aria-hidden="true"`, `pointer-events-none`, `z-0`) and put the critical copy on `relative z-40`.
- Back the critical copy with a solid field (`bg-stone-50`) so the text passes AA contrast.
- Preserve the drama: crop the anchor at the edge instead of shrinking it.
- Keep `grid-cols-12` and `overflow-hidden`.
