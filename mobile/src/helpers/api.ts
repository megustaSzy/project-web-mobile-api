const BASE_URL = "http://10.0.2.2:3000/api"; // sesuaikan

export async function apiFetch(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}
