'use client';

import React from 'react';
import { convertCentsToDollars } from './Utils';

interface TotalDisplayProps {
  label: string;
  amount: number;
  isLoading?: boolean;
  className?: string;
}

export default function TotalDisplay(props: TotalDisplayProps) {
  return (
    <div className={`bg-base-200 rounded-lg p-4 min-w-[200px] ${props.className || ''}`}>
      <div className="text-sm font-medium text-base-content/70">
        {props.label}
      </div>
      <div className="text-2xl font-bold text-base-content">
        {props.isLoading ? '...' : convertCentsToDollars(props.amount)}
      </div>
    </div>
  );
} 