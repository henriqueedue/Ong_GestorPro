export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Login URL - now points to internal login page
export const getLoginUrl = () => {
  return "/login";
};

// API URL from environment
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:8080";
};