import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BooksList from '../components/BooksList';
import { useBooksStore } from '../stores/BookStores';

const Index = () => {
  const navigate = useNavigate();
  const { 
    books, 
    loading, 
    error, 
    fetchBooks, 
    deleteBook, 
  } = useBooksStore();

  const goToAddBook = () => {
    navigate('/add-book');
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(bookId);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
              onClick={fetchBooks}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                'Load Books'
              )}
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={goToAddBook}
            >
              Add Books
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Loading Progress Bar */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* Books List */}
          <BooksList 
            books={books} 
            loading={loading}
            onDeleteBook={handleDeleteBook} 
          />
        </div>
      </div>
    </div>
  );
};

export default Index;