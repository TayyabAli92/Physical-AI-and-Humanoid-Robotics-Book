from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class RetrievedContextBase(BaseModel):
    user_query_id: str
    content_chunks: List[str]  # List of content chunk IDs
    similarity_scores: List[float]


class RetrievedContextCreate(RetrievedContextBase):
    pass


class RetrievedContextUpdate(BaseModel):
    content_chunks: Optional[List[str]] = None


class RetrievedContext(RetrievedContextBase):
    id: str
    retrieval_method: str = "similarity_search"
    timestamp: datetime

    class Config:
        from_attributes = True