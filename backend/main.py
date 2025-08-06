from fastapi import FastAPI, HTTPException
from db.db_connection import init_table
from routers.book_router import router as book_router

init_table()

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

app.include_router(book_router, prefix="/books", tags=["books"])