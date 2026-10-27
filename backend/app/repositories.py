from __future__ import annotations

from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from .models import Expense


class ExpenseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, amount: Decimal, category: str, description: str, transaction_date: date) -> Expense:
        expense = Expense(
            amount=amount,
            category=category,
            description=description,
            transaction_date=transaction_date,
        )
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def list(self, page: int, page_size: int, category: str | None = None, start_date: date | None = None, end_date: date | None = None):
        query = self.db.query(Expense)
        if category:
            query = query.filter(Expense.category == category)
        if start_date:
            query = query.filter(Expense.transaction_date >= start_date)
        if end_date:
            query = query.filter(Expense.transaction_date <= end_date)

        total = query.count()
        items = query.order_by(Expense.transaction_date.desc(), Expense.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
        return total, items

    def get_by_id(self, expense_id: int) -> Expense | None:
        return self.db.query(Expense).filter(Expense.id == expense_id).first()

    def update(self, expense: Expense, amount: Decimal, category: str, description: str, transaction_date: date) -> Expense:
        expense.amount = amount
        expense.category = category
        expense.description = description
        expense.transaction_date = transaction_date
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def delete(self, expense: Expense) -> None:
        self.db.delete(expense)
        self.db.commit()
