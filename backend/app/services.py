from __future__ import annotations

import logging
from datetime import date
from decimal import Decimal

from sqlalchemy.exc import SQLAlchemyError

from .models import Expense
from .repositories import ExpenseRepository
from .schemas import ExpenseCreate, ExpenseUpdate

logger = logging.getLogger(__name__)


class ExpenseService:
    def __init__(self, repository: ExpenseRepository):
        self.repository = repository

    def create_expense(self, payload: ExpenseCreate) -> Expense:
        try:
            return self.repository.create(
                amount=payload.amount,
                category=payload.category,
                description=payload.description,
                transaction_date=payload.transaction_date,
            )
        except SQLAlchemyError:
            logger.exception("Failed to create expense")
            raise

    def list_expenses(self, page: int, page_size: int, category: str | None = None, start_date: date | None = None, end_date: date | None = None):
        try:
            total, items = self.repository.list(page=page, page_size=page_size, category=category, start_date=start_date, end_date=end_date)
            return total, items
        except SQLAlchemyError:
            logger.exception("Failed to list expenses")
            raise

    def get_expense(self, expense_id: int) -> Expense | None:
        try:
            return self.repository.get_by_id(expense_id)
        except SQLAlchemyError:
            logger.exception("Failed to fetch expense %s", expense_id)
            raise

    def update_expense(self, expense_id: int, payload: ExpenseUpdate) -> Expense:
        expense = self.repository.get_by_id(expense_id)
        if expense is None:
            raise ValueError("Expense not found")
        try:
            return self.repository.update(
                expense,
                amount=payload.amount,
                category=payload.category,
                description=payload.description,
                transaction_date=payload.transaction_date,
            )
        except SQLAlchemyError:
            logger.exception("Failed to update expense %s", expense_id)
            raise

    def delete_expense(self, expense_id: int) -> Expense:
        expense = self.repository.get_by_id(expense_id)
        if expense is None:
            raise ValueError("Expense not found")
        try:
            self.repository.delete(expense)
            return expense
        except SQLAlchemyError:
            logger.exception("Failed to delete expense %s", expense_id)
            raise
