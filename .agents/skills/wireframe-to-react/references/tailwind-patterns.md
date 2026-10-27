# Tailwind CSS UI Patterns for Wireframe Implementations

This reference provides reusable React and Tailwind CSS patterns for converting wireframes into accessible, responsive user interfaces. Treat these examples as starting points, adapting them to the supplied wireframe, existing project conventions, and installed Tailwind CSS version.

## Implementation Rules

1. Inspect the existing project and dependencies before choosing an implementation. Preserve existing conventions unless a fresh project is requested.
2. Adapt patterns to the supplied wireframe rather than forcing every design into the same layout.
3. Every interactive element must have meaningful, implemented behavior. Do not create decorative buttons, links, filters, or modal triggers that do nothing.
4. Use semantic HTML, accessible names, visible focus states, keyboard support, and appropriate disabled states.
5. Prefer stable, unique identifiers for React list keys. Avoid array indexes when items can be reordered, inserted, or removed.
6. Handle empty data, unknown statuses, long text, loading states, validation errors, and narrow viewports gracefully.
7. Use typed component props in TypeScript projects. Constrain supported variants and provide safe defaults.
8. If Tailwind-only styling is required, use Tailwind utilities rather than separate CSS files or CSS-in-JS.
9. Inspect the installed Tailwind version before configuring the project. Tailwind CSS v3 and v4 have different setup requirements.
10. Clearly distinguish demonstration data and simulated behavior from real backend functionality.
11. Add dependencies only when necessary and compatible with the existing project.
12. Run available checks when tools permit. Report completed checks honestly and identify anything that remains unverified.

---

## 1. App Shell and Layouts

### Responsive Sidebar and Header

```jsx
export function AppShell({ sidebar, header, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="w-full shrink-0 border-r border-slate-200 bg-white md:w-64">
          {sidebar}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
            {header}
          </header>

          <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
```

**Guidelines**
- Maintain one clear primary `<main>` landmark.
- Use `min-w-0` on flex children that contain wide tables or charts.
- Make the header sticky only when appropriate for the design.
- For mobile drawer navigation, implement open/close behavior, accessible labeling, keyboard handling, and focus management.

---

## 2. Stat and Metric Cards

### KPI Card with Optional Trend and Icon

