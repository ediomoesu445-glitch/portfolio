import time
from collections import defaultdict, deque

from fastapi import APIRouter, Depends, HTTPException, Request

from app.core.config import Settings, get_settings
from app.schemas.contact import ContactRequest, ContactResponse
from app.services import mailer

router = APIRouter(prefix="/contact", tags=["contact"])

#: Per-IP sliding window. In-process and therefore per-worker - good enough for
#: a personal site; swap for Redis if this ever runs multi-instance.
_requests: dict[str, deque[float]] = defaultdict(deque)
_WINDOW_SECONDS = 3600


def _rate_limited(client_ip: str, limit: int) -> bool:
    now = time.monotonic()
    history = _requests[client_ip]
    while history and now - history[0] > _WINDOW_SECONDS:
        history.popleft()
    if len(history) >= limit:
        return True
    history.append(now)
    return False


@router.post("", response_model=ContactResponse, summary="Send a contact message")
def send_contact(
    payload: ContactRequest,
    request: Request,
    settings: Settings = Depends(get_settings),
) -> ContactResponse:
    # Honeypot: answer as if accepted so bots get no signal, but drop it.
    if payload.company:
        return ContactResponse(ok=True, message="Thanks - your message has been sent.")

    client_ip = request.client.host if request.client else "unknown"
    if _rate_limited(client_ip, settings.contact_rate_limit_per_hour):
        raise HTTPException(
            status_code=429,
            detail="Too many messages from this address. Please try again later.",
        )

    try:
        mailer.deliver(payload, settings)
    except Exception as error:  # noqa: BLE001 - surface a clean message, log the cause
        raise HTTPException(
            status_code=502,
            detail="Could not deliver the message. Please email me directly.",
        ) from error

    return ContactResponse(ok=True, message="Thanks - your message has been sent.")
