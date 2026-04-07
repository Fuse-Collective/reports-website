# web-developer

> **For Claude Code / IDE**: This is your entry point. Read this first to activate the agent.

## Agent

- `agents/web-developer/agent.md` — Multi-source design system extraction and Astro 5 + Tailwind v4 component builds. Supports Figma, HTML prototypes, live sites, manual specs, and creative design from seed (brand colors, mood, references). Section by section with user verification at each STOP. IDE/CLI only.

## References

- `agents/web-developer/references/` — domain knowledge, methodology, templates, checklists

## Preferences

```yaml
preferences:
  language: pl
  work_mode: normal
  verification:
    css_spec_test: true
    axe_per_section: true
    playwright_vrt: true
  output:
    process: chat
    deliverable: local
```

## Compound Learning

Site-level learnings file captures decisions, mistakes, and patterns discovered during builds.

**Location:** `docs/LEARNINGS.md`

**Structure:**
- **Quick Reference** (góra) — skategoryzowane dojrzałe reguły do szybkiego skanowania. Format: `**Pogrubiona reguła.** Wyjaśnienie. — Sesja: [data]`
- **Instrukcja post-session** (środek) — 3 kroki do wykonania po każdej sesji
- **Session Log** (dół) — chronologiczne wpisy ze statusem (raw → verified → migrated). Historia — nie usuwać.

**When to read:** At session start — before building. Skanuj Quick Reference pod kątem aktualnej pracy.

**When to write:** After each STOP checkpoint — check if a learning emerged. If yes, append to Session Log.

**Post-session (ZAWSZE po zakończeniu sesji budowania):**
1. **Session Log** — dopisz surowe learnings z sesji (status: raw)
2. **Quick Reference** — przenieś dojrzałe reguły (verified) do odpowiedniej kategorii. Nie duplikuj. Usuń reguły które okazały się błędne.
3. **Migrate** — gdy reguła jest uniwersalna → dodaj do `references/` agenta, oznacz jako `migrated` z plikiem docelowym.

**Status flow:**
- `raw` — captured in session, unverified
- `verified` — confirmed in practice (appeared ≥2× or survived review)
- `migrated` — written into agent references, entry stays as history

**To start:** Read `agents/web-developer/agent.md`, then tell the agent what you need.
