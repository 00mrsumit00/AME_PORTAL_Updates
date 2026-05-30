import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Service Worker Handling
if ("serviceWorker" in navigator) {
  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  
  if (isLocal) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length > 0) {
        for (let registration of registrations) {
          registration.unregister();
        }
        // Force a one-time reload to clear the service worker's control
        window.location.reload();
      }
    });
  } else if (process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }
}
