import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_expenses.db")

import pytest
from fastapi.testclient import TestClient

from backend.app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client
