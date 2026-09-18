"""
Centralized app settings, loaded from environment variables / .env.
Import `settings` anywhere you need config instead of calling os.environ directly.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # App
    app_name: str = "LangGraph Backend"
    environment: str = "development"  # development | staging | production
    api_v1_prefix: str = "/api/v1"

    # CORS — comma-separated origins in env, e.g. "http://localhost:5173,https://myapp.com"
    cors_origins: str = "http://localhost:5173"

    # LLM provider keys (fill in .env, never commit real values)
    groq_api_key: str | None = None
    openai_api_key: str | None = None

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
