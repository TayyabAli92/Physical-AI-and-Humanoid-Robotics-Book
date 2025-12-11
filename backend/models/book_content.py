from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BookContentBase(BaseModel):
    title: str
    content: str
    source_file: Optional[str] = None


class BookContentCreate(BookContentBase):
    pass


class BookContentUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None


class BookContent(BookContentBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True