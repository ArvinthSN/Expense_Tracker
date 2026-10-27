# Design

## Context

The project has a contract-first API proposal that defines the expense resource and behavior. This backend change converts that contract into a concrete Python FastAPI service backed by SQLAlchemy and PostgreSQL while keeping the implementation focused on the expense domain only.

## Goals / Non-Goals

**Goals:**
- Implement the expense CRUD API according to the shared contract.
- Add database-backed persistence with SQLAlchemy and PostgreSQL.
- Enforce validation and consistent error handling at the API boundary.
- Support pagination and optional category/date filtering.
- Add Pytest coverage and environment-based configuration.

**Non-Goals:**
- Authentication or authorization flows are excluded.
- Budgeting, AI insights, payments, and other unrelated domains are excluded.
- Frontend implementation is out of scope for this change.

## Decisions

1. Contract-driven backend implementation
   - Build the backend strictly against the `expense-tracker-api` contract to avoid drifting from the agreed endpoint paths, field names, validation rules, and status codes.
   - Alternative considered: inventing separate server-side semantics. Rejected because the frontend and backend are meant to evolve independently but in lockstep with the same contract.

2. Layered architecture
   - Separate the backend into API routes, service/business logic, and database access layers.
   - This keeps the endpoint logic thin and allows validation, persistence, and logging concerns to remain testable.
   - Alternative considered: placing all logic inside the route handlers. Rejected because it reduces testability and complicates maintenance.

3. SQLAlchemy ORM with PostgreSQL
   - Define a dedicated expense model and use SQLAlchemy to persist records in PostgreSQL.
   - This aligns with the stack and supports migrations and structured database operations.
   - Alternative considered: direct raw SQL or in-memory persistence. Rejected because both violate the durable storage requirement and database integration needs.

4. Pydantic schemas and central validation
   - Use Pydantic request/response schemas to enforce the contract and keep validation logic consistent across the API boundary.
   - This gives the backend a single source of truth for request shape and response serialization.
   - Alternative considered: ad hoc validation in route handlers. Rejected because it is harder to test and easier to drift from the contract.

5. Decimal-safe monetary handling
   - Use a Decimal-based type at the domain boundary and serialize amounts as JSON strings to preserve money precision exactly.
   - Alternative considered: float or double values. Rejected because they introduce precision and rounding issues.

6. Environment-based configuration
   - Store database credentials and runtime settings in environment variables and document required keys.
   - This prevents secrets from being committed to source control and supports deployment across environments.
   - Alternative considered: hard-coded settings. Rejected because it violates the security requirement.

7. Structured logging and error handling
   - Log service and database failures with enough context for operations, but avoid leaking sensitive details in API responses.
   - Alternative considered: noisy stack traces in responses. Rejected because it exposes internal implementation details and weakens the API contract.

## Risks / Trade-offs

- [Database outage] → Return clear server errors and use structured logs while keeping the response contract consistent.
- [Precision drift for money] → Use Decimal-safe serialization and strict validation to prevent rounding errors.
- [Migrations drift] → Use migration tooling and keep the schema definition aligned with the SQLAlchemy model and API contract.
- [Configuration errors] → Fail fast at startup if required environment variables are missing, rather than allowing insecure or broken runtime behavior.

## Migration Plan

- Add the SQLAlchemy model and migration for the expense table.
- Implement the API route and service layers to match the contract exactly.
- Add validation, logging, and error handling around the persistence flow.
- Run the Pytest suite to confirm CRUD, validation, and database failure scenarios behave according to the contract.

## Open Questions

- The exact ownership or tenant scope of each expense row remains to be confirmed once the broader user/auth strategy is defined.
- The final default sort order for list results should be confirmed during implementation, but it must remain stable and documented in the API contract.
- The exact max length for `description` may be adjusted if product requirements become more specific during implementation.
