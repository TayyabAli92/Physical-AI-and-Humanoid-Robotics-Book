from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class Embedding(BaseModel):
    """
    Model representing vector representations of book content chunks stored in Qdrant for similarity search.
    """
    id: str
    content_id: str
    vector: List[float]
    metadata: Dict[str, Any]
    created_at: datetime

class EmbeddingCreate(BaseModel):
    """
    Model for creating new embeddings.
    """
    content_id: str
    vector: List[float]
    metadata: Optional[Dict[str, Any]] = {}

class EmbeddingResponse(BaseModel):
    """
    Model for embedding API responses.
    """
    id: str
    content_id: str
    metadata: Dict[str, Any]
    created_at: datetime