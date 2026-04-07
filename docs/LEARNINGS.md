# Learnings — Reports Website

Compound learning file. Ładuj przy starcie sesji — przed budowaniem i decyzjami architektonicznymi.

**Flow:** sesja → Session Log (surowe wpisy) → review → Quick Reference (skategoryzowane reguły) → migrated do agent references

---

## Quick Reference

Skategoryzowane, dojrzałe reguły. Skanuj przed budowaniem sekcji.

### Ikony i SVG

- **Figma eksportuje ikony z hardcoded kolorami surface'u (np. `white` na dark).** Zamień `white`/`#fff` → `currentColor` po pobraniu. Żółte akcenty (`#FECD36`) zostaw — CSS override na accent surface je obsłuży. — Sesja: 2026-04-03
- **SVG przez `<img>` nie dziedziczy `currentColor`.** Tylko inline `<svg>` w DOM dziedziczy CSS `color`. Dla ikon reagujących na surface → `astro-icon` z `is:inline`. Dla statycznych → `<img>` lub domyślny `<use>`. — Sesja: 2026-04-02
- **astro-icon `<use>` tworzy shadow DOM — CSS potomkowy nie dosięga paths.** Gdy ikona musi reagować na surface variant → `is:inline`. Gdy statyczna → domyślny `<use>` (lepszy performance). — Sesja: 2026-04-02
- **Inline SVG z `currentColor` wymaga explicit color class na `<svg>` lub parencie.** `on-dark:text-on-surface-light` musi być na elemencie lub przodku — nie wystarczy że jest gdzieś wyżej w sekcji. — Sesja: 2026-04-02
- **Accent surface: żółte fill I stroke ikon znikają na żółtym tle.** Dwa CSS rules na `[data-surface="accent"]` — jeden na `[fill]`, drugi na `[stroke]` — nadpisują na biały. Ikony mogą mieć żółty zarówno jako fill (`#FECC00`) jak i stroke (`#FECD36`). — Sesja: 2026-04-03

### Surface system

- **Surface variants: `@custom-variant` + `data-surface`.** Sekcja ustawia `data-surface="dark|accent"`, children używają `on-dark:`/`on-accent:`. Zero prop drilling, natywne Tailwind v4, dowolna głębokość. — Sesja: 2026-04-02

### Responsive i spacing

- **`clamp()` na guttery i paddingi zamiast breakpointów.** `clamp(1rem, 5vw, 8.25vw)` dla page-gutter, `clamp(1rem, 3vw, 3rem)` dla card padding. Płynne skalowanie, zero performance cost. — Sesja: 2026-04-02

### Architektura komponentów

- **Layout (grid, flex) to nie komponent — inline Tailwind.** `grid grid-cols-1 lg:grid-cols-2` to 1 linia, nie `SectionHeader.astro`. Rule 4 z component-architecture.md. — Sesja: 2026-04-02
- **Rich HTML w kartach → slot, nie `set:html`.** Body z `<strong>` = colocated komponent ze `<slot />`. `set:html` omija XSS protections. Rule 3 Exception 2. — Sesja: 2026-04-02
- **Sekcje nazywaj wg zawartości, UI wg roli.** `OfferCardsSection` nie `HeroSection` (pozycyjna). `Button` nie `YellowPill` (zawartościowa). Rename to 2-3 pliki, czytelność codzienna. — Sesja: 2026-04-02

### Design system

- **design.md opisuje tokeny i reguły, nie komponenty.** Pre-extracted opisy komponentów (§7) zaburzały decyzje. Komponenty emergują z Figma, nie z opisu. — Sesja: 2026-04-02

### Card grids alignment

- **CSS subgrid na wyrównanie rzędów kart.** Gdy karty mają 3 sekcje (header, body, button) o różnej wysokości — parent grid definiuje `grid-template-rows: repeat(3, auto)`, karta: `grid-row: span 3; grid-template-rows: subgrid`. Rzędy synchronizują się między kolumnami. — Sesja: 2026-04-03

### Bordered grids

- **Collapsed borders: karty `border-t border-l`, wrapper `border-r border-b`.** Działa na dowolnej ilości kolumn i rzędów bez nth-child hacków. Każda wewnętrzna linia = dokładnie 1px. — Sesja: 2026-04-03

### Tooling

- **`rm -f` (bez `-r`) też jest destrukcyjny.** Hook `block-destructive.py` musi łapać `rm -f `, nie tylko `rm -rf`. — Sesja: 2026-04-02

---

## Instrukcja: Co zrobić PO sesji budowania

### Krok 1: Zapisz surowe learnings
Po każdym STOP checkpoint sprawdź czy pojawiło się nowe spostrzeżenie. Jeśli tak — dopisz do Session Log poniżej.

### Krok 2: Zaktualizuj Quick Reference
Przenieś dojrzałe reguły (verified) do odpowiedniej kategorii w Quick Reference:
- Format: `**Pogrubiona reguła.** Wyjaśnienie. — Sesja: [data]`
- Nie duplikuj — jeśli reguła już istnieje, zaktualizuj ją
- Usuń reguły które okazały się błędne w praktyce

