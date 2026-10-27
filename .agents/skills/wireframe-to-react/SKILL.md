---
name: wireframe-to-react
description: >-
  Analyzes visual wireframes, sketches, screenshots, Figma exports, and ASCII
  layout diagrams, then converts them into visually faithful, responsive,
  accessible React applications styled with Tailwind CSS. Use this skill when a
  user asks to build, recreate, translate, or implement a UI from a visual
  reference. Also use it to implement UI features from visual references while
  preserving the existing project's architecture and conventions.
---

# Wireframe to React + Tailwind Application Skill

## Purpose

Convert visual wireframes and UI references into functional React applications using Tailwind CSS.

**Primary objective: reproduce the supplied reference as accurately as practical.** Preserve its composition, proportions, spacing, alignment, visible content, and visual hierarchy. Do not redesign the interface merely because another design seems more modern or attractive.

Code structure, enterprise patterns, responsiveness, accessibility, and functionality matter, but they must support the requested interface rather than distract from or unnecessarily change it.

## Core Principles

1. **Visual fidelity first:** treat the supplied reference as the source of truth for visible design decisions.
2. **Analyze before coding:** identify the main regions, relationships, content, and visual characteristics that need to be reproduced.
3. **Do not invent a redesign:** avoid adding unrequested decoration, content, or styling.
4. **Use React appropriately:** create meaningful components without fragmenting a small screen into excessive files.
5. **Use Tailwind CSS for styling:** follow the existing project's setup and use utilities as the primary styling approach.
6. **Build required interactions:** implement behaviors supported by the requirements; keep assumptions minimal.
7. **Support responsive layouts:** preserve the design's hierarchy across screen sizes without compromising the reference viewport.
8. **Maintain accessibility:** use semantic HTML, accessible names, keyboard support, and visible focus states.
9. **Respect the existing project:** inspect it before changing architecture, dependencies, or configuration.
10. **Verify honestly:** report only checks actually performed and distinguish visual inspection from code/build verification.

---

## Workflow Overview

Follow this workflow, scaling the amount of analysis to the task's complexity:

1. Inspect the workspace and requirements.
2. Inspect the wireframe or visual reference.
3. Identify the layout and visual targets.
4. Choose a proportionate component and data structure.
5. Implement the interface with React and Tailwind CSS.
6. Implement the interactions explicitly required or clearly represented.
7. Run available checks and launch the page when possible.
8. Compare the rendered result with the reference and correct the largest visual mismatches.
9. Report what changed, how to run it, and what was or was not verified.

Consult these supporting resources when useful:

- `references/wireframe-analysis-guide.md` — visual analysis and component decomposition.
- `references/tailwind-patterns.md` — reusable Tailwind layout and component patterns.
- `examples/sample-wireframe-conversion.md` — example conversion; use it as guidance, not as a template to copy blindly.

Do not produce a lengthy analysis document for a simple screen. Spend the effort on decisions that improve the implementation.

---

## 1. Workspace Inspection and Project Setup

Before implementing:

1. Inspect available files, directory structure, `package.json`, source code, and installed dependencies when tools are available.
2. Determine whether the task is a new application, a new page, a component change, or a redesign within an existing application.
3. Identify the framework, React version, JavaScript/TypeScript convention, build tool, and Tailwind CSS version.
4. Preserve existing routing, architecture, naming conventions, and scripts where practical.
5. Avoid replacing project configuration or overwriting unrelated files without a clear reason.
6. If terminal or workspace access is unavailable, state the limitation and provide actionable file changes or commands.

### New project directory

For a new standalone application, create a descriptive kebab-case directory based on the interface's purpose, such as `employee-dashboard/` or `insurance-policy-portal/`.

Keep the application separate from the skill files and unrelated projects. For an existing application, work in its appropriate directory and do not create an unnecessary nested project.

### Dependencies

- Reuse installed dependencies whenever possible.
- Add only dependencies that materially help satisfy the requirements.
- Use an existing icon library when available and suitable.
- Do not add a component library if the task specifically requires direct React and Tailwind implementation.
- Do not change the package manager or lockfile without justification.

---

## 2. Wireframe Analysis

Analyze the reference to guide implementation. Focus on visible evidence, not speculative design intent.


### 2.0 Supported Reference Formats

Accept the supplied reference as an uploaded image, hand-drawn sketch, screenshot, Figma export, ASCII wireframe, or accessible file.

Inspect the actual reference when available. For image-based references, interpret visible layout, controls, labels, colours, and relationships. For ASCII wireframes, use the text arrangement and labels as the primary layout guide.

