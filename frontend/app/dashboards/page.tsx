'use client';

import React from 'react'
import { useSidebarDetection } from '@/app/hooks'
import { DashboardSideBar } from '@/app/dashboards';

export default function DashboardsPage() {
  const showSidebar = useSidebarDetection();
  return (
    <div className="page-layout">
      {showSidebar && <DashboardSideBar />}
    </div>
  )
}
