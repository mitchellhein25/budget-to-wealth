'use client';

import { usePathname } from 'next/navigation';

export function useParentPath(): string {
  const pathname = usePathname();
  const parentSegments = pathname.split('/').slice(0, -1);
  return parentSegments.length > 0 ? `${parentSegments.join('/')}` : '/';
} 