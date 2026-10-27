from __future__ import annotations

from datetime import date
from decimal import Decimal

from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from backend.app.database import Base, engine, get_db
from backend.app.models import Expense
from backend.app.schemas import ExpenseCreate, ExpenseRead, ExpenseUpdate

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Expense Tracker API", version="1.0.0")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    details = {}
    for error in exc.errors():
        loc = ".".join(str(part) for part in error["loc"])
        details[loc] = error["msg"]

    return JSONResponse(
        status_code=422,
        content={
            "error": "validation_error",
            "message": "Validation failed",
            "details": details,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 404:
        return JSONResponse(
            status_code=404,
            content={"error": "not_found", "message": exc.detail},
        )
    return JSONResponse(status_code=exc.status_code, content={"error": "http_error", "message": exc.detail})


def serialize_expense(expense: Expense) -> dict:
    return {
        "id": expense.id,
        "amount": str(Decimal(str(expense.amount))),
        "category": expense.category,
        "description": expense.description,
        "transaction_date": expense.transaction_date.isoformat(),
        "created_at": expense.created_at.isoformat(),
        "updated_at": expense.updated_at.isoformat(),
    }


def expense_to_response(expense: Expense) -> ExpenseRead:
    return ExpenseRead(**serialize_expense(expense))


@app.post("/expenses", response_model=ExpenseRead, status_code=201)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    expense = Expense(
        amount=payload.amount,
        category=payload.category,
        description=payload.description,
        transaction_date=payload.transaction_date,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense_to_response(expense)


@app.get("/expenses")
def list_expenses(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1),
    category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
):
    result = db.query(Expense)
    if category:
        result = result.filter(Expense.category == category)
    if start_date:
        result = result.filter(Expense.transaction_date >= start_date)
    if end_date:
        result = result.filter(Expense.transaction_date <= end_date)

    total = result.count()
    items = result.order_by(Expense.transaction_date.desc(), Expense.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [serialize_expense(item) for item in items],
    }


@app.get("/expenses/{expense_id}", response_model=ExpenseRead)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense_to_response(expense)


@app.put("/expenses/{expense_id}", response_model=ExpenseRead)
def update_expense(expense_id: int, payload: ExpenseUpdate, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.amount = payload.amount
    expense.category = payload.category
    expense.description = payload.description
    expense.transaction_date = payload.transaction_date
    db.commit()
    db.refresh(expense)
    return expense_to_response(expense)


@app.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    return Response(status_code=204)
