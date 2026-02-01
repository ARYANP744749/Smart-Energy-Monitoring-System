import React, { useEffect, useState } from 'react';

export default function SimulatorStatus({ latest }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!latest) {
      setIsOnline(false);
      return;
    }

    const checkStatus = () => {
      const lastTime = new Date(latest.timestamp).getTime();
      const now = Date.now();
      const diffSeconds = (now - lastTime) / 1000;

      setIsOnline(diffSeconds < 10);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => clearInterval(interval);
  }, [latest]);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold
        ${isOnline
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}
      `}
    >
      <span
        className={`w-3 h-3 rounded-full
          ${isOnline ? 'bg-green-500' : 'bg-red-500'}
        `}
      ></span>

      <span className="uppercase tracking-wide">
        Simulator {isOnline ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}
