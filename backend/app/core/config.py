"""Runtime configuration, read from the environment (see /.env.example)."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Ediomo Esu - Portfolio API"
    environment: str = "development"
    debug: bool = True

    # Comma-separated list of origins allowed to call this API.
    cors_origins: str = "http://localhost:3000"

    # Contact delivery. When smtp_host is unset the service logs the message
    # instead of sending it, so local development never needs credentials.
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_use_tls: bool = True
    contact_to_email: str = "ediomoesu445@gmail.com"
    contact_from_email: str = "no-reply@localhost"

    # Simple in-process throttle for the public contact endpoint.
    contact_rate_limit_per_hour: int = 5

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def smtp_configured(self) -> bool:
        return bool(self.smtp_host and self.smtp_user and self.smtp_password)


@lru_cache
def get_settings() -> Settings:
    return Settings()
