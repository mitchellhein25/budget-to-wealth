'use client';

import React from 'react';

interface CurrencyInputFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
}

export function CurrencyInputField({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder = "0.00",
  className = "input w-full"
}: CurrencyInputFieldProps) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-500 pointer-events-none z-10">
        $
      </span>
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${className} pl-8`}
      />
    </div>
  );
}
