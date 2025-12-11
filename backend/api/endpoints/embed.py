from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import tiktoken

from ...services.embedding_service import embedding_service
from ...api.deps import get_api_key

router = APIRouter()


class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: List[float]
    text_length: int
    token_count: int


@router.post("/embed", response_model=EmbedResponse, summary="Generate embedding for text")
async def generate_embedding(
    request: EmbedRequest,
    api_key: str = Depends(get_api_key)
):
    """
    Generate embeddings for provided text content.
    """
    try:
        # Count tokens using tiktoken
        encoding = tiktoken.get_encoding("cl100k_base")
        token_count = len(encoding.encode(request.text))

        # Generate embedding using the service
        embedding = await embedding_service.generate_embedding(request.text)

        return EmbedResponse(
            embedding=embedding,
            text_length=len(request.text),
            token_count=token_count
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error generating embedding: {str(e)}")