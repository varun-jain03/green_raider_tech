import { apiFetch } from "../../../shared/api/client";

export const tasksApi = {
  list: (token, query = {}) => apiFetch("/tasks", { token, query }),
  create: (token, payload) => apiFetch("/tasks", { method: "POST", token, body: payload }),
  update: (token, id, payload) => apiFetch(`/tasks/${id}`, { method: "PATCH", token, body: payload }),
};
