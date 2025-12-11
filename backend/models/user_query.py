from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserQueryBase(BaseModel):
    chat_session_id: str
    query_text: str
    highlighted_text: Optional[str] = None


class UserQueryCreate(UserQueryBase):
    pass


class UserQueryUpdate(BaseModel):
    highlighted_text: Optional[str] = None


class UserQuery(UserQueryBase):
    id: str
    timestamp: datetime
    context_provided: bool = False

    class Config:
        from_attributes = True