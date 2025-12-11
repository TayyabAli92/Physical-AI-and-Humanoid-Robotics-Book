from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Optional
import time
import asyncio

from ...services.embedding_service import embedding_service
from ...services.qdrant_service import qdrant_service
from ...api.deps import get_api_key

router = APIRouter()


class HealthCheckResponse(BaseModel):
    status: str
    timestamp: str
    dependencies: Dict[str, str]


@router.get("/health", response_model=HealthCheckResponse, summary="Check the health status of the backend service")
async def health_check(api_key: str = Depends(get_api_key)):
    """
    Check the health status of the backend service.
    """
    from datetime import datetime

    # Check dependencies
    dependencies_status = {}

    # Check Gemini API connection
    try:
        # Test with a simple embedding generation
        test_text = "health check"
        await embedding_service.generate_embedding(test_text)
        dependencies_status["gemini"] = "healthy"
    except Exception as e:
        dependencies_status["gemini"] = f"unhealthy: {str(e)}"

    # Check Qdrant connection
    try:
        # Test by getting collections
        collections = qdrant_service.client.get_collections()
        dependencies_status["qdrant"] = "healthy"
    except Exception as e:
        dependencies_status["qdrant"] = f"unhealthy: {str(e)}"

    # Overall status
    overall_status = "healthy" if all("healthy" in status for status in dependencies_status.values()) else "degraded"

    return HealthCheckResponse(
        status=overall_status,
        timestamp=datetime.utcnow().isoformat(),
        dependencies=dependencies_status
    )