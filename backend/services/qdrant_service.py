from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
from ..models.chunk import ContentChunk

load_dotenv()

class QdrantService:
    def __init__(self):
        self.url = os.getenv("QDRANT_URL")
        self.api_key = os.getenv("QDRANT_API_KEY")
        self.collection_name = os.getenv("QDRANT_COLLECTION_NAME", "book_chunks")

        if not self.url:
            raise ValueError("QDRANT_URL environment variable is required")
        if not self.api_key:
            raise ValueError("QDRANT_API_KEY environment variable is required")

        self.client = QdrantClient(
            url=self.url,
            api_key=self.api_key,
            prefer_grpc=False  # Using HTTP for simplicity
        )

        # Initialize the collection if it doesn't exist
        self._init_collection()

    def _init_collection(self):
        """
        Initialize the Qdrant collection with the appropriate vector size for the embedding model.
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_exists = any(col.name == self.collection_name for col in collections.collections)

            if not collection_exists:
                # Create collection with 768 dimensions for text-embedding-005 model
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=768,  # Dimension for text-embedding-005
                        distance=models.Distance.COSINE
                    )
                )
        except Exception as e:
            print(f"Error initializing Qdrant collection: {e}")
            raise

    async def store_chunks(self, chunks: List[Dict]) -> bool:
        """
        Store content chunks in Qdrant with their embeddings.
        """
        try:
            points = []
            for chunk in chunks:
                point = models.PointStruct(
                    id=chunk['id'],
                    vector=chunk['embedding_vector'],
                    payload={
                        "content": chunk['content'],
                        "book_content_id": chunk.get('book_content_id', ''),
                        "position": chunk.get('position', 0),
                        "metadata": chunk.get('metadata', {})
                    }
                )
                points.append(point)

            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            return True
        except Exception as e:
            print(f"Error storing chunks in Qdrant: {e}")
            return False

    async def search_similar(self, query_embedding: List[float], top_k: int = 5, threshold: float = 0.5) -> List[Dict]:
        """
        Search for similar content chunks based on the query embedding.
        """
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=top_k,
                score_threshold=threshold
            )

            # Format results to match our API contract
            formatted_results = []
            for result in results:
                formatted_results.append({
                    "id": result.id,
                    "content": result.payload.get("content", ""),
                    "similarity_score": result.score,
                    "metadata": result.payload.get("metadata", {})
                })

            return formatted_results
        except Exception as e:
            print(f"Error searching in Qdrant: {e}")
            return []

    async def delete_collection(self) -> bool:
        """
        Delete the entire collection (useful for re-indexing).
        """
        try:
            self.client.delete_collection(self.collection_name)
            return True
        except Exception as e:
            print(f"Error deleting collection: {e}")
            return False

# Singleton instance
qdrant_service = QdrantService()