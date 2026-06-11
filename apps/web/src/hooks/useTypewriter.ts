import { useEffect, useState } from "react";

export function useTypewriter(text: string, delay = 18): string {
  const [output, setOutput] = useState("");

  useEffect(() => {
    setOutput("");
    if (!text) return;

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setOutput(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, delay);

    return () => window.clearInterval(timer);
  }, [delay, text]);

  return output;
}
