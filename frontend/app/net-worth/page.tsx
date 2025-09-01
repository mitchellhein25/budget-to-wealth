'use client';

import React from 'react'
import { useSidebarDetection } from '../hooks';
import { NetWorthSideBar } from './holding-snapshots/components/NetWorthSideBar';

export default function NetWorthPage() {
  const showSidebar = useSidebarDetection();
  return (
    <div className="page-layout">
      {showSidebar && <NetWorthSideBar />}
    </div>
  )
}
