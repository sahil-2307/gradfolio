import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0
  });

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      
      // Additional mobile-specific checks
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUserAgent = /mobile|android|iphone|ipad|phone|tablet/.test(userAgent);
      
      // Override with more specific mobile detection
      if (width <= 768 && (isTouchDevice || isMobileUserAgent)) {
        setIsMobile(true);
      }
    };

    checkDevice();
    
    const handleResize = () => {
      checkDevice();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    screenSize,
    orientation: screenSize.height > screenSize.width ? 'portrait' : 'landscape'
  };
};