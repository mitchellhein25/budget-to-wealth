'use client';

import React from 'react';

export function HistoryToggle({ onToggle, isLoading }: { onToggle: (checked: boolean) => void; isLoading: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <label className="label cursor-pointer gap-2 m-0">
        <input
          type="checkbox"
          className="checkbox"
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className="label-text">Show all history</span>
      </label>
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <span className="loading loading-spinner loading-sm"></span>
          <span>Updating…</span>
        </div>
      )}
    </div>
  );
}


