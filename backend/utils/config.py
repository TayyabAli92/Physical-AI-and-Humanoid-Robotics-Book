import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    # API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    QDRANT_URL: str = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")
    COHERE_API_KEY: str = os.getenv("COHERE_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Model Configuration
    EMBEDDING_MODEL: str = os.getenv("COHERE_EMBEDDING_MODEL", "embed-multilingual-v3.0")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-pro")

    # Qdrant Configuration
    QDRANT_COLLECTION_NAME: str = os.getenv("QDRANT_COLLECTION_NAME", "book_chunks")

    # Text Processing Configuration
    MAX_TOKENS_PER_CHUNK: int = int(os.getenv("MAX_TOKENS_PER_CHUNK", "512"))
    OVERLAP_TOKENS: int = int(os.getenv("OVERLAP_TOKENS", "50"))

    # API Configuration
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Rate Limiting and Caching
    RATE_LIMIT_REQUESTS: int = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW: int = int(os.getenv("RATE_LIMIT_WINDOW", "3600"))  # in seconds
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", "3600"))  # in seconds

    @classmethod
    def validate(cls) -> bool:
        """
        Validate that all required configuration values are present.
        """
        required_fields = [
            cls.GEMINI_API_KEY,
            cls.QDRANT_URL,
            cls.QDRANT_API_KEY,
            cls.COHERE_API_KEY,
            cls.OPENAI_API_KEY
        ]

        return all(field for field in required_fields)

    @classmethod
    def get_missing_fields(cls) -> list:
        """
        Get a list of missing required configuration fields.
        """
        missing = []
        if not cls.GEMINI_API_KEY:
            missing.append("GEMINI_API_KEY")
        if not cls.QDRANT_URL:
            missing.append("QDRANT_URL")
        if not cls.QDRANT_API_KEY:
            missing.append("QDRANT_API_KEY")
        if not cls.COHERE_API_KEY:
            missing.append("COHERE_API_KEY")
        if not cls.OPENAI_API_KEY:
            missing.append("OPENAI_API_KEY")

        return missing

# Global config instance
config = Config()