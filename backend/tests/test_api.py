"""Smoke and contract tests for the portfolio API."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_projects_returns_catalogue() -> None:
    response = client.get("/api/projects")
    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload, list) and payload
    # Contract with /content/types.ts - these keys are what the frontend reads.
    for key in ("slug", "title", "tagline", "identities", "status", "metrics"):
        assert key in payload[0]


def test_filter_projects_by_identity() -> None:
    response = client.get("/api/projects", params={"identity": "ai-engineer"})
    assert response.status_code == 200
    assert all("ai-engineer" in p["identities"] for p in response.json())


def test_unknown_project_is_404() -> None:
    assert client.get("/api/projects/does-not-exist").status_code == 404


def test_contact_rejects_invalid_payload() -> None:
    response = client.post("/api/contact", json={"name": "A", "email": "nope", "message": "x"})
    assert response.status_code == 422


def test_contact_accepts_valid_payload() -> None:
    response = client.post(
        "/api/contact",
        json={
            "name": "Test Sender",
            "email": "sender@example.com",
            "message": "This is a long enough test message for the validator to accept.",
        },
    )
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_ml_demo_scores_a_ghost_destination() -> None:
    """A destination that receives value and reports nothing should score high."""
    response = client.post(
        "/api/ml/predict",
        json={
            "amount": 181.0,
            "oldBalanceOrig": 181.0,
            "newBalanceOrig": 0.0,
            "oldBalanceDest": 0.0,
            "newBalanceDest": 0.0,
            "type": "TRANSFER",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["band"] == "high"
    triggered = {s["name"] for s in body["signals"] if s["triggered"]}
    assert "ghost_destination" in triggered
    # The artefact is reported but must never contribute to the score.
    excluded = {s["name"] for s in body["excluded"]}
    assert excluded == {"is_full_drain"}
    assert all(s["weight"] == 0.0 for s in body["excluded"])


def test_ml_demo_scores_a_clean_transaction_low() -> None:
    response = client.post(
        "/api/ml/predict",
        json={
            "amount": 100.0,
            "oldBalanceOrig": 500.0,
            "newBalanceOrig": 400.0,
            "oldBalanceDest": 200.0,
            "newBalanceDest": 300.0,
            "type": "PAYMENT",
        },
    )
    assert response.status_code == 200
    assert response.json()["band"] == "low"
