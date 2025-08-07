import { useState, useCallback } from "react";

export const useBooksStore = () => {
  // State
  const [books, setBooks] = useState([]);
  const [addBookLoading, setAddBookLoading] = useState(false);
  const [addBookError, setAddBookError] = useState("");
  const [bookLoaded, setBookLoaded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Getters
  const booksCount = books.length;

  // Actions
  const addBook = useCallback(async (bookData) => {
    try {
      setAddBookLoading(true);
      setAddBookError("");

      const response = await fetch("http://127.0.0.1:8000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: bookData.title,
          author: bookData.author,
          price: Number(bookData.price),
          qty: Number(bookData.qty),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add book: ${response.status}`);
      }

      const result = await response.json();

      // Optionally update local state
      setBooks((prevBooks) => [...prevBooks, result]);

      return result;
    } catch (err) {
      setAddBookError("Failed to add book");
      console.error("Error adding book:", err);
      throw err;
    } finally {
      setAddBookLoading(false);
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://127.0.0.1:8000/books");

      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status}`);
      }

      const result = await response.json();
      setBooks(result);
    } catch (err) {
      setError("Failed to fetch books");
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBook = useCallback(async (bookId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/books/${bookId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete book: ${response.status}`);
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (err) {
      setError("Failed to delete book");
      console.error("Error deleting book:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookById = useCallback(async (bookId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`http://127.0.0.1:8000/books/${bookId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch book: ${response.status}`);
      }

      const result = await response.json();
      setBookLoaded(result);
    } catch (err) {
      setError("Failed to fetch book");
      console.error("Error fetching book:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBook = useCallback(async (bookId, bookData) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/books/${bookId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update book: ${response.status}`);
      }

      const result = await response.json();

      // Update the book in local state
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === bookId ? result : book))
      );

      return result;
    } catch (err) {
      setError("Failed to update book");
      console.error("Error updating book:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    books,
    bookLoaded,
    loading,
    error,
    addBookLoading,
    addBookError,

    // Getters
    booksCount,

    // Actions
    fetchBooks,
    fetchBookById,
    addBook,
    deleteBook,
    updateBook,

    // State setters (if needed for direct manipulation)
    setBooks,
    setBookLoaded,
    setError,
    setAddBookError,
  };
};
