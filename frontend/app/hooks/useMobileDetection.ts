'use client';

import { useState, useEffect } from "react";

export const MobileState = {
  XSMALL: 'xsmall',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  XLARGE: 'xlarge',
  XXLARGE: 'xxlarge',
} as const;

export function useMobileDetection() {
  const [mobileState, setMobileState] = useState<MobileState>(MobileState.LARGE);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setMobileState(MobileState.XSMALL);
      } else if (width <= 768) {
        setMobileState(MobileState.SMALL);
      } else if (width <= 1024) {
        setMobileState(MobileState.MEDIUM);
      } else if (width <= 1280) {
        setMobileState(MobileState.LARGE);
      } else if (width <= 1536) {
        setMobileState(MobileState.XLARGE);
      } else {
        setMobileState(MobileState.XXLARGE);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return mobileState;
}

export type MobileState = typeof MobileState[keyof typeof MobileState];

export const mobileStateIsSmallOrSmaller = (mobileState: MobileState) => mobileState === MobileState.XSMALL || mobileState === MobileState.SMALL;
export const mobileStateIsMediumOrSmaller = (mobileState: MobileState) => mobileStateIsSmallOrSmaller(mobileState) || mobileState === MobileState.MEDIUM;
export const mobileStateIsSmallOrMedium = (mobileState: MobileState) => mobileState === MobileState.SMALL || mobileState === MobileState.MEDIUM;
export const mobileStateIsMediumOrLarge = (mobileState: MobileState) => mobileState === MobileState.MEDIUM || mobileState === MobileState.LARGE;
export const mobileStateIsXlOrLarger = (mobileState: MobileState) => mobileState === MobileState.XLARGE || mobileState === MobileState.XXLARGE;