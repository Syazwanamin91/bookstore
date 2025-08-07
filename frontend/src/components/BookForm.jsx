import React, { useState, useEffect, useCallback, memo } from 'react';
import { BookOpenIcon, UserIcon, CurrencyDollarIcon, CubeIcon } from '@heroicons/react/24/outline';

const InputField = memo(({ 
  name, 
  label, 
  type = 'text', 
  icon: Icon, 
  step, 
  min,
  value,
  onChange,
  onBlur,
  hasError,
  errorMessage,
  ...props 
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          id={name}
          type={type}
          step={step}
          min={min}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          {...props}
        />
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
});

const BookForm = ({ value, onChange, valid, onValidChange, onSubmit }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules - memoized to prevent recreation
  const validateField = useCallback((name, val) => {
    switch (name) {
      case 'title':
        if (!val) return 'Title is required';
        if (val.length < 2) return 'Title must be at least 2 characters';
        return '';
      case 'author':
        if (!val) return 'Author is required';
        if (val.length < 2) return 'Author must be at least 2 characters';
        return '';
      case 'price':
        if (val === null || val === undefined || val === '') return 'Price is required';
        if (val < 0) return 'Price must be 0 or greater';
        return '';
      case 'qty':
        if (val === null || val === undefined || val === '') return 'Quantity is required';
        if (val < 0) return 'Quantity must be 0 or greater';
        if (!Number.isInteger(Number(val))) return 'Quantity must be a whole number';
        return '';
      default:
        return '';
    }
  }, []);

  // Validate all fields - memoized
  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(value).forEach(key => {
      const error = validateField(key, value[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [value, validateField]);

  // Update validation state
  useEffect(() => {
    const isValid = validateForm();
    onValidChange(isValid);
  }, [validateForm, onValidChange]);

  // Memoized change handler
  const handleChange = useCallback((name) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    onChange({
      ...value,
      [name]: val
    });
  }, [value, onChange]);

  // Memoized blur handler
  const handleBlur = useCallback((name) => () => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Memoized submit handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (valid) {
      onSubmit(value);
    }
  }, [valid, onSubmit, value]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <InputField
          name="title"
          label="Book Title"
          icon={BookOpenIcon}
          value={value.title}
          onChange={handleChange('title')}
          onBlur={handleBlur('title')}
          hasError={touched.title && errors.title}
          errorMessage={errors.title}
          required
        />

        <InputField
          name="author"
          label="Author"
          icon={UserIcon}
          value={value.author}
          onChange={handleChange('author')}
          onBlur={handleBlur('author')}
          hasError={touched.author && errors.author}
          errorMessage={errors.author}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            name="price"
            label="Price"
            type="number"
            step="0.01"
            min="0"
            icon={CurrencyDollarIcon}
            value={value.price}
            onChange={handleChange('price')}
            onBlur={handleBlur('price')}
            hasError={touched.price && errors.price}
            errorMessage={errors.price}
            required
          />

          <InputField
            name="qty"
            label="Quantity"
            type="number"
            min="0"
            icon={CubeIcon}
            value={value.qty}
            onChange={handleChange('qty')}
            onBlur={handleBlur('qty')}
            hasError={touched.qty && errors.qty}
            errorMessage={errors.qty}
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!valid}
          className={`px-4 py-2 rounded-md font-medium ${
            valid
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default memo(BookForm);