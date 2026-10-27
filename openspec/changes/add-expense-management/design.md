# Design

## Context

This repository is initialized for OpenSpec but does not yet contain a concrete application implementation. The intended stack is React + TypeScript + Vite on the frontend, FastAPI + SQLAlchemy + PostgreSQL on the backend, and pytest/vitest for testing. The design therefore assumes the feature will be added as a new greenfield capability within that architecture rather than as a modification to an existing codebase.

## Goals / Non-Goals

**Goals:**
- Add a complete CRUD flow for expenses.
- Enforce validation at the API boundary and keep the frontend aligned with server-side rules.
- Persist data in PostgreSQL with a durable ORM model.
- Provide sufficient API and UI test coverage for the core scenarios.

**Non-Goals:**
- Budget forecasting, recurring expenses, or category analytics are out of scope for this change.
- Multi-user or team sharing is not included in the initial expense flow.
- Authentication and authorization are assumed to be separate concerns and are not introduced here unless explicitly required by the project later.

## Decisions

1. Single expense resource model with required fields
   - Keep one canonical `Expense` entity with `amount`, `category`, `date`, and `description` as the required data contract.
   - This keeps the API simple and makes validation and persistence straightforward in a single table.
   - Alternative considered: a richer normalized model for budgets and categories. Rejected because it adds unnecessary complexity before the foundational CRUD flow is in place.

2. Server-side validation as the source of truth
   - Validate required fields, positive numeric amounts, date format, and input length on the FastAPI/Pydantic layer.
   - The frontend can mirror the same rules for UX, but API validation remains authoritative.
   - Alternative considered: frontend-only validation. Rejected because it is insufficient for data integrity and security.

3. SQLAlchemy model mapped directly to PostgreSQL
   - Use a dedicated ORM model backed by a PostgreSQL table to persist expenses and support list, update, and delete operations.
   - This aligns with the project’s chosen backend stack and keeps deployment simple for a single database.
   - Alternative considered: in-memory storage. Rejected because it would violate the requirement for durable persistence.

4. CRUD endpoints with clear error responses
   - Expose dedicated endpoints for create, list, update, and delete operations, each returning consistent success payloads or validation errors.
   - This keeps the implementation predictable for both the frontend and future automation.
   - Alternative considered: a single generic endpoint. Rejected because explicit resource-level endpoints are easier to test and reason about.

## Risks / Trade-offs

- [Validation drift] → Keep API validation and frontend form validation aligned by reusing shared schema contracts where possible.
- [Database schema mismatch] → Use a migration or schema creation step in the backend setup so the table definition stays consistent with the model.
- [History ordering ambiguity] → Define a stable default ordering, such as newest-first by date, to avoid inconsistent UI behavior.
- [Partial failures] → Use transactional database operations where possible and do not silently swallow database errors.

## Migration Plan

- Add the PostgreSQL table and ORM entity for the expense model.
- Expose CRUD API endpoints with validation and error handling.
- Add frontend forms and list views that consume the API and render validation errors.
- Run backend and frontend test suites to confirm the new behavior before archiving the change.

## Open Questions

- The repository does not yet include a concrete frontend page or backend app structure; the exact file layout will be chosen during implementation.
- Whether expenses are associated with a user account or treated as a single-user ledger remains to be confirmed when the project’s broader auth model is introduced.
