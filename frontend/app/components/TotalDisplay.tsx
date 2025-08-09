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
  const paddingClass = props.compact ? 'p-2' : 'p-4';
  const minWidthClass = props.compact ? 'lg:min-w-[160px]' : 'lg:min-w-[200px]';
  const labelClass = props.compact ? 'text-xs' : 'text-sm';
  const valueClass = props.compact ? 'text-xl' : 'text-2xl';
  return (
    <div className={`bg-base-200 rounded-lg ${paddingClass} w-full sm:w-auto ${minWidthClass} ${props.className || ''}`}>
      <div className={`${labelClass} font-medium text-base-content/70`}>
        {props.label}
      </div>
      <div className={`${valueClass} font-bold text-base-content`}>
        {props.isLoading ? '...' : convertCentsToDollars(props.amount)}
      </div>
    </div>
  );
} 