import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import BookForm from '../components/BookForm';
import { useBooksStore } from '../stores/BookStores';

const EditBook = () => {
  const navigate = useNavigate();
  const { id: bookId } = useParams();
  const {
    updateBookError,
    fetchBookLoading,
    fetchBookError,
    bookLoaded,
    updateBook,
    fetchBookById,
    clearUpdateError
  } = useBooksStore();

  // Form data
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    price: 0,
    qty: 0,
  });

  // Store original data to detect changes
  const [originalData, setOriginalData] = useState({});

  // Form validation
  const [valid, setValid] = useState(false);

  // Computed property to check if there are changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(bookData) !== JSON.stringify(originalData);
  }, [bookData, originalData]);

  // Watch for changes in bookLoaded from store
  useEffect(() => {
    if (bookLoaded) {
      const bookInfo = {
        title: bookLoaded.title,
        author: bookLoaded.author,
        price: bookLoaded.price,
        qty: bookLoaded.qty,
      };
      setBookData({ ...bookInfo });
      setOriginalData({ ...bookInfo });
    }
  }, [bookLoaded]);

  // Fetch book data on component mount
  useEffect(() => {
    if (bookId) {
      fetchBookById(bookId).catch((error) => {
        console.error('Failed to fetch book:', error);
      });
    } else {
      navigate('/');
    }
  }, [bookId, fetchBookById, navigate]);

  // Methods
  const handleUpdateBook = async (formData) => {
    if (!valid || !hasChanges) return;

    try {
      await updateBook(bookId, formData);
      navigate('/');
    } catch (error) {
      console.error('Failed to update book:', error);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Loading state */}
            {fetchBookLoading && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                  </div>
                  <div className="text-gray-600">Loading book data...</div>
                </div>
              </div>
            )}

            {/* Main form card */}
            {!fetchBookLoading && !fetchBookError && (
              <div className="bg-white rounded-lg shadow-md">
                {/* Card Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-800">Edit Book</h2>
                    </div>
                    <button
                    onClick={goBack}
                    className="flex items-center px-4 py-2 border border-gray-300 text-white rounded-md hover:bg-gray-50 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back
                    </button>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <BookForm
                    value={bookData}
                    onChange={setBookData}
                    valid={valid}
                    onValidChange={setValid}
                    onSubmit={handleUpdateBook}
                  />
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6 flex justify-end items-center">
                  
                  <div className="flex items-center space-x-2">
                    {!hasChanges && (
                      <span className="text-sm text-gray-500">No changes detected</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error state */}
            {!fetchBookLoading && fetchBookError && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-4">
                    <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Not Found</h3>
                  <p className="text-gray-600 mb-4">{fetchBookError}</p>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={goBack}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

            {/* Success/Error Messages */}
            {updateBookError && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{updateBookError}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={clearUpdateError}
                >
                  <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;