"""Contact-message delivery.

Without SMTP credentials the message is logged rather than sent, so local
development and CI never need a mailbox and never send anything by accident.
"""

import logging
import smtplib
from email.message import EmailMessage

from app.core.config import Settings
from app.schemas.contact import ContactRequest

logger = logging.getLogger(__name__)


def build_message(payload: ContactRequest, settings: Settings) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = f"Portfolio contact - {payload.name}"
    message["From"] = settings.contact_from_email
    message["To"] = settings.contact_to_email
    message["Reply-To"] = str(payload.email)
    message.set_content(
        f"From: {payload.name} <{payload.email}>\n\n{payload.message}\n"
    )
    return message


def deliver(payload: ContactRequest, settings: Settings) -> None:
    message = build_message(payload, settings)

    if not settings.smtp_configured:
        logger.info(
            "SMTP not configured - contact message logged instead of sent:\n%s",
            message.get_content(),
        )
        return

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
        if settings.smtp_use_tls:
            server.starttls()
        server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(message)
    logger.info("Contact message delivered to %s", settings.contact_to_email)
