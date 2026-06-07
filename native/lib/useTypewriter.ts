import { useEffect, useRef, useState } from "react";
export function useTypewriter(target: string, speed = 24, startDelay = 0) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const i = useRef(0);
  useEffect(() => {
    i.current = 0; setShown(""); setDone(false);
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      i.current += 1;
      setShown(target.slice(0, i.current));
      if (i.current >= target.length) { setDone(true); return; }
      const ch = target[i.current - 1];
      t = setTimeout(tick, ch === "." ? speed * 12 : ch === "," ? speed * 6 : speed);
    };
    const start = setTimeout(tick, startDelay);
    return () => { clearTimeout(start); clearTimeout(t); };
  }, [target, speed, startDelay]);
  return { shown, done };
}
