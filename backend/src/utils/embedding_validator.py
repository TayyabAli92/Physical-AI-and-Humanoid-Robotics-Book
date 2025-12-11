from typing import List
from backend.src.services.qdrant_service import QdrantService
from backend.utils.config import config

class EmbeddingValidator:
    """
    Utility for validating embeddings before performing Qdrant queries.
    """
    def __init__(self):
        self.qdrant_service = QdrantService()

    async def verify_embeddings_exist(self) -> bool:
        """
        Verify that embeddings exist in the Qdrant collection before performing queries.
        """
        return await self.qdrant_service.verify_embeddings_exist()

    async def validate_embedding_vector(self, vector: List[float]) -> bool:
        """
        Validate that an embedding vector has the correct dimensions for Cohere.
        """
        expected_dimension = 1024  # Cohere's embedding dimension
        return len(vector) == expected_dimension

    async def get_embedding_status_message(self) -> str:
        """
        Get a status message about the embedding availability.
        """
        if await self.verify_embeddings_exist():
            return "Embeddings available"
        else:
            return "Embedding not found: Re-run embed pipeline"