# Fuse Collective Design System

mode: extraction
source: scratch/DESIGN-merged.md

---

## 1. Overview & Creative North Star

**Metaphor: "The Confident Counselor"**

A senior strategy consultant's private office in a restored industrial loft — clean concrete floors, tall windows, flat northern light. Nothing decorative for its own sake. Every surface, typeface, and pixel of spacing communicates authority and competence.

The lone accent color (warm golden yellow) enters like a confident handshake: firm, warm, impossible to ignore, and gone before you overthink it. Emptiness is authority, not absence.

**Key Principles:**
- **Tonal Sectioning** — Sections separated by background color shifts (white → grey → dark → yellow), never lines/borders/shadows. No two adjacent sections share a background.
- **Asymmetric Dialogue** — 50/50 split: large headline left, descriptive body right. Conversational tension mirroring the consultative brand tone.

---

## 2. Colors & Surface Logic

### Color Token Table

| Token | HEX | Tailwind Utility | Role |
|-------|-----|------------------|------|
| `--color-surface-light` | #FFFFFF | `bg-surface-light` | Default page background, white content sections |
| `--color-surface-muted` | #EEEEEE | `bg-surface-muted` | Alternating sections, grey panels, FAQ |
| `--color-surface-dark` | #1D1D1B | `bg-surface-dark` | Dark statement sections, footer, pricing |
| `--color-surface-dark-card` | #2C3338 | `bg-surface-dark-card` | Cards on dark background (USP, footer) |
| `--color-surface-accent` | #FECD36 | `bg-surface-accent` | CTA sections, guarantee statements, primary buttons |
| `--color-on-surface-dark` | #191919 | `text-on-surface-dark` | Primary text on light/white/yellow surfaces |
| `--color-on-surface-light` | #FFFFFF | `text-on-surface-light` | Text on dark surfaces |
| `--color-on-surface-muted` | #333333 | `text-on-surface-muted` | Secondary text, FAQ answers |
| `--color-on-surface-secondary` | #444444 | `text-on-surface-secondary` | Slightly muted body text |
| `--color-on-surface-accent` | #191919 | `text-on-surface-accent` | Text on yellow surfaces |
| `--color-primary` | #FECD36 | `bg-primary`, `text-primary` | CTA buttons, bullet markers, decorators |
| `--color-on-primary` | #191919 | `text-on-primary` | Text on primary (yellow) buttons |
| `--color-primary-hover` | #191919 | `bg-primary-hover` | Hover state for primary CTA (inverts to dark) |
| `--color-outline-subtle` | #F2F2F2 | `border-outline-subtle` | Card borders on light surfaces |
| `--color-outline-light` | #D8D8D8 | `border-outline-light` | Horizontal rules, sub-section separators |
| `--color-outline-dark` | #191919 | `border-outline-dark` | Card borders on light surfaces (offer/pricing) |
| `--color-outline-white` | #FFFFFF | `border-outline-white` | Card borders on dark surfaces |
| `--color-link-dark` | #FECD36 | `text-link-dark` | Links on dark backgrounds |
| `--color-text-muted` | #808080 | `text-text-muted` | Tertiary/disabled text, meta text |

### Surface Rules

