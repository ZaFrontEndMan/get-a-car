import { useState, useEffect, useRef, useCallback } from 'react';

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
  
  // Store onChange in ref to avoid stale closures
  const onChangeRef = useRef(onChange);
  const isFirstRender = useRef(true);
  
  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Debounce the value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  // Call onChange when debounced value changes (but not on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Deep comparison for arrays/tuples
    const isEqual = JSON.stringify(debouncedValue) === JSON.stringify(initialValue);
    
    if (!isEqual) {
      onChangeRef.current(debouncedValue);
    }
  }, [debouncedValue]); // Only depend on debouncedValue

  // Stable setter function
  const setValueCallback = useCallback((newValue: T) => {
    setValue(newValue);
  }, []);

  return [value, setValueCallback, debouncedValue];
};
