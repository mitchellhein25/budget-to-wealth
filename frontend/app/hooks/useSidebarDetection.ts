'use client';

import { useState } from "react";
import { useEffect } from "react";
import { MobileState, mobileStateIsMediumOrSmaller, useMobileDetection } from "./useMobileDetection";

export function useSidebarDetection() {
  const [showSidebar, setShowSidebar] = useState(true);
  const mobileState = useMobileDetection();

  useEffect(() => {    
    const checkSidebar = () => {
      const showSidebar = !mobileStateIsMediumOrSmaller(mobileState);
      setShowSidebar(showSidebar);  
    };

    checkSidebar();
  }, [mobileState]);

  return showSidebar;
}
