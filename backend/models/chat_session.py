from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatSessionBase(BaseModel):
    user_id: Optional[str] = None


class ChatSessionCreate(ChatSessionBase):
    pass


class ChatSessionUpdate(BaseModel):
    active: Optional[bool] = None


class ChatSession(ChatSessionBase):
    id: str
    session_start: datetime
    last_interaction: Optional[datetime] = None
    messages: Optional[List[dict]] = []
    active: bool = True

    class Config:
        from_attributes = True