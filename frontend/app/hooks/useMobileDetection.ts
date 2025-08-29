'use client';

import { useState } from "react";
import { useEffect } from "react";

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(false);
    
    const checkMobile = () => {
      const width = window.innerWidth;
      const mobile = width <= 412;
      setIsMobile(mobile);  
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
