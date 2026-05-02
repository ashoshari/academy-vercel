import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import {
  isElementFullScreen,
  toggleElementFullscreen,
} from "./videoPlayerUtils";

function syncFullscreenState(
  containerRef: RefObject<HTMLElement | null>,
  set: (v: boolean) => void,
) {
  set(isElementFullScreen(containerRef.current));
}

export function useLessonVideoFullscreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sync = useCallback(() => {
    syncFullscreenState(containerRef, setIsFullscreen);
  }, []);

  useEffect(() => {
    const onFsChange = () => syncFullscreenState(containerRef, setIsFullscreen);
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener(
      "webkitfullscreenchange",
      onFsChange as EventListener,
    );
    document.addEventListener(
      "mozfullscreenchange",
      onFsChange as EventListener,
    );
    document.addEventListener(
      "MSFullscreenChange",
      onFsChange as EventListener,
    );
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFsChange as EventListener,
      );
      document.removeEventListener(
        "mozfullscreenchange",
        onFsChange as EventListener,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        onFsChange as EventListener,
      );
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      await toggleElementFullscreen(el);
    } catch {
      /* policy / unsupported */
    }
    sync();
  }, [sync]);

  return { containerRef, isFullscreen, toggleFullscreen };
}
