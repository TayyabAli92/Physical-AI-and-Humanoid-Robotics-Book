from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class ContentChunkBase(BaseModel):
    book_content_id: str
    content: str
    token_count: int
    position: int
    metadata: Optional[dict] = {}


class ContentChunkCreate(ContentChunkBase):
    embedding_vector: Optional[List[float]] = None


class ContentChunkUpdate(BaseModel):
    content: Optional[str] = None
    embedding_vector: Optional[List[float]] = None


class ContentChunk(ContentChunkBase):
    id: str
    embedding_vector: Optional[List[float]] = None
    created_at: datetime

    class Config:
        from_attributes = True