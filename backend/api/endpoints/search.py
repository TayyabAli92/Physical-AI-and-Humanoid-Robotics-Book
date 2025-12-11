from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

from ...services.embedding_service import embedding_service
from ...services.qdrant_service import qdrant_service
from ...api.deps import get_api_key

router = APIRouter()


class SearchRequest(BaseModel):
    query_text: str
    top_k: Optional[int] = 5
    threshold: Optional[float] = 0.5


class SearchResult(BaseModel):
    id: str
    content: str
    similarity_score: float
    metadata: Optional[dict] = {}


class SearchResponse(BaseModel):
    results: List[SearchResult]
    query_text: str
    total_results: int


@router.post("/search", response_model=SearchResponse, summary="Search for similar content chunks")
async def search_chunks(
    request: SearchRequest,
    api_key: str = Depends(get_api_key)
):
    """
    Query the vector database for content chunks similar to the input text.
    """
    try:
        # Generate embedding for the query text
        query_embedding = await embedding_service.generate_embedding(request.query_text)

        # Search for similar chunks in Qdrant
        results = await qdrant_service.search_similar(
            query_embedding=query_embedding,
            top_k=request.top_k,
            threshold=request.threshold
        )

        # Format results to match the response model
        formatted_results = []
        for result in results:
            formatted_results.append(SearchResult(
                id=result["id"],
                content=result["content"],
                similarity_score=result["similarity_score"],
                metadata=result.get("metadata", {})
            ))

        return SearchResponse(
            results=formatted_results,
            query_text=request.query_text,
            total_results=len(formatted_results)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error performing search: {str(e)}")