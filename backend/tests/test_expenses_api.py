from datetime import date


def test_create_expense_success(client):
    payload = {
        "amount": "19.99",
        "category": "Food",
        "description": "Lunch with a client",
        "transaction_date": "2026-10-27",
    }

    response = client.post("/expenses", json=payload)

    assert response.status_code == 201
    body = response.json()
    assert body["amount"] == "19.99"
    assert body["category"] == "Food"
    assert body["description"] == "Lunch with a client"
    assert body["transaction_date"] == "2026-10-27"
    assert body["id"]
    assert body["created_at"]
    assert body["updated_at"]


def test_create_expense_invalid_amount(client):
    payload = {
        "amount": "0",
        "category": "Transport",
        "description": "Bus fare",
        "transaction_date": "2026-10-27",
    }

    response = client.post("/expenses", json=payload)

    assert response.status_code == 422
    body = response.json()
    assert body["error"] == "validation_error"
    assert "amount" in str(body["details"])


def test_get_expenses_list_with_pagination_and_filters(client):
    client.post(
        "/expenses",
        json={
            "amount": "12.50",
            "category": "Food",
            "description": "Breakfast",
            "transaction_date": "2026-10-25",
        },
    )
    client.post(
        "/expenses",
        json={
            "amount": "45.75",
            "category": "Travel",
            "description": "Train ticket",
            "transaction_date": "2026-10-26",
        },
    )

    response = client.get("/expenses?page=1&page_size=10&category=Food&start_date=2026-10-20&end_date=2026-10-30")

    assert response.status_code == 200
    body = response.json()
    assert body["page"] == 1
    assert body["page_size"] == 10
    assert body["items"]
    assert all(item["category"] == "Food" for item in body["items"])


def test_get_expense_by_id(client):
    created = client.post(
        "/expenses",
        json={
            "amount": "8.25",
            "category": "Shopping",
            "description": "Groceries",
            "transaction_date": "2026-10-20",
        },
    )
    expense_id = created.json()["id"]

    response = client.get(f"/expenses/{expense_id}")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == expense_id
    assert body["amount"] == "8.25"


def test_update_expense_success(client):
    created = client.post(
        "/expenses",
        json={
            "amount": "15.00",
            "category": "Utilities",
            "description": "Electricity",
            "transaction_date": "2026-10-21",
        },
    )
    expense_id = created.json()["id"]

    response = client.put(
        f"/expenses/{expense_id}",
        json={
            "amount": "16.25",
            "category": "Utilities",
            "description": "Updated electricity bill",
            "transaction_date": "2026-10-22",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["amount"] == "16.25"
    assert body["description"] == "Updated electricity bill"


def test_delete_expense(client):
    created = client.post(
        "/expenses",
        json={
            "amount": "4.00",
            "category": "Misc",
            "description": "Snacks",
            "transaction_date": "2026-10-19",
        },
    )
    expense_id = created.json()["id"]

    response = client.delete(f"/expenses/{expense_id}")

    assert response.status_code == 204


def test_missing_expense_returns_404(client):
    response = client.get("/expenses/999999")

    assert response.status_code == 404
    body = response.json()
    assert body["error"] == "not_found"
