'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = (): TimeLeft => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
      
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate, mounted]);

  if (!mounted) {
    // Return a placeholder to prevent hydration mismatch
    return (
      <div className="flex justify-center space-x-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="bg-white rounded-lg shadow-md p-4 min-w-[80px]">
              <div className="text-2xl font-bold text-primary-600">--</div>
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                {['Days', 'Hours', 'Mins', 'Secs'][i]}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds }
  ];

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className="text-center">
        <div className="bg-green-100 border border-green-300 rounded-lg p-6">
          <div className="text-2xl font-bold text-green-800 mb-2">🎉 Premium Features Are Live!</div>
          <div className="text-green-700">Start your premium journey today</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="text-center">
          <div className="bg-white rounded-lg shadow-md p-4 min-w-[80px] transform hover:scale-105 transition-transform duration-200">
            <div className="text-2xl font-bold text-primary-600 tabular-nums">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
              {unit.label}
            </div>
          </div>
          {index < timeUnits.length - 1 && (
            <div className="hidden sm:block absolute top-1/2 transform -translate-y-1/2 text-primary-400 font-bold text-xl" style={{ left: '100%', marginLeft: '0.5rem' }}>
              :
            </div>
          )}
        </div>
      ))}
    </div>
  );
}