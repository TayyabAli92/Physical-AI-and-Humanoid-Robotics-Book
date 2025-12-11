from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from ..utils.config import config


# Initialize security scheme
security = HTTPBearer(auto_error=False)  # Set to False to handle auth manually


def get_api_key(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> str:
    """
    Dependency to get and validate API key from request headers.
    In a real implementation, you might validate the key against a database.
    For now, we'll just check that it's provided if required.
    """
    if not config.GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server configuration error: API key not set"
        )

    # If credentials were provided, return them; otherwise return config key
    if credentials:
        return credentials.credentials
    else:
        # For development, return the configured API key
        # In production, you might want to require header authentication
        return config.GEMINI_API_KEY


def get_current_user(api_key: str = Depends(get_api_key)) -> str:
    """
    Dependency to get the current user based on API key.
    This is a simplified implementation - in a real app, you'd validate the key
    and return user information.
    """
    # In a real implementation, validate the API key against a database
    # For now, just return a placeholder user ID
    return "user-placeholder"


def get_rate_limit_info() -> dict:
    """
    Dependency to get rate limiting configuration.
    """
    return {
        "requests": config.RATE_LIMIT_REQUESTS,
        "window": config.RATE_LIMIT_WINDOW
    }