import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import BookForm from '../components/BookForm';
import { useBooksStore } from '../stores/BookStores';

const AddBook = () => {
  const navigate = useNavigate();
  const { addBook, addBookLoading, addBookError } = useBooksStore();

  // Form data
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    price: 0,
    qty: 0,
  });

  // Form validation
  const [valid, setValid] = useState(false);

  // Methods
  const handleAddBook = async () => {
    if (!valid) return;

    try {
      await addBook(bookData);

      // Reset form on success
      setBookData({
        title: '',
        author: '',
        price: 0,
        qty: 0,
      });

      navigate('/');
    } catch (error) {
      console.error('Failed to add book:', error);
    }
  };

  const goBack = () => {
    navigate('/');
  };

return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <PlusIcon className="w-6 h-6 mr-2 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">Add New Book</h2>
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
              onSubmit={handleAddBook}
            />

            {addBookLoading && (
              <div className="flex items-center justify-end">
                <div className="flex items-center text-sm font-medium text-gray-700 ">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray mr-2"></div>
                    Adding...
                  </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {addBookError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{addBookError}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBook;