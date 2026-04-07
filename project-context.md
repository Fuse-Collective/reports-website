# Project Context — Reports Website

## Brand
- Name: Reports Website
- Goals: TBD
- Audience: TBD

## Tech Stack
- Framework: Astro 5
- Styling: Tailwind CSS v4 (@theme tokens)
- Verification: Playwright

## Design System
→ design.md (Tier 1 — single source of truth)

## Design Tokens
20 color tokens, 14 type scale tokens, 8 spacing tokens, 2 radius tokens. Font: Poppins (400, 600, 700).

## Components
TBD

## Known Issues
None

## Verification Settings
- css_spec_test: true
- axe_per_section: true
- playwright_vrt: true
- figma_export: true

## Responsive Strategy
```yaml
responsive_strategy:
  decided_at: "Build-Figma - HeroSection"
  container:
    model: fluid-max-width
    max_width: 1575px
    padding: clamp(1rem, 5vw, 8.25vw)  # single fluid token, no breakpoint needed
  breakpoints:
    primary: lg
  typography:
    approach: fixed
    applies_to: [H1, body, CTA-link]
  spacing:
    approach: fixed
    applies_to: section-padding
    fixed_elements: [component-gaps]
  layout_transitions:
    - section: HeroSection
      pattern: "1-col → 2-col (Asymmetric Dialogue + cards side-by-side)"
      breakpoint: lg
    - section: Nav
      pattern: "hamburger → full menu"
      breakpoint: lg
  full_bleed_sections: []
  section_overrides: {}
```

## Session State
2026-04-03 — 2/8 sections built (OfferCards + Services). Surface system, SectionIntro, collapsed borders, subgrid, astro-icon, preview switcher. Next: PainPointSection or TestimonialSection.
