'use client';

import { useState, useEffect } from "react";
import { mobileStateIsMediumOrSmaller, useMobileDetection } from "@/app/hooks";

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
