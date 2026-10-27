# End-to-End Reference: Wireframe to React + Tailwind Application

This document demonstrates how to take a wireframe specification or sketch and translate it into a complete, modular, runnable React application styled with Tailwind CSS.

---

## 1. Input Wireframe Specification

Imagine the user provides this ASCII wireframe or mockup:

```text
+-----------------------------------------------------------------------------------+
|  [Logo] CloudPulse               [Search projects...]        (Bell)  [User Avatar]|
+---------------+-------------------------------------------------------------------+
|               |  Projects Overview                          [+ Create Project]    |
| (Home) Home   |                                                                   |
| (Folder) Proj |  +-----------------+  +-----------------+  +-----------------+    |
| (Users) Team  |  | Active Projects |  | Completed Tasks |  | System Health   |    |
| (Gear) Config |  |       24        |  |      1,420      |  |      99.9%      |    |
|               |  |  +12% this mo   |  |  +8% this mo    |  |  Optimal        |    |
|               |  +-----------------+  +-----------------+  +-----------------+    |
|               |                                                                   |
|               |  Recent Projects                                                  |
|               |  +-------------------------------------------------------------+  |
|               |  | Project Name    | Lead       | Status      | Deadline       |  |
|               |  |-----------------+------------+-------------+----------------|  |
|               |  | UI Redesign     | Sarah K.   | [In Progress| Oct 30, 2026   |  |
|               |  | API Gateway v2  | Alex M.    | [Completed] | Oct 15, 2026   |  |
|               |  | Mobile Auth     | Devon L.   | [Pending]   | Nov 12, 2026   |  |
|               |  +-------------------------------------------------------------+  |
+---------------+-------------------------------------------------------------------+
```

---

## 2. Wireframe Decomposition & Analysis

1. **Shell:** Two-column desktop layout (`flex flex-col md:flex-row min-h-screen`) with sticky header (`h-16`).
2. **Sidebar:** Navigation icons + labels, active indicator on "Projects".
3. **Metrics Row:** 3-column responsive grid (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`).
4. **Data Table:** Card container with header title, responsive table view, and colored status pill badges.
5. **Interactive Controls:** Search input, Create Project button (triggers modal or action).

---

## 3. Resulting Modular React Implementation

### `src/data/mockData.js`
```javascript
export const stats = [
  { id: 1, title: 'Active Projects', value: '24', change: '12% this month', positive: true },
  { id: 2, title: 'Completed Tasks', value: '1,420', change: '8% this month', positive: true },
  { id: 3, title: 'System Health', value: '99.9%', change: 'Optimal', positive: true }
];

export const projects = [
  { id: 1, name: 'UI Redesign', lead: 'Sarah K.', status: 'In Progress', deadline: 'Oct 30, 2026' },
  { id: 2, name: 'API Gateway v2', lead: 'Alex M.', status: 'Completed', deadline: 'Oct 15, 2026' },
  { id: 3, name: 'Mobile Auth', lead: 'Devon L.', status: 'Pending', deadline: 'Nov 12, 2026' },
  { id: 4, name: 'Analytics Pipeline', lead: 'Marcus T.', status: 'In Progress', deadline: 'Nov 05, 2026' }
];
```

---

### `src/components/Sidebar.jsx`
```jsx
import React from 'react';

const navItems = [
  { label: 'Home', icon: '🏠', active: false },
  { label: 'Projects', icon: '📁', active: true },
  { label: 'Team', icon: '👥', active: false },
  { label: 'Settings', icon: '⚙️', active: false }
];

export function Sidebar() {
  return (
    <aside className="w-full md:w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-slate-200 gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          CP
        </div>
        <span className="font-bold text-slate-900 tracking-tight text-lg">CloudPulse</span>
      </div>
      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
```

---

### `src/components/Header.jsx`
```jsx
import React from 'react';

export function Header({ searchQuery, onSearchChange }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="w-72">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects..."
          className="w-full px-3.5 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          🔔
        </button>
        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
          JD
        </div>
      </div>
    </header>
  );
}
```

---

### `src/components/ProjectsTable.jsx`
```jsx
import React from 'react';

const statusBadgeStyles = {
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Pending': 'bg-amber-50 text-amber-700 border-amber-200'
};

export function ProjectsTable({ projects }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 text-base">Recent Projects</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
              <th className="px-6 py-3">Project Name</th>
              <th className="px-6 py-3">Lead</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Deadline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((proj) => (
              <tr key={proj.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{proj.name}</td>
                <td className="px-6 py-4 text-slate-600">{proj.lead}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      statusBadgeStyles[proj.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {proj.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{proj.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### `src/App.jsx`
```jsx
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProjectsTable } from './components/ProjectsTable';
import { stats, projects as initialProjects } from './data/mockData';

export default function App() {
  const [search, setSearch] = useState('');
  const [projects] = useState(initialProjects);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-900 antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header searchQuery={search} onSearchChange={setSearch} />
        <main className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8 max-w-7xl">
          {/* Page Title & Main Action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects Overview</h1>
              <p className="text-sm text-slate-500 mt-1">Manage, inspect, and track ongoing deliverables.</p>
            </div>
            <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
              + Create Project
            </button>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-sm font-medium text-slate-500">{item.title}</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">{item.value}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table View */}
          <ProjectsTable projects={filteredProjects} />
        </main>
      </div>
    </div>
  );
}
```