```jsx
export function StatCard({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
}) {
  const trendStyles = {
    positive: "bg-emerald-50 text-emerald-700",
    negative: "bg-rose-50 text-rose-700",
    neutral: "bg-slate-100 text-slate-700",
  };

  const trendClass = trendStyles[trend] ?? trendStyles.neutral;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium text-slate-500">
          {title}
        </h2>

        {Icon ? (
          <span
            aria-hidden="true"
            className="rounded-lg bg-blue-50 p-2.5 text-blue-600"
          >
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <p className="break-words text-2xl font-bold text-slate-900">
          {value}
        </p>

        {change ? (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${trendClass}`}
          >
            {change}
          </span>
        ) : null}
      </div>
    </section>
  );
}
```

**Guidelines**
- Supported trends are `positive`, `negative`, and `neutral`.
- Choose trends according to the meaning of the metric; an increase is not always positive.
- Do not communicate trends through color alone.
- For multiple cards, use a responsive grid such as `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4`.

---

## 3. Data Tables and Lists

### Configurable Data Table

This component expects column definitions and rows with unique IDs.

```jsx
export function DataTable({
  columns,
  rows,
  getRowKey = (row) => row.id,
  emptyMessage = "No records found.",
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {rows.length === 0 ? (
        <p
          className="px-6 py-10 text-center text-sm text-slate-500"
          role="status"
        >
          {emptyMessage}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Data table</caption>

            <thead className="bg-slate-50 text-slate-600">
              <tr className="border-b border-slate-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="whitespace-nowrap px-4 py-3.5 font-medium sm:px-6"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="transition-colors hover:bg-slate-50"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-4 sm:px-6"
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

**Example usage**

```jsx
const columns = [
  { key: "name", header: "Name" },
  { key: "role", header: "Role" },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: "date", header: "Date" },
];

<DataTable columns={columns} rows={employees} />
```

**Guidelines**
- Ensure every row has a stable, unique key.
- Replace the generic table caption with a meaningful description when appropriate.
- Consider a card or list layout on mobile if horizontal scrolling does not fit the design.
- Keep complex business logic outside the table component.

---

## 4. Form Controls and Inputs

### Accessible Search Input

```jsx
export function SearchInput({
  id = "search",
  label = "Search",
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="w-full max-w-sm">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" strokeWidth="2" />
          <path
            d="m16 16 4 4"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>
    </div>
  );
}
```

**Guidelines**
- The parent component owns the search state and supplies `value` and `onChange`.
- Give each search input a unique ID.
- Implement actual filtering or submission behavior in the parent.
- Include loading and error feedback when search requires asynchronous work.

### Reusable Button Variants

```jsx
const buttonStyles = {
  primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700",
  secondary:
    "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
  ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  children,
  ...props
}) {
  const safeVariant = Object.hasOwn(buttonStyles, variant)
    ? variant
    : "primary";

  return (
    <button
      {...props}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${buttonStyles[safeVariant]} ${className}`}
    >
      {children}
    </button>
  );
}
```

**Guidelines**
- In TypeScript, constrain `variant` to `"primary" | "secondary" | "danger" | "ghost"`.
- Use `type="submit"` only when the button should submit a form.
- Provide an appropriate click handler for each action.
- Ensure disabled controls have a genuine reason to be disabled.

---

## 5. Modal Dialog

A modal requires keyboard behavior and focus management in addition to visual styling. Prefer an accessible dialog library already used by the project.

The following is a basic visual and state pattern, **not a complete production-accessible dialog**.

```jsx
export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="p-6">{children}</div>
      </section>
    </div>
  );
}
```

**Required production behavior**
- Close on Escape.
- Move focus into the dialog when opened.
- Keep keyboard focus inside the dialog while it is open.
- Restore focus to the triggering control when closed.
- Prevent interaction with background content.
- Ensure the dialog has an accessible name and appropriate initial focus.
- Test keyboard navigation and assistive technology behavior.

Do not present this minimal example as a fully accessible modal until those behaviors have been implemented and tested.

---

## 6. Status Badges

Use a known style map and a safe fallback for unexpected values.

```jsx
const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Pending: "bg-amber-50 text-amber-800 ring-amber-600/20",
  Inactive: "bg-slate-100 text-slate-700 ring-slate-600/20",
  Failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export function StatusBadge({ status }) {
  const style =
    statusStyles[status] ??
    "bg-slate-100 text-slate-700 ring-slate-600/20";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {status || "Unknown"}
    </span>
  );
}
```

Keep status text visible; do not rely on color alone.

---

## 7. Responsive Layout Patterns

### Metric Grid

```jsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {/* Metric cards */}
</div>
```

### Main Content with Secondary Panel

```jsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <section className="min-w-0 lg:col-span-2">
    {/* Primary content */}
  </section>

  <aside className="min-w-0">
    {/* Secondary panel */}
  </aside>
</div>
```

### Responsive Action Toolbar

```jsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <div>{/* Search and filters */}</div>

  <div className="flex flex-wrap items-center gap-2">
    {/* Action buttons */}
  </div>
</div>
```

Choose breakpoints according to the design and content. Test for overflow, clipped text, narrow controls, and awkward wrapping.

---

## 8. Verification Checklist

Before marking a UI implementation complete, verify the following when tools are available:

- [ ] The rendered page matches the wireframe's main layout, hierarchy, spacing, and content.
- [ ] Components are reusable and consistent with project conventions.
- [ ] Buttons, links, forms, filters, and dialogs perform their intended actions.
- [ ] Inputs have accessible names and suitable validation feedback.
- [ ] Empty data and unknown status values render safely.
- [ ] Lists use stable keys.
- [ ] Desktop, tablet, and mobile layouts are checked for overflow and usability.
- [ ] Keyboard focus is visible and dialogs support appropriate keyboard behavior.
- [ ] Available lint, type-check, test, and production-build commands have been run.
- [ ] Unperformed checks, errors, and remaining limitations are reported honestly.