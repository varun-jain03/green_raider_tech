import { apiFetch } from "../../../shared/api/client";

export const projectsApi = {
  list: (token) => apiFetch("/projects", { token }),
  create: (token, payload) => apiFetch("/projects", { method: "POST", token, body: payload }),
};
