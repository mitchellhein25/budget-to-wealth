'use client';

import React from 'react'
import { useMobileDetection, useSidebarDetection } from '../hooks';
import { NetWorthSideBar } from './holding-snapshots/components/NetWorthSideBar';

export default function NetWorthPage() {
  const isMobile = useMobileDetection();
  const showSidebar = useSidebarDetection();
  return (
    <div className="page-layout">
      {showSidebar && <NetWorthSideBar />}
    </div>
  )
}
