---
name: ACERO School Management
description: Modern Academy Terminal with dark-first slate surfaces, luminous emerald actions, and warm ember brand accents.
colors:
  primary: "#10b981"
  primary-gradient-end: "#0d9488"
  brand-ember: "#f97316"
  brand-peach: "#f9956c"
  surface-dark: "#020617"
  card-dark: "#0f172a"
  border-dark: "#1e293b"
  surface-light: "#f8fafc"
  card-light: "#ffffff"
  border-light: "#f1f5f9"
  text-heading: "#ffffff"
  text-body: "#cbd5e1"
  text-muted: "#64748b"
  accent-indigo: "#272f47"
  status-success: "#10b981"
  status-warning: "#f59e0b"
  status-danger: "#ef4444"
  status-info: "#3b82f6"
typography:
  display:
    fontFamily: "Outfit, sans-serif"
    fontSize: "clamp(2rem, 4vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  "2xl": "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#020617"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.text-body}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
---

# Design System: ACERO School Management

## Overview

**Creative North Star: "The Modern Academy Terminal"**

ACERO is an operational command center tailored for Spanish-speaking K-12 private and subsidized educational institutions. It reconciles administrative density with contemporary executive craft: dark-first obsidian slate foundations (`#020617`), vibrant emerald affirmative actions, and warm terracotta-ember branding cues that elevate school governance above generic corporate ERP software.

Rather than presenting an intimidating spreadsheet wall or a sterile clinical database, ACERO organizes complex academic schedules, student dossiers, attendance tallies, and tuition fee cycles into crisp, tactile planes. Information is structured for rapid visual scanning, high contrast legibility, and keyboard-efficient administrative execution.

**Key Characteristics:**
- **Dark-First Slate Atmosphere:** Deep rich navy-slate surfaces with tonal layering rather than pitch-black voids or generic mid-tone grays.
- **Dual Accent Discipline:** ACERO Ember (`#f97316`) identifies institutional hierarchy and navigation; Luminous Emerald (`#10b981` → `#0d9488`) drives affirmative workflows, data creation, and primary CTAs.
- **Geometric Typographic Contrast:** Expressive geometric display weights in Outfit paired with ultra-legible, modern grotesque body copy in Plus Jakarta Sans.
- **Micro-Tactility:** Rounded corners (`12px` to `24px`), soft press-down interactions (`active:scale-95`), and delicate 1px architectural borders.

## Colors

The ACERO palette is rooted in deep obsidian slate neutrals, animated by an organic dual-accent pair: energetic terracotta ember for identity and luminous emerald for operational momentum.

### Primary
- **Luminous Emerald** (`#10b981` to `#0d9488`): The affirmative action color. Used for primary CTAs ("Nuevo Estudiante", "Guardar Calificaciones"), positive completion badges, and active operational triggers.

### Secondary
- **ACERO Ember** (`#f97316` / `#f9956c`): The institutional brand color. Used for the ACERO brand mark, navigation active indicators, route highlights, and metric focus tags.

### Tertiary
- **Academy Indigo Navy** (`#272f47` / `#2b3353`): Used for secondary icon chips, chart series comparison layers, and elevated sub-surfaces.

### Neutral
- **Obsidian Foundation** (`#020617`): Dark mode root page canvas background.
- **Surface Container Slate** (`#0f172a`): Dark mode card and container backdrop with subtle opacity (`bg-slate-900/50`).
- **Architectural Stroke Dark** (`#1e293b`): 1px structural border bounding cards, table headers, and dividers.
- **Canvas Foundation Light** (`#f8fafc`): Light mode root page background (`bg-slate-50`).
- **Card Surface Light** (`#ffffff`): Light mode card backdrop with 1px border (`#f1f5f9`).
- **Text Headings** (`#ffffff` dark / `#0f172a` light): Pure high-contrast font color for titles and KPI numerals.
- **Text Body** (`#cbd5e1` dark / `#334155` light): Readable balanced text color for descriptions and table cell content.
- **Text Muted** (`#64748b`): Secondary labels, timestamp indicators, and table column headers.

### Named Rules
**The Dual Accent Rule.** Never use ACERO Ember for affirmative commit buttons, and never use Luminous Emerald for navigation item active states. Ember anchors location and institutional identity; Emerald drives user action and record creation.

