'use client';

import { useState } from 'react';

export default function NumberSpinner({
  value,
  onChange,
  min = 0,
  max = 20,
  step = 0.5,
}: {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const increment = () => {
    onChange(Math.min(max, value + step));
  };

  const decrement = () => {
    onChange(Math.max(min, value - step));
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={decrement}
        className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
      >
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-16 text-center border-t border-b border-gray-300"
        min={min}
        max={max}
        step={step}
      />
      <button
        type="button"
        onClick={increment}
        className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
      >
        +
      </button>
    </div>
  );
}
