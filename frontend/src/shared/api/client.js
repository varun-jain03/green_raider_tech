import { API_BASE_URL } from "../config/env";

export async function apiFetch(endpoint, { method = "GET", body, token, query } = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const result = await response.json();
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request failed");
  }

  return result.data;
}
