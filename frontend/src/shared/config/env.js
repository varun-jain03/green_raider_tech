const DEFAULT_API_BASE_URL = "https://teamtaskmanager-backend-cwun.onrender.com/api";

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