### Krok 3: Migruj do agenta
Gdy reguła jest verified i uniwersalna (nie specyficzna dla projektu):
- Dodaj do odpowiedniego pliku w `references/` agenta
- Oznacz wpis w Session Log jako `migrated` z nazwą pliku docelowego

---

## Session Log

Chronologiczne wpisy ze statusem. Historia decyzji — nie usuwaj.

### 2026-04-02 `<img>` SVG nie dziedziczy currentColor
**Kontekst:** Brand icons z `stroke="currentColor"` renderowane przez `<img src="icon.svg">`
**Decyzja:** SVG przez `<img>` jest izolowanym dokumentem — `currentColor` nie dziedziczy z parenta. Trzeba inline SVG w DOM.
**Wpływ:** Używać `astro-icon` z `is:inline` dla ikon które muszą reagować na kolor kontekstu.
**Status:** verified

---

### 2026-04-02 astro-icon `<use>` vs `is:inline` — CSS nie dosięga symboli
**Kontekst:** CSS selector `[data-surface="accent"] [data-icon] path[fill]` nie działał na ikony renderowane przez `<use href="#symbol">`
**Decyzja:** `is:inline` wstawia pełny SVG w DOM. Domyślny `<use>` lepszy dla performance gdy nie trzeba CSS override.
**Wpływ:** Gdy ikona reaguje na surface → `is:inline`. Gdy statyczna → `<use>`.
**Status:** verified

---

### 2026-04-02 Surface variants — @custom-variant + data-surface
**Kontekst:** Sekcje z różnymi tłami — children muszą adaptować kolory.
**Decyzja:** Tailwind v4 `@custom-variant on-dark`. Sekcja ustawia `data-surface`, children używają `on-dark:`.
**Wpływ:** Dodać do coding-standards.md.
**Status:** verified

---

### 2026-04-02 Accent surface — ikony brand fill override
**Kontekst:** Na żółtym tle ikony z żółtym fill `#FECC00` zlewają się.
**Decyzja:** Globalne CSS rule na `[data-surface="accent"]` nadpisuje filled paths na biały.
**Wpływ:** Dokumentować w global.css.
**Status:** verified

---

### 2026-04-02 clamp() na page-gutter i card padding
**Kontekst:** Stałe guttery zostawiały za mało miejsca na tabletach.
**Decyzja:** `clamp(1rem, 5vw, 8.25vw)` dla page-gutter. `clamp(1rem, 3vw, 3rem)` dla card padding.
**Wpływ:** Rozważyć clamp() jako default w responsive-strategy.md.
**Status:** verified

---

### 2026-04-02 Naming convention — sekcje wg zawartości, nie pozycji
**Kontekst:** `HeroSection` implikowała top-of-page, ale sekcja pojawi się też w środku.
**Decyzja:** Rename na `OfferCardsSection`. Sekcje wg zawartości, UI wg roli.
**Wpływ:** Dodane do component-architecture.md Naming Conventions.
**Status:** migrated → component-architecture.md

---

### 2026-04-02 50/50 grid to nie komponent — Rule 4
**Kontekst:** SectionHeader opakowywał `grid grid-cols-1 lg:grid-cols-2`.
**Decyzja:** Usunięty. Layout = inline Tailwind. Spekulatywna ekstrakcja.
**Wpływ:** Dodane do component-architecture.md Strict Defaults.
**Status:** migrated → component-architecture.md

---

### 2026-04-02 Rich HTML w kartach → slot, nie set:html
**Kontekst:** Body kart z `<strong>` renderowane przez `set:html={body}`.
**Decyzja:** Colocated komponent ze `<slot />`.
**Wpływ:** Dodane do component-architecture.md Rule 3 Exception 2.
**Status:** migrated → component-architecture.md

---

### 2026-04-02 design.md §7 — usunąć pre-extracted opisy komponentów
**Kontekst:** §7 Components zawierał niezweryfikowane opisy z ekstrakcji obecnej strony.
**Decyzja:** Usunięty §7. Reguły przeniesione do §12. Komponenty budowane z Figma.
**Wpływ:** design.md = tokeny + reguły, nie opisy komponentów.
**Status:** verified

---

### 2026-04-02 Inline SVG currentColor wymaga explicit color class
**Kontekst:** Brand icon `<Icon is:inline>` miał czarny stroke na dark surface.
**Decyzja:** `on-dark:text-on-surface-light` musi być na `<svg>` lub jego parencie.
**Wpływ:** Checklist przy każdym inline SVG z currentColor.
**Status:** verified

---

### 2026-04-02 rm -f hook gap
**Kontekst:** `block-destructive.py` nie łapał `rm -f` (bez `-r`).
**Decyzja:** Dodany pattern `"rm -f "` do DANGEROUS_SUBSTRINGS.
**Wpływ:** Hook zaktualizowany i przetestowany.
**Status:** verified
