import { useState, useEffect } from 'react';

const checkDevice = () => {
  if (typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, width: 0, height: 0 };
  }
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUserAgent = /mobile|android|iphone|ipad|phone|tablet/.test(userAgent);
  
  const isMobile = width <= 768 && (isTouchDevice || isMobileUserAgent || width <= 768);
  const isTablet = width > 768 && width <= 1024;
  
  return { isMobile, isTablet, width, height };
};

export const useMobileDetection = () => {
  const initialState = checkDevice();
  const [isMobile, setIsMobile] = useState(initialState.isMobile);
  const [isTablet, setIsTablet] = useState(initialState.isTablet);
  const [screenSize, setScreenSize] = useState({
    width: initialState.width,
    height: initialState.height
  });

  useEffect(() => {
    const handleResize = () => {
      const deviceInfo = checkDevice();
      setScreenSize({ width: deviceInfo.width, height: deviceInfo.height });
      setIsMobile(deviceInfo.isMobile);
      setIsTablet(deviceInfo.isTablet);
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