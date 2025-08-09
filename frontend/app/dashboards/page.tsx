'use client';

import React from 'react'
import DashboardSideBar from './components/DashboardSideBar'
import { useMobileDetection } from '@/app/hooks'

export default function DashboardsPage() {
  const isMobile = useMobileDetection();
  return (
    <div className="flex gap-6 p-6 h-full min-h-screen">
      {!isMobile && <DashboardSideBar />}
    </div>
  )
}
