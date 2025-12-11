from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.src.services.embedding_service import CohereEmbeddingService
from backend.src.services.qdrant_service import QdrantService
from backend.src.models.book_content import BookContentCreate
from backend.src.models.embedding import EmbeddingCreate
from backend.src.api.deps import get_embedding_service, get_qdrant_service
from backend.utils.chunker import chunker as Chunker
import uuid
from datetime import datetime

router = APIRouter()

class EmbedRequest(BaseModel):
    content: str
    source_path: Optional[str] = None

class EmbedResponse(BaseModel):
    status: str
    message: str
    chunks_processed: int
    error: Optional[str] = None

@router.post("/embed", response_model=EmbedResponse)
async def embed_content(
    request: EmbedRequest,
    embedding_service: CohereEmbeddingService = Depends(get_embedding_service),
    qdrant_service: QdrantService = Depends(get_qdrant_service)
):
    """
    Create embeddings and upsert to Qdrant.
    """
    try:
        # Chunk the content
        chunker = Chunker()
        chunks = chunker.chunk_text(request.content)

        # Process each chunk
        points_to_upsert = []
        for i, chunk in enumerate(chunks):
            # Generate embedding for the chunk
            embedding = await embedding_service.embed_text(chunk)

            # Prepare payload
            payload = {
                "text": chunk,
                "source_path": request.source_path or "unknown",
                "chunk_index": i,
                "content_length": len(chunk)
            }

            # Create point for Qdrant
            point = {
                "id": str(uuid.uuid4()),
                "vector": embedding,
                "payload": payload
            }

            points_to_upsert.append(point)

        # Upsert all embeddings to Qdrant
        await qdrant_service.upsert_embeddings(points_to_upsert)

        return EmbedResponse(
            status="success",
            message="Embeddings created and stored successfully",
            chunks_processed=len(chunks)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding creation failed: {str(e)}")