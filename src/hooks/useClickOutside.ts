import { RefObject, useEffect } from "react";

type ClickOutsideEvent = MouseEvent | TouchEvent;

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: (event: ClickOutsideEvent) => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: ClickOutsideEvent) => {
      const el = ref.current;
      if (!el) return;
      if (el.contains(event.target as Node)) return;
      onOutside(event);
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [enabled, onOutside, ref]);
}

