'use client';

import React from 'react';
import { convertCentsToDollars } from '@/app/components/Utils';

interface TotalDisplayProps {
  label: string;
  amount: number;
  isLoading?: boolean;
  className?: string;
  compact?: boolean;
}

export function TotalDisplay(props: TotalDisplayProps) {
  const paddingClass = props.compact ? 'p-2 sm:p-3' : 'p-3 sm:p-4';
  const minWidthClass = props.compact ? 'lg:min-w-[160px]' : 'lg:min-w-[200px]';
  const labelClass = props.compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base';
  const valueClass = props.compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl';
  return (
    <div className={`bg-base-200 rounded-lg ${paddingClass} w-auto h-min flex flex-col justify-center items-center ${minWidthClass} ${props.className || ''}`}>
      <div className={`${labelClass} font-medium text-base-content/70`}>
        {props.label}
      </div>
      <div className={`${valueClass} font-bold text-base-content`}>
        {props.isLoading ? '...' : convertCentsToDollars(props.amount)}
      </div>
    </div>
  );
}  