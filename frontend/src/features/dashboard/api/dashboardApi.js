import { apiFetch } from "../../../shared/api/client";

export const dashboardApi = {
  getStats: (token) => apiFetch("/dashboard/stats", { token }),
};
