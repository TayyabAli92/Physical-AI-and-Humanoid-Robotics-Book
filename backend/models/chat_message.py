from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatMessageBase(BaseModel):
    chat_session_id: str
    role: str  # 'user' or 'assistant'
    content: str


class ChatMessageCreate(ChatMessageBase):
    source_chunks: Optional[List[str]] = []


class ChatMessageUpdate(BaseModel):
    content: Optional[str] = None


class ChatMessage(ChatMessageBase):
    id: str
    timestamp: datetime
    source_chunks: Optional[List[str]] = []

    class Config:
        from_attributes = True