'use client';

import React from 'react'
import { useMobileDetection } from '../hooks';
import { NetWorthSideBar } from './holding-snapshots/components/NetWorthSideBar';

export default function NetWorthPage() {
  const isMobile = useMobileDetection();
  return (
    <div className="page-layout">
      {!isMobile && <NetWorthSideBar />}
    </div>
  )
}
