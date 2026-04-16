'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function TimerBar({ duration = 30, onExpire, paused = false }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const expiredRef = useRef(false);
  const { t } = useI18n();

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setTimeLeft(duration);
    }, 0);
    expiredRef.current = false;
    return () => clearTimeout(resetTimer);
  }, [duration]);

  useEffect(() => {
    if (paused) {
      return undefined;
    }

    if (timeLeft <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }

      return undefined;
    }

    const timer = setTimeout(() => {
      setTimeLeft((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [onExpire, paused, timeLeft]);

  const percent = Math.max(0, (timeLeft / duration) * 100);
  const barColor =
    timeLeft > 15 ? 'bg-green-500' : timeLeft > 7 ? 'bg-yellow-500' : 'bg-red-500';
  const textColor =
    timeLeft > 15 ? 'text-green-400' : timeLeft > 7 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="mb-4 w-full">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-500">{t('quiz.time_left')}</span>
        <span className={`text-sm font-bold ${textColor} ${timeLeft <= 7 ? 'animate-pulse' : ''}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className={`h-2.5 rounded-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

