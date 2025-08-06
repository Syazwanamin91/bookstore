from sqlalchemy import Column, Integer, String, Double
from db.db_connection import Base
from pydantic import BaseModel
from typing import Optional

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=True)
    author = Column(String, nullable=True)
    price = Column(Double, nullable=True)
    qty = Column(Integer, default=0)

class BookModel(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    price: Optional[float] = None
    qty: Optional[int] = 0

class BookResponse(BaseModel):
    id: int
    title: Optional[str] = None
    author: Optional[str] = None
    price: Optional[float] = None
    qty: Optional[int] = 0
    
    class Config:
        from_attributes = True


