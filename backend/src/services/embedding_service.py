import cohere
from typing import List, Dict, Any
from backend.utils.config import config

class CohereEmbeddingService:
    def __init__(self):
        self.client = cohere.Client(config.COHERE_API_KEY)
        self.model = config.EMBEDDING_MODEL

    async def embed_text(self, text: str) -> List[float]:
        """
        Generate embeddings for a single text using Cohere.
        """
        response = self.client.embed(
            texts=[text],
            model=self.model
        )
        return response.embeddings[0]

    async def embed_texts(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts using Cohere.
        """
        if not texts:
            return []

        response = self.client.embed(
            texts=texts,
            model=self.model
        )
        return response.embeddings

    async def embed_document(self, text: str, source_path: str = None) -> Dict[str, Any]:
        """
        Generate embeddings for a document with metadata.
        """
        embedding = await self.embed_text(text)

        return {
            "embedding": embedding,
            "metadata": {
                "source_path": source_path or "unknown",
                "text_length": len(text),
                "model": self.model
            }
        }