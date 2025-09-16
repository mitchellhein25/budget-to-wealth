import { ArrowUp, Equal, ArrowDown } from 'lucide-react';
import React from 'react'

export default function OverUnderOnIcon({ value, size }: { value: number, size: number }) {
    if (value === 0) 
      return <Equal size={size} className="text-yellow-500" />;
    if (value > 0) 
      return <ArrowDown size={size} className="text-green-500" />;
    return <ArrowUp size={size} className="text-red-500" />;
}
