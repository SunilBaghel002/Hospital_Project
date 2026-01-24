import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing a value.
 * @param {any} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds (default: 500ms).
 * @returns {any} - The debounced value.
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
