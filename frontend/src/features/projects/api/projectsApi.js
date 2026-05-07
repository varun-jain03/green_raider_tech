import { apiFetch } from "../../../shared/api/client";

export const projectsApi = {
  list: (token) => apiFetch("/projects", { token }),
  create: (token, payload) => apiFetch("/projects", { method: "POST", token, body: payload }),
  addMember: (token, projectId, userId) =>
    apiFetch(`/projects/${projectId}/members`, { method: "POST", token, body: { userId } }),
  removeMember: (token, projectId, userId) =>
    apiFetch(`/projects/${projectId}/members/${userId}`, { method: "DELETE", token }),
};
