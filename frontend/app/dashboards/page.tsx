'use client';

import React from 'react'
import { useMobileDetection, useSidebarDetection } from '@/app/hooks'
import { DashboardSideBar } from './components';

export default function DashboardsPage() {
  const isMobile = useMobileDetection();
  const showSidebar = useSidebarDetection();
  return (
    <div className="page-layout">
      {showSidebar && <DashboardSideBar />}
    </div>
  )
}
