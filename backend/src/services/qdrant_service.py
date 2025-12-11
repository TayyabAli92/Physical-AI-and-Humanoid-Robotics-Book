from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Any, Optional
from backend.utils.config import config

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(
            url=config.QDRANT_URL,
            api_key=config.QDRANT_API_KEY,
            prefer_grpc=True
        )
        self.collection_name = config.QDRANT_COLLECTION_NAME
        self.vector_size = 1024  # Cohere embedding dimension
        self._create_collection_if_not_exists()

    def _create_collection_if_not_exists(self):
        """
        Create the collection if it doesn't exist.
        """
        try:
            # Check if collection exists
            self.client.get_collection(self.collection_name)
        except:
            # Create collection if it doesn't exist
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=self.vector_size,
                    distance=models.Distance.COSINE
                )
            )

    async def upsert_embedding(self, point_id: str, embedding: List[float], payload: Dict[str, Any]):
        """
        Upsert a single embedding with its payload to Qdrant.
        """
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload=payload
                )
            ]
        )

    async def upsert_embeddings(self, points: List[Dict[str, Any]]):
        """
        Upsert multiple embeddings to Qdrant.
        """
        qdrant_points = []
        for point in points:
            qdrant_points.append(
                models.PointStruct(
                    id=point["id"],
                    vector=point["vector"],
                    payload=point["payload"]
                )
            )

        self.client.upsert(
            collection_name=self.collection_name,
            points=qdrant_points
        )

    async def search_similar(self, query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar embeddings in Qdrant.
        """
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k
        )

        results = []
        for result in search_results:
            results.append({
                "id": result.id,
                "score": result.score,
                "payload": result.payload,
                "text": result.payload.get("text", ""),
                "source_path": result.payload.get("source_path", "")
            })

        return results

    async def verify_embeddings_exist(self) -> bool:
        """
        Check if any embeddings exist in the collection.
        """
        try:
            count = self.client.count(
                collection_name=self.collection_name
            )
            return count.count > 0
        except:
            return False

    async def delete_collection(self):
        """
        Delete the entire collection (useful for re-indexing).
        """
        self.client.delete_collection(self.collection_name)