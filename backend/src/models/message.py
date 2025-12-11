from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class RetrievedChunk(BaseModel):
    """
    Model for a chunk retrieved for a message.
    """
    text: str
    source_path: str
    score: float

class Message(BaseModel):
    """
    Model representing individual message in a chat conversation.
    """
    message_id: str
    session_id: str
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    retrieved_chunks: Optional[List[RetrievedChunk]] = []

class MessageCreate(BaseModel):
    """
    Model for creating new messages.
    """
    session_id: str
    role: str
    content: str
    retrieved_chunks: Optional[List[RetrievedChunk]] = []

class MessageUpdate(BaseModel):
    """
    Model for updating messages.
    """
    content: Optional[str] = None
    retrieved_chunks: Optional[List[RetrievedChunk]] = []