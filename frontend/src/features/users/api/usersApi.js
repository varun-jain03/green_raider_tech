import { apiFetch } from '../../../shared/api/client';

export const usersApi = {
  list: (token) => apiFetch('/users', { token }),
  me: (token) => apiFetch('/users/me', { token })
};
