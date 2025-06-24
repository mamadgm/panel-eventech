export const API_BASE_URL = "http://127.0.0.1:8000";

export function errorPrint(mes, error) {
  console.error(mes, error.message);
  console.error(mes, error.response?.data ?? "No response data");
}


