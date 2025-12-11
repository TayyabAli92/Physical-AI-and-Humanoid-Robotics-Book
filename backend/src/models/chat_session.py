from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .message import Message  # Importing from the same models package

class ChatSession(BaseModel):
    """
    Model representing user interaction context that maintains conversation history and context.
    """
    session_id: str
    user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: List[Message]

class ChatSessionCreate(BaseModel):
    """
    Model for creating new chat sessions.
    """
    user_id: Optional[str] = None

class ChatSessionUpdate(BaseModel):
    """
    Model for updating chat sessions.
    """
    user_id: Optional[str] = None
    updated_at: datetime