import "./index.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppRoutes from "./routes";

import "./i18n/config.ts";
import { Toaster } from "react-hot-toast";
import "leaflet/dist/leaflet.css";
// import GlobalLoading from "./components/platform/globalLoading.tsx";

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
