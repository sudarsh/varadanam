# Design System Document: The Monolithic Interface

## 1. Overview & Creative North Star
The creative North Star for this design system is **"The Architectural Precision."** 

We are moving away from the cluttered, "box-heavy" look of traditional admin panels. Instead, we treat the UI as a high-end editorial workspace. By drawing inspiration from the hyper-clean layouts of Linear and Stripe, we focus on extreme legibility, intentional white space, and a sophisticated tonal palette. The system balances the warmth of a stone-based neutral palette with a sharp, high-energy orange accent to drive focus. 

The goal is to make complex administrative tasks feel rhythmic and effortless through a "Layered Monolith" approach—where hierarchy is defined by depth and tone rather than lines and boxes.

---

## 2. Colors
Our color philosophy centers on a high-contrast sidebar against a light-filled workspace. We use a palette derived from warm stones and raw ores.

### Palette Breakdown
- **Primary (`#994700` / `#E97316`):** The "Action Nerve." Used only for primary intent.
- **Surface Hierarchy:** 
    - **Sidebar Background:** `#1C1917` (The Anchor)
    - **Page Background:** `surface` (`#fff8f5`)
    - **Workspace Surface:** `surface_container_lowest` (`#ffffff`)
- **Tonal Layers:** Use `surface_container_low` (`#faf2ee`) and `surface_container_high` (`#eee7e3`) to differentiate nested content.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for sectioning. To define a new area, use a background shift. For example, a data table header should sit on `surface_container` while the rows rest on `surface_container_lowest`. Let the edges of color create the "line."

### The Glass & Gradient Rule
While the system is "flat," CTAs and floating modals should use a subtle vertical gradient (e.g., `primary_container` to `primary`) to provide a tactile, premium feel. For floating dropdowns, employ a **Glassmorphism** effect using `surface` at 80% opacity with a `20px` backdrop blur to maintain the architectural depth.

---

## 3. Typography
We utilize a dual-font system to separate human-readable content from machine-generated data.

- **Inter (UI & Editorial):** Our workhorse. Used for all labels, titles, and body text.
    - **Display-LG (3.5rem):** For hero metrics and "at-a-glance" status.
    - **Headline-SM (1.5rem):** For primary page titles. 
    - **Body-MD (0.875rem):** The standard for all dashboard content—optimized for density and legibility.
- **JetBrains Mono (Technical):** Reserved exclusively for Transaction IDs, Hash values, and Code snippets. It signals to the user that "this is raw data."

---

## 4. Elevation & Depth
In this design system, shadows are treated as ambient occlusion, not structural elements.

### The Layering Principle
Depth is achieved through **Tonal Stacking**:
1. **Level 0 (Base):** `surface` (`#fff8f5`) - The main page canvas.
2. **Level 1 (Sections):** `surface_container_low` (`#faf2ee`) - Used for grouping layout blocks.
3. **Level 2 (Cards):** `surface_container_lowest` (`#ffffff`) - The primary interactive surface.

### Ambient Shadows
When an element must float (Modals/Popovers), use a "Soft Ambient" shadow:
`box-shadow: 0 10px 30px -10px rgba(28, 25, 23, 0.08);`
The shadow color is a desaturated version of our `on_surface` color, making it feel integrated into the "stone" environment.

### The "Ghost Border" Fallback
If contrast is insufficient (e.g., a white card on a light grey background), use a **Ghost Border**: `outline_variant` at 15% opacity. It should be barely visible, acting as a hint rather than a hard boundary.

---

## 5. Components

### Buttons
- **Primary:** Solid `primary_container` (`#E97316`) with `on_primary` (`#ffffff`) text. 6px radius.
- **Secondary:** `outline` border (1px) with `primary` text. No background fill unless hovered.
- **Tertiary:** Ghost style. No border, no background. Becomes `surface_container_low` on hover.

### Input Fields
- **Default State:** `surface_container_lowest` background with a 1px `outline_variant` border.
- **Focus State:** 1px `primary` border with a subtle orange outer glow (2px, 10% opacity).
- **Typography:** Always use `body-md` for input text and `label-sm` for floating labels.

### Data Tables
- **Architecture:** No outer borders.
- **Headers:** `label-md` uppercase text on a `surface_container` background.
- **Rows:** Subtle dividers using `surface_container_high` (0.5px thickness). 
- **Data:** Use `JetBrains Mono` for all ID columns to ensure character alignment.

### Chips & Badges
- **Status:** Use a soft-fill approach. Success badges should use a light green background with dark green text (`on_success_container`). Avoid high-saturation "traffic light" colors; keep them muted and professional.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** Use wide margins for page titles and tighter margins for data grids to create visual interest.
- **Use "Space as Structure":** If two elements feel cluttered, increase the gap before adding a line.
- **Contextual Monospacing:** Use JetBrains Mono for anything that could be copied/pasted into a terminal or ledger.

### Don’t:
- **Don't use pure black:** Use `#1C1917` for all "dark" elements. It feels more organic and premium.
- **Don't use standard shadows:** Avoid the default CSS `box-shadow: 0 2px 4px`. It looks "template-like."
- **Don't over-round:** Stick strictly to the radius scale (6px/8px/10px). Never use fully rounded "pill" buttons unless they are tags or chips.

### Accessibility Note:
Ensure all text on `primary` (Orange) maintains a contrast ratio of at least 4.5:1. When using secondary text (`#78716C`), ensure it is only used for non-critical descriptions.