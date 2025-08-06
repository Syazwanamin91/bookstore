from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.db_connection import get_db
from db.models.book_model import Book, BookModel, BookResponse

router = APIRouter()
    
@router.post("/")
def add_book(book_data: BookModel, db: Session = Depends(get_db)):
    try:
        new_book = Book(
            title  = book_data.title,
            author = book_data.author,
            price  = book_data.price,
            qty    = book_data.qty
        )
        db.add(new_book)
        db.commit()

        return {
            "id": new_book.id,
            "data": new_book
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating book: {str(e)}")
    
@router.get("/", response_model=List[BookResponse])
def list_books(db: Session = Depends(get_db)):
    try:
        books = db.query(Book).order_by(Book.id.desc()).all()

        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting book: {str(e)}")

@router.get("/{book_id}", response_model=BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    try:
        book = db.query(Book).filter_by(id=book_id).order_by(Book.id.desc()).first()
        if not book:
            return {"result": "no book found"}

        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting book: {str(e)}")
    
@router.put("/{book_id}/edit")
def update_book(book_id: int, book_data: BookModel, db: Session = Depends(get_db)):
    try:
        book = db.query(Book).filter_by(id=book_id).first()
        if book:
            book.title  = book_data.title
            book.author = book_data.author
            book.price  = book_data.price
            book.qty    = book_data.qty
            
            db.commit()
            db.refresh(book)
            print("Book updated successfully!")

            return {
                "id": book_id,
                "data": book
            }
        else:
            raise HTTPException(status_code=404, detail="Book not found")
            
    except Exception as e:
        db.rollback()  # Add rollback on error
        raise HTTPException(status_code=500, detail=f"Error updating book: {str(e)}")
    
@router.delete("/{book_id}/delete")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    try:
        book = db.query(Book).filter_by(id=book_id).first()
        if book:
            db.delete(book)
            db.commit()
            print("Book deleted successfully!")

            return {"result": "ok"}
        else:
            raise HTTPException(status_code=404, detail="Book not found")
            
    except Exception as e:
        db.rollback()  # Add rollback on error
        raise HTTPException(status_code=500, detail=f"Error deleting book: {str(e)}")