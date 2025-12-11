from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BookContent(BaseModel):
    """
    Model representing the source material from the Docusaurus book that will be chunked and embedded for RAG.
    """
    id: str
    title: str
    content: str
    source_path: str
    created_at: datetime
    updated_at: datetime

class BookContentCreate(BaseModel):
    """
    Model for creating new book content.
    """
    title: str
    content: str
    source_path: Optional[str] = None

class BookContentUpdate(BaseModel):
    """
    Model for updating existing book content.
    """
    title: Optional[str] = None
    content: Optional[str] = None
    source_path: Optional[str] = None