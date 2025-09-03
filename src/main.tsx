import "./index.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRoutes from "./routes";

import "./i18n/config.ts";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
// import GlobalLoading from "./components/platform/globalLoading.tsx";

import DisableDevtool from "disable-devtool";
import devtools from "devtools-detect";

const isProduction = import.meta.env.MODE === "production"; // ✅ check env

if (isProduction) {
  document.onkeydown = function (e: any) {
    if (e.keyCode == 123) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "C".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "X".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "Y".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "Z".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "V".charCodeAt(0)) {
      return false;
    }
    if (e.keyCode == 67 && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      return false;
    }
    if (
      e.keyCode == "J".charCodeAt(0) &&
      e.altKey &&
      (e.ctrlKey || e.metaKey)
    ) {
      return false;
    }
    if (
      e.keyCode == "I".charCodeAt(0) &&
      e.altKey &&
      (e.ctrlKey || e.metaKey)
    ) {
      return false;
    }
    if (
      (e.keyCode == "V".charCodeAt(0) && e.metaKey) ||
      (e.metaKey && e.altKey)
    ) {
      return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "S".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "H".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "A".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "F".charCodeAt(0)) {
      return false;
    }
    if (e.ctrlKey && e.keyCode == "E".charCodeAt(0)) {
      return false;
    }
  };

  if (document.addEventListener) {
    document.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
  } else {
    // For very old IE browsers, fallback to setting oncontextmenu directly
    document.oncontextmenu = function () {
      return false;
    };
  }

  if (devtools.isOpen) {
    DisableDevtool({ url: "https://youtu.be/ZJcR20KjVJM?t=20" });
  } else {
    DisableDevtool({ url: "https://youtu.be/ZJcR20KjVJM?t=20" });
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
// import * as Sentry from "@sentry/react";

// Sentry.init({
//   dsn: "https://fc24befc39e8318d79dc6d7411d41d27@o4509301056995328.ingest.de.sentry.io/4509301074886736",
//   // Setting this option to true will send default PII data to Sentry.
//   // For example, automatic IP address collection on events
//   sendDefaultPii: true,
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration(),
//   ],
//   // Tracing
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });

document.body.dir = localStorage.getItem("i18nextLng") === "ar" ? "rtl" : "ltr";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Loading...</div>}>
        <AppRoutes />
        {/* <GlobalLoading /> */}
        <Toaster />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>
);
