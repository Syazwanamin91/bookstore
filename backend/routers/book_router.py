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
    
@router.post("/books/bulk", response_model=List[BookResponse], status_code=201)
def create_multiple_books(books: List[BookModel], db: Session = Depends(get_db)):
    """
    Create multiple book records from a list of books.
    """
    new_books_db = []
    for book_data in books:
        # Convert Pydantic model to SQLAlchemy model instance
        new_book = Book(**book_data.model_dump())
        new_books_db.append(new_book)
    
    # Add all new books to the session at once
    db.add_all(new_books_db)
    # Commit the single transaction
    db.commit()
    
    # Refresh each object to get the database-generated values (like id)
    for book in new_books_db:
        db.refresh(book)
        
    return new_books_db