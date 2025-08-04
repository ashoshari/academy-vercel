import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const GlobalLoading = () => {
  const isFetching = useIsFetching();

  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isFetching) {
      timer = setTimeout(() => setShow(true), 0);
    } else {
      clearTimeout(timer);
      setShow(false);
    }
    return () => clearTimeout(timer);
  }, [isFetching]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white/70 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="loader mb-2" />
        <div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400 border-solid"></div>
        </div>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoading;
