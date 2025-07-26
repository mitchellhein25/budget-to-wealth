'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-xl font-bold text-primary ${className}`}>
      <Image 
        src="/favicon.ico" 
        alt="Budget to Wealth Logo" 
        width={24} 
        height={24} 
        className="w-6 h-6"
      />
      Budget to Wealth
    </Link>
  );
} 