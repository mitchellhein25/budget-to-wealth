'use client';

import React from 'react'
import { useMobileDetection } from '../hooks';
import { NetWorthSideBar } from './holding-snapshots/components/NetWorthSideBar';

export default function NetWorthPage() {
  const isMobile = useMobileDetection();
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      {!isMobile && <NetWorthSideBar />}
    </div>
  )
}