If the reference file cannot be accessed or an important detail is unreadable, state the limitation rather than pretending to have inspected it.

### 2.1 Identify the page regions

Identify the regions that are actually visible, for example:

- Header or top navigation.
- Sidebar or secondary navigation.
- Main content area.
- Footer, if present.
- Content sections, tables, forms, and repeated items.
- Fixed, sticky, scrolling, or overlay regions, when evident.

Do not add regions simply because they are common in dashboards or enterprise applications.

### 2.2 Establish visual targets

Before coding, briefly determine the following from the reference:

- **Composition:** overall page structure and position of major regions.
- **Proportions:** relative widths and heights of the header, sidebar, columns, and content areas.
- **Alignment:** edges, baselines, text alignment, and relationships between elements.
- **Spacing:** outer margins, inner padding, gaps, and vertical rhythm.
- **Content density:** how many items appear, how tightly they are arranged, and how much whitespace is present.
- **Typography:** apparent font family, sizes, weights, line heights, and hierarchy.
- **Color and surfaces:** backgrounds, text colors, borders, shadows, and radii.
- **Assets:** visible icons, illustrations, and images, including their placement and aspect ratios.
- **Content:** visible labels, headings, values, and control types.

Use exact values when provided by design files or project tokens. For image-only references, use reasonable visual estimates; do not pretend uncertain measurements are exact.

Distinguish what is visible from what is inferred. If a detail is unclear, preserve the visible structure and choose a conservative default.

### 2.3 Choose layout primitives from the reference

- Use Flexbox for one-dimensional alignment such as navigation bars, toolbars, and aligned form controls.
- Use CSS Grid through Tailwind utilities for two-dimensional layouts such as card grids and multi-column forms.
- Use normal document flow for ordinary content.
- Use absolute or fixed positioning only when the reference or interaction requires it.
- Avoid replacing a distinctive reference layout with a generic dashboard template.

### 2.4 Choose component boundaries proportionately

Create components for meaningful visual sections, repeated items, or reusable behavior. Possible components include `AppShell`, `Navbar`, `Sidebar`, `PageHeader`, `Button`, `Input`, `Card`, `DataTable`, or `StatusBadge`.

These are examples, not a required checklist. Do not create a separate component for every HTML element, and do not create extra files merely to satisfy a template.

### 2.5 Identify interactions separately

Record controls and behaviors that are visible or explicitly required, such as navigation, search, filters, tabs, dropdowns, forms, dialogs, pagination, and expandable sections.

Do not infer complex business logic from appearance alone. When behavior is unspecified, use a minimal sensible assumption or ask a focused question if the ambiguity blocks implementation.

---

## 3. Visual Fidelity Requirements

### 3.1 Match the reference before polishing

Prioritize visual work in this order:

1. Overall composition and placement of major regions.
2. Container dimensions, widths, heights, and proportions.
3. Alignment, spacing, padding, and content density.
4. Typography and visible content.
5. Colors, borders, radii, and shadows.
6. Icons, images, and small decorative details.

This is a refinement order, not permission to omit required accessibility, responsiveness, or functionality.

### 3.2 Do not introduce visual drift

Unless the reference or user explicitly calls for it:

- Do not add gradients, shadows, decorative backgrounds, animations, or extra cards.
- Do not turn every content region into a bordered card.
- Do not add extra sections, charts, metrics, buttons, labels, or icons.
- Do not change visible copy or invent business-specific data unnecessarily.
- Do not replace the reference's simple styling with a generic modern SaaS design.
- Do not adjust spacing or proportions solely because another arrangement looks more balanced.
- Do not use arbitrary colors or typography when the reference gives visual clues.

When the reference is a low-fidelity wireframe with no defined visual theme, preserve its structure and use restrained, consistent defaults only for unspecified styling.

### 3.3 Use assets appropriately

- Reuse provided assets and project assets when appropriate.
- Preserve image placement and aspect ratio.
- Do not invent a real brand logo or imply a placeholder is the original asset.
- If a specific asset is unavailable, use a suitable placeholder only when necessary and avoid letting it distort the layout.
- Use meaningful alternative text for informative images and empty alternative text for decorative images.

### 3.4 Keep content density faithful

The amount and arrangement of visible content strongly affect visual similarity. Match the reference's number of visible sections, approximate text lengths, row counts, card counts, and whitespace where the available information supports doing so.

Use mock data only where needed to demonstrate the requested interface. Keep it consistent with the visible design and clearly distinguish mock behavior from real data integration.

### 3.5 Hand-Drawn Sketch Support

