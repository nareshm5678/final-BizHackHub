import { useState, useEffect, useCallback } from 'react';

export const useTimer = (isRunning) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setTimer(0);
  }, []);

  return {
    time: timer,
    reset: resetTimer
  };
};