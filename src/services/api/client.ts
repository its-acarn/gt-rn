import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.set('Authorization', `Bearer ${authToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: surface global error handling (toast/snackbar) once UI layer is ready.
    return Promise.reject(error);
  }
);
