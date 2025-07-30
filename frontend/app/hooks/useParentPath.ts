'use client';

import { usePathname } from 'next/navigation';

export function useParentPath(): string {
  const pathname = usePathname();
  
  if (!pathname || pathname === '/' || pathname === '') {
    return '/';
  }
  
  const cleanPath = pathname.replace(/\/+$/, '');
  const segments = cleanPath.split('/').filter(segment => segment !== '');
  
  if (segments.length <= 1) 
    return '/';
  
  return '/' + segments.slice(0, -1).join('/');
} 