Treat uploaded hand-drawn sketches, including pencil drawings and coloured sketches, as the primary visual reference. Interpret the intended layout and components, preserve the user's arrangement and specified colours, and convert the sketch into a clean, functional React + TypeScript + Tailwind CSS application.

Do not reproduce the paper texture or pencil strokes unless explicitly requested. If any detail is unclear, make a reasonable assumption without changing the overall design.
---

## 4. React and Tailwind Standards

### React

- Use modern functional components.
- Use React state and effects when behavior requires them.
- Use `useMemo`, `useCallback`, and custom hooks only when they provide a clear benefit; do not add them automatically.
- Keep state close to the components that need it and lift it when components must coordinate.
- Use props for meaningful reuse and configuration.
- Separate data from presentation when it improves clarity.
- Use stable keys for rendered collections.
- Avoid unnecessary state, effects, abstractions, and deeply nested conditional JSX.
- Follow the project's JavaScript or TypeScript conventions. Use TypeScript when the project already uses it or the user requests it.

### Tailwind CSS

Use Tailwind utilities as the primary styling approach and follow the project's existing setup.

- Prefer existing design tokens and spacing/color conventions where available.
- Use responsive, hover, focus, active, and disabled variants when relevant.
- Use arbitrary values when needed to match the reference accurately.
- Avoid large duplicated class strings when a small reusable component or pattern genuinely improves clarity.
- Do not sacrifice visual fidelity to force every element into a predefined design system.
- Do not introduce custom CSS, CSS modules, or CSS-in-JS if the user requires Tailwind-only styling. If an existing project already relies on another styling approach, preserve it unless the user asks to migrate.

### Tailwind version compatibility

Inspect the installed version before changing setup:

- **Tailwind CSS v3:** follow the project's v3 configuration and content-path conventions.
- **Tailwind CSS v4:** follow the project's v4 CSS-first and Vite/PostCSS integration conventions as appropriate.
- Do not combine incompatible v3 and v4 instructions.
- Do not replace a working configuration merely to match an example.

### Icons

Prefer the project's existing icon library. Use Lucide React when installed and appropriate. If adding an icon package would be unnecessary, use a suitable existing asset or simple inline SVG. Do not add decorative icons that are absent from the reference without a reason.

---

## 5. Application Architecture and Enterprise Quality

Architecture should fit the project. A small screen does not need the same structure as a large production application.

### Default approach

- Preserve existing project architecture.
- For a small screen or prototype, prefer a simple implementation with a small number of clear components and files.
- For a larger or production application, use feature-oriented organization and shared components when they improve maintainability.
- Keep business logic out of generic visual components when practical.
- Add infrastructure only when it supports actual requirements.

### Enterprise patterns: apply when appropriate

**Error boundaries**
- Use an Error Boundary when the app's reliability requirements or architecture justify it, especially for larger applications or isolated critical areas.
- Do not create a dedicated Error Boundary solely to recreate a simple static wireframe.

**Custom hooks**
- Extract a custom hook when logic is reusable, complex enough to separate, or shared by multiple components.
- Do not create hooks for trivial one-off behavior merely to satisfy a rule.

**Loading, empty, and error states**
- Implement these states when data is loaded asynchronously or the interface requires them.
- A data-driven component does not automatically need a skeleton if no loading state exists in the requested experience.
- When loading states are needed, make skeleton dimensions and arrangement consistent with the final content.
- Provide useful empty states when a real empty result is possible.

**Defensive programming**
- Handle nullable data and missing values at relevant boundaries.
- Use optional chaining, nullish coalescing, defaults, and validation where they make sense.
- Do not add redundant fallbacks to every prop or obscure simple code with unnecessary defensive logic.

**Accessibility and focus**
- Use semantic HTML, accessible names, visible focus indicators, and keyboard-operable controls.
- Icon-only buttons need accessible names.
- For custom dialogs, implement appropriate dialog semantics and keyboard behavior, including Escape handling and focus management where applicable.
- Use ARIA only when needed and correctly implemented.

These patterns remain important when the project's scale and requirements call for them. They are not a reason to add unnecessary code or alter the reference layout.

---

## 6. Responsive Design

Implement a responsive layout that preserves the reference's visual hierarchy. When the reference includes a target viewport, match that viewport first, then ensure the layout adapts to smaller and larger screens.

- Use mobile-first Tailwind responsive variants where appropriate.
- Stack or rearrange content on narrow screens when necessary.
- Prevent unintended horizontal overflow and clipping.
- Keep navigation, forms, and controls usable on touch devices.
- Collapse or transform a sidebar only when needed for the smaller viewport.
- Allow wide tables to scroll horizontally or use another suitable responsive presentation.
- Do not hide important content without a clear reason.
- Avoid fixed widths that exceed the viewport.

