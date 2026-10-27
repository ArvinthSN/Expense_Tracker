from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ExpenseBase(BaseModel):
    amount: Decimal
    category: str = Field(..., min_length=1, max_length=50)
    description: str = Field(..., min_length=1, max_length=255)
    transaction_date: date

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, value: Decimal) -> Decimal:
        if value <= 0:
            raise ValueError("amount must be greater than zero")
        return value

    model_config = ConfigDict(str_strip_whitespace=True)


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(ExpenseBase):
    pass


class ExpenseRead(BaseModel):
    id: int
    amount: str
    category: str
    description: str
    transaction_date: date
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
