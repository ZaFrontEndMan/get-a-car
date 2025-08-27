
import { useState, useEffect } from 'react';

export const useBookingViewMode = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  // Set default view mode based on screen size - always grid for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Mobile screen
        setViewMode('grid'); // Changed from 'table' to 'grid' for better mobile experience
      }
    };

    // Set initial view mode
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    viewMode,
    setViewMode
  };
};