Do not let generic responsive conventions override the reference's intended desktop composition. Test representative mobile, tablet, and desktop widths when tools are available.

---

## 7. Functional Interaction Requirements

Implement meaningful behavior for visible interactive controls when behavior is specified or reasonably implied.

Depending on the interface, this may include:

- Navigation and active navigation states.
- Search, filtering, and sorting.
- Tabs and dropdowns.
- Forms and validation.
- Modal opening and closing.
- Confirmation and cancellation actions.
- Pagination.
- Expandable sections.

Keep interactions proportionate to the task. Do not build a complex backend or invent business rules to make a static mockup appear production-connected.

### Mock data and API integration

When a backend is unavailable:

- Use realistic mock data that matches the reference.
- Implement client-side behavior where useful.
- Make it clear when data is mocked and not persisted.

When an API is required:

- Inspect existing API clients and contracts.
- Use only provided endpoints and documented contracts.
- Handle relevant loading, error, empty, and success states.
- Do not invent endpoints, credentials, or authentication flows.
- Do not claim an integration works unless it has been implemented and verified.

If a control cannot work because a required service or business rule is missing, explain the limitation or clearly mark it unavailable rather than presenting a false success.

---

## 8. Verification and Visual Refinement

A successful build proves that the code builds; it does not prove that the page resembles the reference.

### 8.1 Code and build checks

When tools are available:

- Confirm imports and dependencies resolve.
- Run the project's configured lint, type-check, test, and build commands when relevant.
- Fix errors caused by the implementation and rerun affected checks.
- Do not assume every project has the same scripts.

### 8.2 Visual comparison loop

When browser or screenshot inspection is available:

1. Run the application and capture or inspect the rendered page.
2. Use a viewport close to the reference's dimensions.
3. Compare the reference and implementation side by side.
4. Identify the three most significant visible mismatches.
5. Fix those mismatches before spending time on small details.
6. Inspect the result again and repeat when practical.

Check:

- Overall composition and major region proportions.
- Header/sidebar/content dimensions.
- Alignment and spacing.
- Typography and content density.
- Colors, borders, radii, and shadows.
- Missing, extra, or misplaced elements.
- Overflow, clipping, and responsive behavior.

Prefer corrections grounded in the comparison. Do not change unrelated parts of the interface during each refinement pass.

### 8.3 When visual tools are unavailable

Implement the best match possible from the supplied reference and available project context. Do not claim that a screenshot comparison or browser inspection occurred when it did not. State clearly what could not be visually verified.

### 8.4 Interaction checks

Test important interactions that exist in the implementation, such as navigation, search, form validation, tabs, dialogs, and keyboard operation. Do not claim that every possible state was tested if only a subset was checked.

---

## 9. Completion Report

Provide a concise report containing:

### Files changed
List the important files created or modified and their purpose.

### Implementation
Summarize the main layout, components, responsive behavior, and interactions.

### How to run
Give commands based on the actual project setup. For a typical Vite project, `npm install` and `npm run dev` may be appropriate, but verify the package scripts before presenting them as definitive.

### Verification
Report the build, lint, type-check, test, browser, responsive, and interaction checks that were actually performed. Identify any checks that were unavailable or failed.

### Limitations and assumptions
Mention mock data, missing assets, unavailable APIs, unresolved ambiguities, and any visual inspection that could not be performed.

---

## 10. Final Decision Rules

1. **Reference first:** reproduce the supplied design instead of inventing a redesign.
2. **Match the major geometry first:** fix composition, proportions, and alignment before decorative details.
3. **Keep analysis actionable:** observations must guide implementation, not become unnecessary paperwork.
4. **Use proportionate architecture:** do not force enterprise infrastructure onto a simple screen.
5. **Preserve existing projects:** do not recreate applications or replace working configuration without justification.
6. **Use conservative assumptions:** do not invent visible content, assets, or business rules without a reason.
7. **Implement relevant interactions:** make controls work when required, or disclose limitations.
8. **Preserve accessibility and responsiveness:** meet these requirements without unnecessarily changing the reference.
9. **Compare when possible:** inspect the rendered page and fix the largest visual differences.
10. **Verify honestly:** report only actions and checks actually completed.
11. **Prefer simplicity when outcomes are equal:** choose the least complicated implementation that meets the visual and functional requirements.

The goal is a visually faithful, responsive, accessible, and functional React application using Tailwind CSS, with architecture appropriate to the project and no unnecessary departure from the supplied reference.