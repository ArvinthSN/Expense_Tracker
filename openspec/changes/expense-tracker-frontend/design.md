# Design

## Context

The project already includes a contract-first API proposal for expense operations. This frontend change implements the user-facing layer that consumes that contract in React + TypeScript + Vite, styled with Tailwind CSS and tested with Vitest + React Testing Library.

## Goals / Non-Goals

**Goals:**
- Build a responsive expense dashboard with create, read, update, and delete support.
- Keep frontend validation aligned with the backend contract.
- Centralize API integration and keep presentation components mostly free of network logic.
- Present accurate loading, empty, success, and error states.
- Ensure accessibility and responsive behavior across common screen sizes.

**Non-Goals:**
- Authentication flows are out of scope.
- Budget analysis, AI insights, payment features, and other unrelated domains are excluded.
- Local storage persistence is explicitly not a substitute for backend persistence.

## Decisions

1. Contract-first frontend consumption
   - Use the agreed API contract as the source of truth for request shapes, query parameters, response schemas, and status codes.
   - Alternative considered: maintaining duplicate client-only field models. Rejected because it risks drift from the backend contract and increases maintenance overhead.

2. Layered frontend architecture
   - Separate the interface into reusable UI components, pages/layouts, a service layer, and shared TypeScript types.
   - This keeps presentation components focused on rendering and moves API behavior into a dedicated service layer.
   - Alternative considered: embedding fetch calls directly inside component code. Rejected because it makes validation, error handling, and reuse harder to test.

3. Shared TypeScript types and validation model
   - Use strict TypeScript types for expense payloads and API responses to mirror the backend contract closely.
   - The frontend form validation should reflect the same constraints as the API while still optimizing the user experience.
   - Alternative considered: loosely typed `any` values. Rejected because it weakens correctness and makes contract drift harder to detect.

4. Responsive, accessible UI
   - Use Tailwind for responsive layout and accessible semantics such as labels, focus states, and clear error messaging.
   - Alternative considered: a narrow desktop-only layout. Rejected because the requirement explicitly calls for responsiveness and accessibility.

5. API error handling approach
   - Centralize error handling around API responses and display consistent user-facing messages, including validation failures and request errors.
   - Alternative considered: swallowing errors and showing generic placeholders. Rejected because it hides real problems and produces a poor user experience.

## Risks / Trade-offs

- [Contract drift] → Keep the frontend service layer controlled by the shared API contract and avoid custom field names or data formats.
- [Slow or failed network calls] → Show loading indicators and meaningful errors without leaving the user in an uncertain state.
- [Empty or stale state] → Refresh data after create/edit/delete actions and show empty-state copy when no records exist.
- [Complex form state] → Keep form validation in a small, explicit validation layer so behavior remains predictable and testable.

## Migration Plan

- Define the frontend TypeScript types and API service contracts based on the agreed backend API.
- Build reusable components for the dashboard, form, history table/list, and filter controls.
- Wire create, edit, delete, and filter behavior to the backend API with error and loading handling.
- Add frontend testing coverage for the critical expense-management flows before approving implementation.

## Open Questions

- The final default ordering and pagination behavior should follow the backend contract exactly once the backend is implemented; the frontend should respect those defaults.
- The exact style of category options may need to be finalized during UI implementation, but the underlying API contract remains the source of truth.
- The final detail of error messaging wording can be refined during implementation without changing the contract itself.
