# Design

## Context

This change defines a contract-first API boundary for the Smart Expense Tracker. The repository does not yet contain a concrete app implementation, so the design focuses on the shared REST contract without constraining either the React frontend or the FastAPI backend implementation choices.

## Goals / Non-Goals

**Goals:**
- Define the full expense resource contract for create, list, read, update, and delete operations.
- Establish request/response schemas, validation rules, and status codes.
- Standardize JSON serialization for monetary values and date/time fields.
- Support pagination and optional filtering without coupling the contract to a specific framework.
- Keep the contract OpenAPI-compatible for frontend/backend alignment.

**Non-Goals:**
- Authentication and authorization are out of scope for this contract change.
- Budget analytics, recurring expenses, and category management are out of scope.
- Storage or database implementation details are not specified beyond the API contract itself.

## Decisions

1. Resource-first REST design
   - Use standard REST semantics: `POST /expenses`, `GET /expenses`, `GET /expenses/{id}`, `PUT /expenses/{id}`, and `DELETE /expenses/{id}`.
   - This keeps the contract clear and predictable for both the client and the server.
   - Alternative considered: a single generic action endpoint. Rejected because explicit resource endpoints are more discoverable and easier to document in OpenAPI.

2. Decimal-safe monetary handling
   - Represent `amount` as a decimal-safe value in JSON, serialized as a string such as `"19.99"`, to avoid floating-point issues and maintain currency precision.
   - Accept numeric input when creating or updating an expense, but normalize the JSON form to a string for consistency.
   - Alternative considered: plain JSON float. Rejected because it risks precision loss and inconsistent backend behavior.

3. Strong validation rules at the API boundary
   - Require `category` and a valid `transaction_date`.
   - Enforce `amount > 0`.
   - Bound `description` length to a clearly documented maximum to prevent abuse and maintain UI consistency.
   - Alternative considered: validating only on the frontend. Rejected because the contract must be authoritative for both implementations.

4. Pagination and filtering as query parameters
   - Add `page`, `page_size`, `category`, `start_date`, and `end_date` as optional query parameters for list operations.
   - Define stable default ordering and document it in the contract so both implementations render the same results.
   - Alternative considered: offset-only semantics without filters. Rejected because the requirements explicitly call for category/date filtering and paginated history.

5. Consistent error contract
   - Standardize validation and not-found errors with a predictable JSON body including a message and field-specific details when applicable.
   - This supports frontend form handling and avoids inconsistent error UX.
   - Alternative considered: ad hoc backend errors. Rejected because it impedes independent frontend implementation.

6. OpenAPI-compatible documentation
   - Use FastAPI-style schema definitions and descriptions so the generated docs remain aligned with the contract.
   - This preserves an explicit API surface without constraining the frontend or backend internals.
   - Alternative considered: a separate markdown-only contract. Rejected because the requirement calls for an OpenAPI-compatible interface and implementation alignment.

## Risks / Trade-offs

- [Precision risk in money values] → Use decimal-safe serialization and disallow unbounded float values in the contract.
- [Ambiguous date semantics] → Define `transaction_date` as an ISO date string using the `YYYY-MM-DD` format and validate strictly.
- [Pagination inconsistencies] → Document default page size and ordering so both sides make the same assumptions.
- [Error UX drift] → Use one shared error envelope for validation and not-found cases.

## Migration Plan

- Define the API schema and validation contract before backend or frontend implementation begins.
- Keep the resource model stable across both implementations to minimize churn during integration.
- Once the backend is implemented, confirm the generated OpenAPI docs match the contract and align the frontend with the documented shapes.

## Open Questions

- Whether expense records are scoped to a single user or a multi-tenant system remains to be clarified when the broader auth and ownership model is introduced.
- The default sort order for expense history is to be confirmed during implementation, but it should be stable and documented in the API contract.
- The exact maximum description length may be adjusted during implementation if product requirements become more specific.
