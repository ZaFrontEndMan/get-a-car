import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for debounced slider values
 * @param initialValue - Initial slider value
 * @param delay - Debounce delay in milliseconds
 * @param onChange - Callback function to call when debounced value changes
 * @returns [currentValue, setValue, debouncedValue]
 */
export const useDebouncedSlider = <T>(
  initialValue: T,
  delay: number,
  onChange: (value: T) => void
): [T, (value: T) => void, T] => {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  // Update debounced value after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, initialValue]);

  // Update initial value when it changes
  useEffect(() => {
    setValue(initialValue);
    setDebouncedValue(initialValue);
  }, [initialValue]);

  const setValueCallback = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  return [value, setValueCallback, debouncedValue];
};
