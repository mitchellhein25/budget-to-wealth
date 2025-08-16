'use client';

import React from 'react'
import { NetWorthSideBar } from '../holding-snapshots/components/NetWorthSideBar';
import { useMobileDetection } from '@/app/hooks';

export default function InvestmentReturnsPage() {
  const isMobile = useMobileDetection();
  return (
    <div className="flex gap-6 pt-6 px-6 pb-0 h-full min-h-screen">
      {!isMobile && <NetWorthSideBar />}
    </div>
  )
}
