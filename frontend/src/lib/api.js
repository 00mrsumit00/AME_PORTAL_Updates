import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

let slowRequestsCount = 0;
const wakingUpListeners = new Set();

export const subscribeToWakingUp = (listener) => {
  wakingUpListeners.add(listener);
  // Initial callback with current state
  listener(slowRequestsCount > 0);
  return () => {
    wakingUpListeners.delete(listener);
  };
};

const notifyWakingUp = (isWaking) => {
  wakingUpListeners.forEach((listener) => {
    try {
      listener(isWaking);
    } catch (e) {
      console.error("Error in waking up listener:", e);
    }
  });
};

const api = axios.create({ baseURL: `${BACKEND_URL}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ame_token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set up tracking for waking up detection
  config.metadata = { startTime: new Date(), isSlow: false };
  config.wakeupTimeout = setTimeout(() => {
    config.metadata.isSlow = true;
    slowRequestsCount++;
    if (slowRequestsCount === 1) {
      notifyWakingUp(true);
    }
  }, 1500);

  return config;
});

api.interceptors.response.use(
  (response) => {
    const config = response.config;
    if (config) {
      if (config.wakeupTimeout) {
        clearTimeout(config.wakeupTimeout);
      }
      if (config.metadata?.isSlow) {
        slowRequestsCount = Math.max(0, slowRequestsCount - 1);
        if (slowRequestsCount === 0) {
          notifyWakingUp(false);
        }
      }
    }
    return response;
  },
  (error) => {
    const config = error.config;
    if (config) {
      if (config.wakeupTimeout) {
        clearTimeout(config.wakeupTimeout);
      }
      if (config.metadata?.isSlow) {
        slowRequestsCount = Math.max(0, slowRequestsCount - 1);
        if (slowRequestsCount === 0) {
          notifyWakingUp(false);
        }
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("ame_token");
      window.location.href = "/login";
    }
    console.error("API Error:", {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default api;