**The Glow-to-Signal Rule.** Glowing drop shadows (`shadow-emerald-500/20`) are reserved exclusively for clickable affirmative CTAs. Static badges, data cards, and decorative shapes must never use ambient glow.

## Typography

**Display Font:** Outfit (with fallback sans-serif)
**Body Font:** Plus Jakarta Sans (with fallback sans-serif)
**Label Font:** Plus Jakarta Sans (uppercase tracking 0.05em)

**Character:** A high-contrast typographic pairing combining Outfit's sharp, confident geometric letterforms for impactful metrics and section titles with Plus Jakarta Sans' balanced optical proportions for dense data tables and administrative forms.

### Hierarchy
- **Display** (800 weight, `clamp(2rem, 4vw, 2.75rem)`, line-height 1.15): Primary dashboard titles and page headlines.
- **Headline** (700 weight, `1.75rem` / `28px`, line-height 1.25): Modal titles, major card section headers.
- **Title** (600 weight, `1.25rem` / `20px`, line-height 1.3): Sub-card headers, table section dividers, widget titles.
- **Body** (400/500 weight, `0.875rem` / `14px`, line-height 1.5): Standard prose, table cells, form labels, and modal instructions. Max line length 65–75ch in documentation and notices.
- **Label** (700 weight, `0.6875rem` / `11px`, tracking 0.05em, uppercase): KPI sub-labels, table column headers, and status chip text.

### Named Rules
**The Display Anchor Rule.** Large numeric values (KPIs, statistics, balance totals) and major section titles must strictly use Outfit font-display with extra-bold weight (700/800). Tabular data and metadata must strictly use Plus Jakarta Sans to prevent optical distraction.

## Layout

ACERO utilizes a responsive desktop-first layout optimized for dense multi-pane administrative tasks, adapting down cleanly for tablet and mobile classroom usage.

- **App Shell:** Fixed left sidebar (`w-64` / 256px) on desktop, transitioning to a slide-over off-canvas drawer on mobile (`z-50`).
- **Main Canvas:** Fluid content area with a sticky frosted header (`backdrop-blur-md`, `h-16`) and an inner constraint container (`max-w-[1720px]`).
- **Spatial Grid:** 12-column flex and grid system with standard gap tokens:
  - Micro: `8px` (`gap-2`) between inline buttons and badge chips.
  - Form & Group: `16px` (`gap-4`) between related input fields and filters.
  - Card Grids: `20px` to `24px` (`gap-5` / `gap-6`) between dashboard cards and KPI modules.
- **Density Threshold:** Table row heights maintain `48px` default padding (`py-3.5 px-4`) to ensure quick scanning without fatiguing whitespace.

## Elevation & Depth

ACERO relies on **Subtle Tonal Layering** rather than aggressive drop shadows. Depth is communicated through calibrated surface luminance shifts and razor-thin 1px architectural strokes.

- **Canvas to Card Layering (Dark):** Base page canvas sits at `#020617` (slate-950). Interactive cards layer on top at `#0f172a` (slate-900) with a 1px border of `#1e293b` (slate-800).
- **Canvas to Card Layering (Light):** Base page canvas sits at `#f8fafc` (slate-50). Cards layer at `#ffffff` with a border of `#f1f5f9` (slate-100) and an ambient shadow (`shadow-xs` / `shadow-sm`).
- **Modal Elevation:** Overlays use `backdrop-blur-sm` with `bg-slate-950/80` and an elevated container shadow (`shadow-2xl`).

### Named Rules
**The Flat-By-Default Rule.** Containers, panels, and tables are flat at rest. Shadows never exceed `shadow-sm` on resting cards. Elevation rises only in response to explicit user hover, modal presentation, or active dropdown activation.

## Shapes

The form language balances modern approachable curvature with geometric alignment:

- **Form Fields & Small Buttons:** Rounded with `12px` radius (`rounded-xl`).
- **Standard Cards & Modals:** Rounded with `16px` radius (`rounded-2xl`).
- **Dashboard KPI Hero Cards:** Generous `24px` radius (`rounded-3xl`).
- **Badges, Circular Action Chips, and Avatars:** Fully rounded pill shapes (`rounded-full`).
- **Borders:** Crisp, non-blurry 1px border lines everywhere; no thick multi-pixel borders except active focus outlines.

