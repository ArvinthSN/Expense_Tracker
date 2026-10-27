from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from ..database import get_db
from ..repositories import ExpenseRepository
from ..schemas import ExpenseCreate, ExpenseRead, ExpenseUpdate
from ..services import ExpenseService

router = APIRouter()


def get_service(db: Session = Depends(get_db)) -> ExpenseService:
    return ExpenseService(ExpenseRepository(db))


@router.post("/expenses", response_model=ExpenseRead, status_code=201)
def create_expense(payload: ExpenseCreate, service: ExpenseService = Depends(get_service)):
    expense = service.create_expense(payload)
    return ExpenseRead.model_validate(expense)


@router.get("/expenses")
def list_expenses(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1),
    category: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    service: ExpenseService = Depends(get_service),
):
    total, items = service.list_expenses(page=page, page_size=page_size, category=category, start_date=start_date, end_date=end_date)
    return {
        "page": page,
        "page_size": page_size,
        "total": total,
        "items": [ExpenseRead.model_validate(item).model_dump(mode="json") for item in items],
    }


@router.get("/expenses/{expense_id}", response_model=ExpenseRead)
def get_expense(expense_id: int, service: ExpenseService = Depends(get_service)):
    expense = service.get_expense(expense_id)
    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")
    return ExpenseRead.model_validate(expense)


@router.put("/expenses/{expense_id}", response_model=ExpenseRead)
def update_expense(expense_id: int, payload: ExpenseUpdate, service: ExpenseService = Depends(get_service)):
    try:
        expense = service.update_expense(expense_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail="Expense not found") from exc
    return ExpenseRead.model_validate(expense)


@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, service: ExpenseService = Depends(get_service)):
    try:
        service.delete_expense(expense_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail="Expense not found") from exc
    return Response(status_code=204)
