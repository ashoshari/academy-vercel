// components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    // Delay slightly to let DOM/layout finish
    const timeout = setTimeout(() => {
      const nav = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (nav?.type === "reload") {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }, 50); // 50ms delay works well

    return () => clearTimeout(timeout);
  }, []);

  return null;
};

export default ScrollToTop;
