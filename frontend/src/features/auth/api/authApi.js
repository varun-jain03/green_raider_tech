import { apiFetch } from '../../../shared/api/client';

export const authApi = {
  register: (payload) =>
    apiFetch('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => apiFetch('/auth/login', { method: 'POST', body: payload })
};
