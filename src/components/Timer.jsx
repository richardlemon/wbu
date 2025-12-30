import React, { useState, useEffect } from 'react';
import { speak } from '../utils/voice';

const Timer = ({ duration, onComplete, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime === 30) {
            speak("Nog 30 seconden te gaan");
          }

          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(interval);
      if (isActive) {
          onComplete();
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress for circle
  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex flex-col items-center justify-center relative">
       {/* Progress Circle Logic */}
       <div className="relative w-64 h-64">
         <svg className="w-full h-full" viewBox="0 0 100 100">
           <circle
             className="text-stone-200 stroke-current"
             strokeWidth="8"
             cx="50"
             cy="50"
             r="40"
             fill="transparent"
           />
           <circle
             className="text-sage stroke-current transition-all duration-1000 ease-linear"
             strokeWidth="8"
             strokeLinecap="round"
             cx="50"
             cy="50"
             r="40"
             fill="transparent"
             strokeDasharray="251.2"
             strokeDashoffset={251.2 - (251.2 * progress) / 100}
             transform="rotate(-90 50 50)"
           />
         </svg>
         <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-slate-900">{formatTime(timeLeft)}</span>
         </div>
       </div>
    </div>
  );
};

export default Timer;
