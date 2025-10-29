import { useState, useEffect } from 'react';

export default function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: Clear the timeout if the value or delay changes before the timeout fires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Re-run the effect when 'value' or 'delay' changes

  return debouncedValue;
}