## Components

### Buttons
- **Shape:** Rounded-xl (`12px` radius).
- **Primary:** Gradient from Emerald-500 (`#10b981`) to Teal-600 (`#0d9488`), dark obsidian text (`#020617`), bold weight, padding `10px 20px` (`px-5 py-2.5`), with soft emerald ambient shadow (`shadow-md shadow-emerald-500/20`).
- **Secondary:** Border outline in slate-800 (`dark:border-slate-800`) with slate-300 text, hover effect to `dark:bg-slate-900`.
- **Destructive:** Light translucent red tint (`bg-red-500/10 border-red-500/30 text-red-400`), solid on hover.
- **States:** Active scale micro-press (`active:scale-[0.98]` or `active:scale-95`), transition duration `200ms`.

### Cards / Containers
- **Corner Style:** Rounded-2xl (`16px`) or Rounded-3xl (`24px`).
- **Background:** `bg-white` (light) or `bg-slate-900/80` (dark).
- **Border:** `1px solid` slate-100 (light) or slate-800/80 (dark).
- **Internal Padding:** `20px` to `24px` (`p-5` to `p-6`).

### Inputs / Fields
- **Style:** 1px stroke (`border-slate-200` light / `border-slate-800` dark), background `#ffffff` / `#020617`, `rounded-xl` (`12px` radius), padding `12px 16px` (`px-4 py-3`).
- **Focus:** 2px ring with 20% opacity of ACERO Ember (`focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`) or Emerald for form submissions.

### Navigation (Sidebar & Header)
- **Sidebar:** Fixed left navigation with brand logo, stylized ACERO orange emblem, and navigation items featuring active pill background (`bg-orange-500/10`) with glowing active orange dot indicator.
- **Header:** Sticky frosted glass (`bg-white/90 dark:bg-slate-900/90 backdrop-blur-md`), embedded search bar with `rounded-full` pill geometry, language selector, and user profile avatar.

### Tables & Data Grids
- **Header:** Uppercase bold font-display text (`text-[11px]`), slate-500 muted color, subtle bottom border.
- **Rows:** Subtle zebra alternate or light hover highlight (`hover:bg-slate-50/50 dark:hover:bg-slate-800/40`), padding `py-3.5 px-4`.

### Badges / Status Chips
- **Style:** Compact pill (`rounded-lg` or `rounded-full`), `px-2.5 py-1`, text size `11px` font-bold.
- **Success/Active:** `bg-emerald-500/10 text-emerald-400 border-emerald-500/30`.
- **Warning/Pending:** `bg-amber-500/10 text-amber-400 border-amber-500/30`.
- **Danger/Overdue:** `bg-red-500/10 text-red-400 border-red-500/30`.
- **Neutral/Draft:** `bg-slate-500/10 text-slate-400 border-slate-500/30`.

## Do's and Don'ts

### Do:
- **Do** preserve the dual-accent split: Ember for brand/navigation and Emerald for creation/commit actions.
- **Do** use `Outfit` specifically for metrics, KPIs, and major section titles, and `Plus Jakarta Sans` for dense tabular information.
- **Do** wrap tabular data with clean `1px` subtle borders (`border-slate-800/80` in dark mode) to maintain structural order.
- **Do** apply `active:scale-[0.98]` micro-interactions on interactive buttons and action icons for tactile responsiveness.
- **Do** keep dark mode backgrounds grounded in deep Slate (`#020617` / `#0f172a`), never pure `#000000` pitch black.

### Don't:
- **Don't** use generic blue/gray corporate ERP styles or unstyled browser tables that degrade the executive feel.
- **Don't** mix more than two accent colors on a single view; avoid combining purple, cyan, and neon pink into the terminal palette.
- **Don't** add heavy multi-stop drop shadows (`shadow-2xl`) to standard cards; stick to subtle tonal borders and ambient glows.
- **Don't** use sharp rectangular 0px border-radii; maintain ACERO's distinctive `12px` to `24px` smooth corner radii.
- **Don't** use pure saturated red or green text without subtle background chip backing for status indicators.