- **One Accent Rule:** Only accent color is `--color-primary` (#FECD36). No secondary accent. No blues, reds, greens, or gradients.
- **Tonal Sectioning Rule:** Sections separated exclusively by background color shifts. No border, decorative line, or gradient between sections. Exception: thin `<hr>` (0.8px `--color-outline-light`) within a single surface.
- **Yellow Discipline Rule:** Yellow appears on surfaces (buttons, accent sections) and as bullet markers — never on text/headings on light backgrounds. On dark backgrounds, permitted as link color.
- **Inverted Link Rule:** Dark surfaces → yellow links with underline. Light surfaces → near-black links without underline, with arrow (→) suffix.
- **Accent Surface Intent Rule:** Yellow CTA sections (page bottom, with buttons) vs. yellow statement sections (mid-page, no buttons). Never mix.

### Overlay

`:root { --overlay: rgba(29, 29, 27, 0.9); }` — Hero featured project overlay. Not in `@theme` (no utility namespace for rgba overlay).

---

## 3. Typography

### Font

- **Family:** Poppins (Google Fonts)
- **Weights:** 400 (Regular), 600 (Semibold — card headings only), 700 (Bold — inline emphasis & prices)

### Type Scale Table

| Token | Size | Weight | Line-Height | Tailwind Utility | Usage |
|-------|------|--------|-------------|------------------|-------|
| `--text-display-xl` | 4rem (64px) | 400 | 1.35 | `text-display-xl` | Featured project titles, footer large headings |
| `--text-display-lg` | 3.25rem (52px) | 400 | 1.42 | `text-display-lg` | Section headlines, page H1 |
| `--text-display-md` | 2.875rem (46px) | 400 | 1.42 | `text-display-md` | Subpage H1, CTA block headings |
| `--text-price-display` | 3.25rem (52px) | 700 | 1.42 | `text-price-display` | Price numbers only |
| `--text-headline-lg` | 2.75rem (44px) | 400 | 1.42 | `text-headline-lg` | Category headings, dark section headings |
| `--text-headline-md` | 2.375rem (38px) | 400 | 1.42 | `text-headline-md` | Category section headings on listings |
| `--text-headline-sm` | 1.875rem (30px) | 400 | 1.42 | `text-headline-sm` | Subheadings, testimonial intro, footer titles |
| `--text-title-lg` | 1.5rem (24px) | 400 | 1.6 | `text-title-lg` | CTA button text, FAQ questions, body lead |
| `--text-card-heading` | 1.5rem (24px) | 600 | 1.6 | `text-card-heading` | Article listing card headings (only 600 weight) |
| `--text-title-md` | 1.375rem (22px) | 400 | 1.6 | `text-title-md` | Offer card headings, testimonial names |
| `--text-body-lg` | 1.25rem (20px) | 400 | 1.55 | `text-body-lg` | Default body text, paragraphs, FAQ answers |
| `--text-body-md` | 1.125rem (18px) | 400 | 1.6 | `text-body-md` | Navigation links, secondary body |
| `--text-label-md` | 1rem (16px) | 400 | 1.6 | `text-label-md` | Card descriptions, footer small text, form labels |
| `--text-label-sm` | 0.875rem (14px) | 400 | 1.6 | `text-label-sm` | Cookie banner, legal copy |

### Typography Rules

- **Light Is Strong Rule:** All headings weight 400. Exceptions: `price-display` (700), `card-heading` (600). Never bold other headings.
- **No Uppercase Rule:** No `text-transform: uppercase` anywhere. Sentence/title case only.
- **Single Font Rule:** Poppins only. Never introduce a second font.
- **Inline Emphasis Rule:** Bold (`<strong>`, 700) within body text for key phrases. "Tematyka" label prefix uses 600.
- **Reduced Emphasis Pattern:** Secondary text uses `--color-text-muted` at same font-weight. Hierarchy via size and color, never weight reduction or italics.

---

## 4. Elevation & Depth

### Tonal Stack (Layering Principle)

Depth exclusively through tonal layering — surface color shifts — not shadows, blurs, or z-axis simulation.

| Level | Token | Usage |
|-------|-------|-------|
| Level 0 (Base) | `--color-surface-light` | Default content surface |
| Level 1 (Recessed) | `--color-surface-muted` | Alternating sections, FAQ |
| Level 2 (Elevated) | `--color-surface-dark` | Statement sections, footer |
| Level 2a (Dark Card) | `--color-surface-dark-card` | Cards within dark sections |
| Level 3 (Action) | `--color-surface-accent` | CTA sections, primary buttons |

### Elevation Rules

- **No Shadow Rule:** Zero `box-shadow` anywhere. Never add shadows to cards, buttons, navigation.
- **No Blur Rule:** No `backdrop-filter`, `blur()`, or glassmorphism.
- **No Gradient Rule:** No CSS gradients. All surfaces are flat, solid colors.
- **Structural Border Rule:** Borders only for grid cell boundaries. Always thin (0.8–1px solid), never decorative. Article listing cards have no borders.

---

## 5. Spacing Scale

| Token | px | rem | Tailwind Utility | Usage |
|-------|----|----|------------------|-------|
| `--spacing-tight` | 8px | 0.5rem | `gap-tight`, `p-tight` | Inline spacing, icon gaps |
| `--spacing-compact` | 16px | 1rem | `gap-compact`, `p-compact` | Intra-component spacing, FAQ Q→A gap |
| `--spacing-standard` | 24px | 1.5rem | `gap-standard`, `p-standard` | Paragraph spacing, list items |
| `--spacing-relaxed` | 32px | 2rem | `gap-relaxed`, `p-relaxed` | Heading-to-body gap, card grid column-gap |
| `--spacing-comfortable` | 48px | 3rem | `gap-comfortable`, `p-comfortable` | Card internal padding, button padding |
| `--spacing-breathing` | 55px | 3.4375rem | `px-breathing` | Page horizontal gutter |
| `--spacing-monumental` | 112px | 7rem | `py-monumental` | Section vertical padding |
| `--spacing-page-gutter` | 8.25vw | 8.25vw | `px-page-gutter` | Full page-level left/right padding |

### Vertical Rhythm Rule

1. Section padding top: `--spacing-monumental` (112px)
2. Headline
3. Gap: `--spacing-relaxed` (32px) between headline and body
4. Body text / subheading
5. Gap: `--spacing-comfortable` (48px) between body and component grid
6. Component area
7. Section padding bottom: `--spacing-monumental` (112px)

### CSS Modifier Classes

| Class | Effect |
|-------|--------|
| `no-padding-bottom` | Removes bottom padding |
| `no-padding-top` | Removes top padding |
| `full-width` | Removes horizontal constraints |

---

## 6. Layout System

### Container & Grid

- **Page gutter:** `--spacing-page-gutter` (8.25vw, ~138px on 1670px viewport)
- **Content width:** Fluid, ~1260–1378px on 1440–1670px viewport
- **Blog body:** Centered ~700px column
- **No explicit `max-width`** — containers fill gutter-constrained parent

### Primary Layout: Asymmetric Dialogue

50/50 two-column split. Left: large headline. Right: Fuse Brand Icon + descriptive body text.

### Column Patterns

| Pattern | Structure | Usage |
|---------|-----------|-------|
| Asymmetric Dialogue | 50% / 50% | Section headers across all pages |
| Offer Grid | 50% / 50%, bordered | Service category overview |
| USP Grid | 33% / 33% / 33% | Benefits grid on dark bg (2×3) |
| Pricing Cards | 33% / 33% / 33%, bordered | Service details |
| Testimonial Grid | 33% / 33% / 33% | Client testimonials (3 per row) |
| Article Listing | Single-column stacked | Blog/guide cards |
| Blog Body | Centered ~700px | Article content |
| Footer | 50% / 50% grid | Contact left, navigation right |

### Responsive

All multi-column layouts stack to single column on mobile.

---

## 7. Components

### 7.1 Navigation

Horizontal top bar. Logo left, text links right. Static (not sticky), transparent background.

- Links: `text-body-md` (18px), weight 400, `text-on-surface-dark`, no decoration
- Active: thin underline (`text-underline-offset: 4px`)
- Height: 112px
- Max 7 links. Hamburger on mobile.

**Rule:** Never has its own background. Never sticky. Never bold. Active = simple underline.

### 7.2 Buttons

**Variant A: Primary CTA (Yellow Pill)**
- Background: `bg-primary` | Text: `text-on-primary` | Border: 1.6px solid `border-primary`
- Border-radius: `rounded-button` (80px) | Font: `text-title-lg` (24px), weight 400
- Padding: 26px 48px

**Variant B: Dark CTA (Dark Pill)**
- Background: `bg-on-surface-dark` | Text: `text-on-surface-light`
- Used on yellow surfaces. Same dimensions as Primary.

**Variant C: Ghost Button (Outline Pill)**
- Background: transparent | Border: 1.6px solid matching text color
- On light: `border-on-surface-dark`. On dark: `border-on-surface-light`.

**Variant D: Text Link with Arrow**
- Inline text + right-arrow (→). No text-decoration.
- On light: `text-on-surface-dark`. On dark: `text-link-dark`.

**One CTA Rule:** Max one yellow pill per section. Product heroes: yellow pill + ghost vertically (24px gap). Dark CTA only on yellow surfaces. Text links are default navigation — never use filled button where text-link suffices.

### 7.3 Section Decorator — Arrow-in-Circle (Fuse Brand Icon)

SVG circle (~100px) with diagonal arrow (↘).

- **Variant A: Outline Circle** — thin 1px stroke, transparent fill. Heroes, section intros.
- **Variant B: Yellow-Filled Circle** — filled `bg-primary`, dark arrow. FAQ headers, category headings.
- **Variant C: Inline Heading Decorator** — outline, inline-left of heading with `gap-standard`.

**Filled Circle Exception:** Yellow-filled variant reserved for category labels and deep-page anchor headings. Heroes use outline exclusively.

### 7.4 Hero Section

- **Variant A: Homepage** — 50/50 split: project image with dark overlay left, muted bg with title + CTA right
- **Variant B: Subpage** — text-only Asymmetric Dialogue on `bg-surface-muted`
- **Variant C: Product Page** — dual CTA (yellow pill + ghost, 24px gap)
- **Variant D: Listing Page** — Asymmetric Dialogue, no CTAs
- **Variant E: Case Study** — project name left, description right

**Rule:** Homepage = image hero. Subpages = text-only. Never image hero or gradient on subpages.

### 7.5 Article Listing Card

Single-column on grey surface. Borderless tonal separation.

- Background: `bg-surface-light` on `bg-surface-muted` page
- Padding: `p-comfortable` (48px). No border, no radius, no shadow.
- Heading: `text-card-heading` (24px, weight 600)
- Description: `text-label-md` (16px)
- Arrow: large SVG (→), ~60–80px. Card width: ~1008px, centered.

**Borderless Card Rule:** Never borders, radius, or shadows. Tonal contrast only.

### 7.6 Category Section Heading

Yellow-filled circle (Variant B) inline-left + `text-headline-md` (38px). Flex, align-center, `gap-standard`.

### 7.7 Offer Grid

2-column bordered grid. Border: 0.8–1px solid `border-outline-dark`. Padding: `p-comfortable`.

### 7.8 Pricing Grid

- **Variant A: Dark Surface** — `bg-surface-dark`, white text, yellow pill CTAs
- **Variant B: Yellow Surface** — `bg-surface-accent`, white card interiors, dark pill CTAs
- Price: `text-price-display` (52px, bold 700)

**Price Anchoring Rule:** Left = value, right = cost. Dark surface → yellow CTAs; yellow surface → dark CTAs.

### 7.9–7.11 Icon Grid / USP Grid / Bonus Card Grid

- Icon Grid: 3×2 on dark, geometric icons (black + grey + yellow)
- USP Grid: 3×2 on dark, `bg-surface-dark-card` cards, `border-outline-white`
- Bonus Card Grid: 3-column on dark, `border-outline-white`

### 7.12 Pain Point Checklist

Arrow-in-circle (Variant C) + heading, 2-column yellow-square bullet checklist. Markers: `text-primary` (■).

### 7.13–7.14 Methodology Grid / Testimonial Grid

- Methodology: 2-column bordered, same as Offer Grid. Left = what, right = how.
- Testimonial: 3×3, `border-outline-subtle` horizontal rules. Monochrome black client logos. LinkedIn link per card.

### 7.15 CTA Accent Section (Yellow Band)

- **Variant A: CTA** — page bottom, `text-display-lg` + dark pill + ghost
- **Variant B: Statement** — mid-page, heading + body, no buttons

**Rule:** No buttons in statement sections. No missing buttons in CTA sections. Max one yellow section per page.

### 7.16–7.24 Remaining Components

- **Pricing/Pathway Cards:** 3-column bordered. Dark path = advisory, Yellow path = transformation.
- **Project Type Selection:** 2-column with portfolio images + circular yellow overlay CTA.
- **FAQ Section:** `bg-surface-muted`, yellow-filled circle + `text-display-lg` heading. Q: `text-title-lg`, A: `text-body-lg`. Dot separators (· · ·).
- **Author Box:** Name `text-title-md`, role `text-label-md`.
- **Blog Post Body:** Centered ~700px. Pullquote: `bg-surface-muted`, no border, `p-comfortable`.
- **Forms:** Bottom-border-only inputs. Full-width `bg-primary` submit button, `rounded-button`.
- **Horizontal Rule:** 0.8px solid `border-outline-light`, margin `my-monumental`.
- **Footer:** `bg-surface-dark`, 50/50 grid. Yellow links (`text-link-dark`). `text-display-xl` large heading. Social icons: outlined/white monochrome.

---

## 8. Iconography & Illustration

- Abstract, geometric, line-art: circles, rings, simple shapes. Custom SVG only.
- Service icons: yellow circles + dark outlines (light surfaces)
- Problem icons: dark strokes only (dark surfaces)
- Arrow-in-circle: 3 variants (see §7.3)
- Right-arrow (→): bold stroke, ~60–80px
- Social icons: solid white monochrome (footer)

**No Realistic Icons Rule:** Always abstract/geometric. Never realistic illustrations, photos as icons, or icon fonts.

---

## 9. Photography

- Real portfolio work only — never stock photography
- Border-radius: 0px always (sharp corners)
- No CSS filters, overlays (except homepage hero), blend modes
- Full color (monochrome not required)

---

## 10. Page Structure Templates

### Homepage Tonal Rhythm
```
surface-muted  → Hero (image left + text right)
surface-light  → Offer Grid
surface-muted  → Icon Grid (problems)
surface-dark   → USP cards
surface-light  → Testimonials
surface-muted  → Project Type Selection
surface-light  → Branding content
surface-accent → CTA Section
surface-dark   → Footer
```

### Subpage Tonal Rhythm
```
surface-muted  → Hero (text-only)
surface-light  → Offer Grid / Service overview
surface-dark   → Pricing (advisory path)
surface-accent → Pricing (transformation path)
surface-light  → Testimonials
surface-dark   → USP / Stats
surface-muted  → Content / FAQ
surface-accent → CTA Section
surface-dark   → Footer
```

### Listing Page (Poradniki) Tonal Rhythm
```
surface-muted  → Hero (no CTA)
surface-muted  → Category headings + article cards (white on grey)
surface-dark   → Footer (no yellow CTA)
```

---

## 11. Animation

Minimal. Transitions only:
- Button hover: `transition: 0.15s ease-in-out` (background, color, border-color)
- No scroll animations, parallax, or decorative motion

---

## 12. Do's and Don'ts

### Do's
- Use tonal sectioning for section separation
- Use Asymmetric Dialogue (50/50) as the default layout
- Use yellow only as accent surfaces and bullet markers
- Keep all headings weight 400 (except price-display 700, card-heading 600)
- Use `<details>/<summary>` for FAQ accordion (CSS-only, no JS)
- Use Poppins exclusively across all text

### Don'ts
- Never add `box-shadow` to any element
- Never use `backdrop-filter`, `blur()`, or gradients
- Never use `text-transform: uppercase`
- Never introduce a second accent color or font
- Never put borders on article listing cards
- Never use bold headings (except documented exceptions)
- Never use stock photography
- Never use icon fonts or realistic illustrations
- Never make navigation sticky
- Never apply yellow as text color on light surfaces
