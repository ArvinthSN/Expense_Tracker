# Spec Delta

## Purpose

The expense-frontend capability defines the observable behavior of the Smart Expense Tracker interface for entering, reviewing, filtering, editing, and deleting expense records through the backend API contract.

## ADDED Requirements

### Requirement: Dashboard and expense management interface
The frontend shall provide a dashboard experience that allows users to create, review, filter, update, and delete expenses through the application interface.

#### Scenario: Open dashboard
- **WHEN** a user opens the expense dashboard
- **THEN** the page displays the expense form and a transaction history view that reflect current backend data

#### Scenario: Create expense from form
- **WHEN** a user submits valid expense data
- **THEN** the frontend sends the request to the backend and refreshes the transaction list after success

### Requirement: Client-side validation
The frontend shall validate input before submission and display field-specific error feedback when required values are missing or invalid.

#### Scenario: Invalid form submission
- **WHEN** a user submits an amount below or equal to zero, missing category, invalid date, or description beyond the allowed limit
- **THEN** the frontend shows clear validation messages and prevents the request from being sent to the backend

### Requirement: Transaction history and empty states
The frontend shall display expense records and show clear empty states when no transactions are available.

#### Scenario: Empty dataset
- **WHEN** there are no saved expenses
- **THEN** the frontend displays a meaningful empty-state message instead of a blank list

#### Scenario: Loading state
- **WHEN** the frontend is fetching or updating data
- **THEN** the user sees a loading indicator while the request is in progress

### Requirement: Editing and deleting expenses
The frontend shall allow users to update an existing expense and remove it from history without depending on local storage as a persistence substitute.

#### Scenario: Successful edit
- **WHEN** a user edits a valid expense and submits the change
- **THEN** the frontend updates the list and shows the new values after the backend confirms the change

#### Scenario: Successful delete
- **WHEN** a user deletes an expense
- **THEN** the frontend removes it from the list and shows a success or updated state based on the backend response

### Requirement: Filtered history
The frontend shall provide category and date filters for the transaction history and apply them to the backend request or local list state as appropriate.

#### Scenario: Filtered view
- **WHEN** a user sets category or date filter values
- **THEN** the list updates to show only matching expenses and preserves pagination or state expectations defined by the backend contract

### Requirement: API error handling
The frontend shall display meaningful backend error feedback when the API rejects a request or fails to respond.

#### Scenario: API failure
- **WHEN** the backend returns a validation error or connection problem
- **THEN** the frontend surfaces a clear message and keeps the user on the page without crashing

### Requirement: Contract compliance
The frontend shall follow the agreed `expense-tracker-api` contract for endpoint paths, request payloads, response shapes, status handling, and decimal-safe monetary serialization.

#### Scenario: Contract alignment
- **WHEN** the frontend calls the expense backend
- **THEN** the request and response shapes match the documented API contract exactly

### Requirement: Frontend test coverage
The frontend shall include Vitest + React Testing Library tests covering the essential expense-tracking user journeys and validation states.

#### Scenario: Automated regression checks
- **WHEN** frontend behavior changes
- **THEN** the relevant test suite verifies create, edit, delete, filter, loading, empty-state, and error-handling flows remain correct
