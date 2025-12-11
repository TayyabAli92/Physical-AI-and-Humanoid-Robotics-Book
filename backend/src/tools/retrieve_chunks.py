from typing import Dict, Any, List
from backend.src.services.qdrant_service import QdrantService
from backend.utils.config import config

class RetrieveChunksTool:
    """
    Tool for retrieving relevant text chunks from the knowledge base based on the query.
    """
    def __init__(self):
        self.qdrant_service = QdrantService()

    def __call__(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieve relevant chunks based on the query.
        """
        # This would typically be called by the agent framework
        # For now, we'll create a synchronous version that can be integrated later
        import asyncio
        import warnings
        warnings.filterwarnings("ignore", category=DeprecationWarning)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(self.async_retrieve_chunks(query, top_k))
        finally:
            loop.close()

    async def async_retrieve_chunks(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Asynchronously retrieve relevant chunks based on the query.
        """
        # First, we need to embed the query
        from backend.src.services.embedding_service import CohereEmbeddingService
        embedding_service = CohereEmbeddingService()

        query_embedding = await embedding_service.embed_text(query)

        # Search for similar chunks in Qdrant
        results = await self.qdrant_service.search_similar(
            query_embedding=query_embedding,
            top_k=top_k
        )

        # Format results to match OpenAI function calling format
        formatted_results = []
        for result in results:
            formatted_results.append({
                "id": result.get("id", ""),
                "text": result.get("text", ""),
                "source_path": result.get("source_path", ""),
                "score": result.get("score", 0.0)
            })

        return formatted_results

# For OpenAI function calling compatibility
def retrieve_chunks_function(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """
    Function that can be registered with OpenAI agent tools.
    """
    tool = RetrieveChunksTool()
    return tool(query, top_k)