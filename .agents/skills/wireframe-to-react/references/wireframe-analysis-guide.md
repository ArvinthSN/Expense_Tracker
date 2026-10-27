# Wireframe Analysis & Deconstruction Guide

This reference guide outlines the systematic protocol for decoding any wireframe (hand-drawn sketch, low/high-fidelity mockup, screenshot, or ASCII diagram) into structured React components styled with Tailwind CSS.

---

## 1. Visual Layout & Shell Detection

Inspect the outer boundaries of the wireframe to determine the primary layout strategy:

### Common Shell Structures:
1. **Sidebar + Header + Canvas (Dashboard / SaaS):**
   - Fixed or collapsible sidebar on the left (`w-64 shrink-0 hidden md:flex flex-col`).
   - Sticky top bar with search, notifications, and user avatar (`h-16 sticky top-0 bg-white border-b`).
   - Scrollable central canvas with max-width or fluid padding (`flex-1 p-6 md:p-8 overflow-y-auto`).

2. **Top Navigation + Centered Container (Marketing / Portal):**
   - Global header with logo and links (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`).
   - Main content centered with container padding (`max-w-7xl mx-auto py-10`).

3. **Split Screen / Master-Detail:**
   - Left pane for list/navigation (`w-full md:w-1/3 border-r`).
   - Right pane for detailed view/editor (`w-full md:w-2/3`).

---

## 2. Choosing Between Flexbox and Grid

Translate wireframe visual alignment into appropriate Tailwind utilities:

| Visual Pattern in Wireframe | Tailwind Recommended Approach | Classes |
| :--- | :--- | :--- |
| **Horizontal Toolbar / Header** | Flexbox row with space between | `flex items-center justify-between` |
| **Icon + Label Pairing** | Inline flex with vertical center | `inline-flex items-center gap-2` |
| **Equal-width Metric Cards (1 to 4 columns)** | Responsive CSS Grid | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6` |
| **Asymmetric Layout (e.g. 70% Chart, 30% Feed)** | Responsive Multi-column Grid | `grid grid-cols-1 lg:grid-cols-3 gap-6` with `lg:col-span-2` |
| **Stacked Form Fields** | Flexbox column with spacing | `flex flex-col gap-4` |
| **Action Button Row** | Flexbox row with end alignment | `flex items-center justify-end gap-3` |

---

## 3. Component Hierarchy Extraction (Atomic Breakdown)

Break the wireframe into modular components:

```
Full Page / View (Organism)
 ├── Top Navigation Bar (Molecule)
 │    ├── Logo & App Title (Atom)
 │    ├── Global Search Input (Molecule)
 │    └── User Profile Avatar Menu (Molecule)
 ├── Sidebar Navigation (Organism)
 │    └── Navigation Link Items (Atoms)
 └── Content Canvas (Organism)
      ├── Page Header + Action Button (Molecule)
      ├── Metrics Row (Organism)
      │    └── StatCard (Molecule)
      │         ├── Icon Badge (Atom)
      │         ├── Value & Trend Indicator (Atom)
      │         └── Title Label (Atom)
      └── Data Table / List Container (Organism)
           ├── Table Filter & Search Controls (Molecule)
           └── Table Rows with Status Badges (Atoms)
```

---

## 4. Spacing, Typography & Color Mapping

Derive styling rules from wireframe cues:

* **Paddings & Gaps:**
  - Standard card interior: `p-6` (or `p-4` on compact views).
  - Page margin padding: `px-4 sm:px-6 lg:px-8 py-6`.
  - Element spacing within cards: `space-y-4` or `gap-4`.
* **Typography:**
  - Page Title: `text-2xl md:text-3xl font-bold text-gray-900 tracking-tight`.
  - Section Headings: `text-lg font-semibold text-gray-900`.
  - Body Text: `text-sm text-gray-600 leading-relaxed`.
  - Meta/Subtext/Captions: `text-xs font-medium text-gray-400`.
* **Surface Treatments:**
  - Base background: `bg-gray-50` or `bg-slate-50`.
  - Card containers: `bg-white border border-gray-200/80 rounded-xl shadow-sm`.
  - Interactive highlights: `bg-blue-600 hover:bg-blue-700 text-white`.

---

## 5. Identifying State and Interactive Behaviors

Wireframes often represent a static snapshot. Anticipate and implement dynamic states:

1. **Active vs. Inactive Navigation Links:**
   - Active: `bg-blue-50 text-blue-700 font-semibold`.
   - Inactive: `text-gray-600 hover:bg-gray-100 hover:text-gray-900`.
2. **Form Input Focus & Validation:**
   - Focus ring: `focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none`.
3. **Empty States:**
   - When a table or list has zero items, show a centered placeholder with an icon, title, and "Add Item" CTA.
4. **Modals & Overlays:**
   - Wireframe popups/dialogs should include backdrop blur: `fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4`.

