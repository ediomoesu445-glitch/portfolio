"""Contact message schemas."""

from pydantic import BaseModel, EmailStr, Field, field_validator


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    message: str = Field(min_length=20, max_length=4000)
    #: Honeypot. Real visitors never see this field; bots fill it in.
    company: str | None = Field(default=None, max_length=200)

    @field_validator("name", "message")
    @classmethod
    def not_blank(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("must not be blank")
        return cleaned


class ContactResponse(BaseModel):
    ok: bool
    message: str
