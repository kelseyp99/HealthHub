// src/api.ts
// Centralized API utility for backend communication

const API_BASE_URL = "http://localhost:5282";

export async function fetchFromBackend(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}
