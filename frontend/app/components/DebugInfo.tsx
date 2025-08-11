'use client';

import React, { useEffect, useState } from 'react';

export function DebugInfo() {
  const [debugData, setDebugData] = useState<{
    timestamp: string;
    userAgent: string;
    url: string;
    cookies: string;
    localStorage: string[];
    sessionStorage: string[];
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const data = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      cookies: document.cookie,
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage),
    };
    setDebugData(data);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 btn btn-sm btn-circle btn-ghost bg-base-200"
        title="Show Debug Info"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-auto bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Debug Information</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>
      </div>
      
      {debugData && (
        <div className="text-xs space-y-2">
          <div>
            <strong>Timestamp:</strong> {debugData.timestamp}
          </div>
          <div>
            <strong>URL:</strong> {debugData.url}
          </div>
          <div>
            <strong>User Agent:</strong> {debugData.userAgent}
          </div>
          <div>
            <strong>Cookies:</strong> {debugData.cookies || 'None'}
          </div>
          <div>
            <strong>Local Storage:</strong> {debugData.localStorage.join(', ') || 'None'}
          </div>
          <div>
            <strong>Session Storage:</strong> {debugData.sessionStorage.join(', ') || 'None'}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-base-300">
        <button
          onClick={() => {
            console.log('Debug - Full debug data:', debugData);
            console.log('Debug - All console logs:', console);
          }}
          className="btn btn-xs btn-outline w-full"
        >
          Log to Console
        </button>
      </div>
    </div>
  );
}
