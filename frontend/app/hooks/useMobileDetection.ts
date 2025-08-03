import { useState } from "react";
import { useEffect } from "react";

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(true);
    
    const checkMobile = () => {
      const width = window.screen.width;
      const mobile = width < 768;
      setIsMobile(mobile);  
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isDesktop ? isMobile : false;
}