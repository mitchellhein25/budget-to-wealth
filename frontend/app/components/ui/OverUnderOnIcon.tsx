import { ArrowUp, Equal, ArrowDown } from 'lucide-react';
import React from 'react'

type OverUnderIconProps ={
  value: number;
  size: number;
  inverted?: boolean;
}

export default function OverUnderOnIcon({ value, size, inverted = false }: OverUnderIconProps) {
    if (value === 0) 
      return <Equal size={size} className="text-yellow-500" />;
    if (inverted ? value > 0 : value < 0) 
      return <ArrowDown size={size} className={inverted ? "text-green-500" : "text-red-500"} />;
    return <ArrowUp size={size} className={inverted ? "text-red-500" : "text-green-500"} />;
}
