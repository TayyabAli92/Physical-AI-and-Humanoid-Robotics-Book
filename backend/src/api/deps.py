from typing import AsyncGenerator
from backend.src.services.embedding_service import CohereEmbeddingService
from backend.src.services.qdrant_service import QdrantService
from backend.src.services.agent_service import OpenAIAgentService
from backend.src.utils.embedding_validator import EmbeddingValidator

async def get_embedding_service() -> AsyncGenerator[CohereEmbeddingService, None]:
    """
    Dependency to get the embedding service.
    """
    service = CohereEmbeddingService()
    try:
        yield service
    finally:
        # Cleanup if needed
        pass

async def get_qdrant_service() -> AsyncGenerator[QdrantService, None]:
    """
    Dependency to get the Qdrant service.
    """
    service = QdrantService()
    try:
        yield service
    finally:
        # Cleanup if needed
        pass

async def get_agent_service() -> AsyncGenerator[OpenAIAgentService, None]:
    """
    Dependency to get the agent service.
    """
    service = OpenAIAgentService()
    try:
        yield service
    finally:
        # Cleanup if needed
        pass

async def get_embedding_validator() -> AsyncGenerator[EmbeddingValidator, None]:
    """
    Dependency to get the embedding validator.
    """
    validator = EmbeddingValidator()
    try:
        yield validator
    finally:
        # Cleanup if needed
        pass