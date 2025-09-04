'use client';

import React from 'react'
import { useSidebarDetection } from '@/app/hooks';
import { NetWorthSideBar } from '@/app/net-worth';

export function NetWorthPage() {
  const showSidebar = useSidebarDetection();
  return (
    <div className="page-layout">
      {showSidebar && <NetWorthSideBar />}
    </div>
  )
}
