# Spec Delta

## Purpose

The expense-backend capability delivers the backend implementation needed to satisfy the shared expense API contract. It defines the observable behavior of the FastAPI service, persistence layer, validation logic, and error handling required for a working Smart Expense Tracker backend.

## ADDED Requirements

### Requirement: Expense creation service
The backend shall create and persist a new expense record when provided valid request data that matches the shared API contract.

#### Scenario: Valid create request
- **WHEN** a client sends a valid expense payload that matches the contract
- **THEN** the backend creates the record, stores it in PostgreSQL, and returns the created expense representation with the expected status code

#### Scenario: Invalid create request
- **WHEN** a client sends invalid request data such as a non-positive amount, missing category, invalid date, or description length violation
- **THEN** the backend rejects the request with a validation error response and does not persist the invalid record

### Requirement: Expense listing with pagination and filters
The backend shall provide a list endpoint that follows the shared API contract for pagination and optional category/date filtering.

#### Scenario: Unfiltered list
- **WHEN** a client requests the expense list with no filters
- **THEN** the backend returns the page of expenses using the documented ordering and pagination metadata

#### Scenario: Filtered list
- **WHEN** a client provides filter parameters for category and/or date range
- **THEN** the backend returns only matching records and preserves the API contract’s pagination response structure

### Requirement: Expense retrieval by ID
The backend shall expose an endpoint to retrieve a single expense by its identifier and return a consistent not-found response when the record does not exist.

#### Scenario: Existing expense retrieval
- **WHEN** a valid expense ID is requested
- **THEN** the backend returns the selected expense with the full response schema

#### Scenario: Missing expense retrieval
- **WHEN** an expense ID refers to no stored row
- **THEN** the backend responds with the agreed not-found status code and error payload

### Requirement: Expense update service
The backend shall update existing expenses using valid request data while preserving the contract’s validation and timestamp semantics.

#### Scenario: Successful update
- **WHEN** a client submits valid updates for an existing expense
- **THEN** the backend persists the change and returns the updated resource with refreshed timestamp values

#### Scenario: Invalid update
- **WHEN** a client submits invalid update values
- **THEN** the backend rejects the request without partial persistence and returns a validation error response

### Requirement: Expense deletion service
The backend shall delete an existing expense and return the expected status for both successful and missing records.

#### Scenario: Successful deletion
- **WHEN** a valid expense ID is deleted
- **THEN** the backend removes the record and returns the contract-defined success response

#### Scenario: Missing target deletion
- **WHEN** a client requests deletion of an expense that is not present
- **THEN** the backend returns the contract-defined not-found response

### Requirement: Validation and error handling
The backend shall enforce the API contract’s request validation rules and return consistent error payloads for invalid input, missing resources, and database failures.

#### Scenario: Validation error
- **WHEN** request data violates a validation rule
- **THEN** the backend returns a structured error response with clear field-level details and the correct HTTP status code

#### Scenario: Database failure
- **WHEN** the database operation fails due to connectivity or persistence issues
- **THEN** the backend surfaces a clear server error response and logs the failure without exposing secrets or internal stack traces to clients

### Requirement: Decimal-safe monetary handling
The backend shall preserve monetary precision by using decimal-safe handling in the API and persistence layers.

#### Scenario: Monetary serialization
- **WHEN** the backend serializes an expense amount to JSON
- **THEN** it uses a decimal-safe representation consistent with the API contract and avoids floating-point precision issues

### Requirement: Configuration and dependency management
The backend shall load database and service configuration from environment variables and keep credentials and secrets out of source code.

#### Scenario: Environment-based configuration
- **WHEN** the application starts
- **THEN** it reads required configuration values from environment variables and fails clearly if required settings are missing

### Requirement: Automated backend tests
The backend shall include Pytest coverage for the expense lifecycle and validation behavior defined by the API contract.

#### Scenario: Regression coverage
- **WHEN** the backend service is changed
- **THEN** the relevant Pytest suite verifies CRUD behavior, validation handling, and failure flows remain compliant with the contract

### Requirement: Schema migration support
The backend shall support database schema evolution through migrations so the expense table can be created and updated safely.

#### Scenario: Migration execution
- **WHEN** the backend is set up on a new or updated database
- **THEN** the schema is created or updated through the configured migration workflow before runtime use
