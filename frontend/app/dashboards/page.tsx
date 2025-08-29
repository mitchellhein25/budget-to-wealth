'use client';

import React from 'react'
import { useMobileDetection } from '@/app/hooks'
import { DashboardSideBar } from './components';

export default function DashboardsPage() {
  const isMobile = useMobileDetection();
  return (
    <div className="page-layout">
      {!isMobile && <DashboardSideBar />}
    </div>
  )
}
