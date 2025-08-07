import React from 'react';
import { useNavigate } from 'react-router-dom';

const BooksList = ({ books = [], loading = false, onDeleteBook }) => {
  const navigate = useNavigate();

  const editBook = (bookId) => {
    navigate(`/edit-book/${bookId}`);
  };

  // Show info message when no books and not loading
  if (books.length === 0 && !loading) {
    return (
      <div className="w-full">
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              No books found. Click "Load Books" to fetch data or "Add Books" to create new ones.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <div 
          key={book.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
        >
          {/* Card Header */}
          <div className="p-6 flex-grow">
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
              {book.title}
            </h2>
            
            {/* Author */}
            <p className="text-gray-600 text-sm mb-4">
              by {book.author}
            </p>
            
            {/* Price */}
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ${book.price}
            </div>
            
            {/* Quantity */}
            <div className="text-sm text-gray-500">
              Quantity: {book.qty}
            </div>
          </div>

          {/* Card Actions */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex gap-2">
            <button
              className="flex-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors duration-200"
              onClick={() => editBook(book.id)}
            >
              Edit
            </button>
            
            <button
              className={`flex-1 px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
              onClick={() => onDeleteBook(book.id)}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                  Delete
                </div>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksList;