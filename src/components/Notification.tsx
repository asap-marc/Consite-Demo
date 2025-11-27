'use client';

import { useState, useEffect } from 'react';

export default function Notification({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const backgroundColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md text-white ${backgroundColor}`}>
      <p>{message}</p>
      <button onClick={onClose} className="absolute top-1 right-1 text-white">&times;</button>
    </div>
  );
}
