import { useEffect, useRef, useState } from 'react';

/**
 * Zählt von 0 auf `target` hoch, macht am Ende einen kleinen Bounce
 * und meldet über `done`, dass eingefärbt werden darf.
 */
export const useCountUp = (target: number, stepMs = 105) => {
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const [scale, setScale] = useState(1);
  const bounce = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      setDone(true);
      return;
    }

    setValue(0);
    setDone(false);

    // Bei vielen Treffern nicht ewig zählen — Schrittweite anpassen.
    const steps = Math.min(target, 25);
    const increment = Math.ceil(target / steps);

    const timer = setInterval(() => {
      setValue((prev) => {
        const next = prev + increment;
        if (next >= target) {
          clearInterval(timer);
          setDone(true);
          setScale(1.24);
          bounce.current = setTimeout(() => setScale(1), 210);
          return target;
        }
        return next;
      });
    }, stepMs);

    return () => {
      clearInterval(timer);
      clearTimeout(bounce.current);
    };
  }, [target, stepMs]);

  const style: React.CSSProperties = {
    display: 'inline-block',
    fontWeight: 800,
    transform: `scale(${scale})`,
    color: done ? '#4F90DE' : '#b0aeaa',
    transition: 'transform .19s cubic-bezier(.34,1.6,.5,1), color .35s',
  };

  return { value, done, style };
};
