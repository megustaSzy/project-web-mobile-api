export const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// Tipe body bebas tapi tetap aman (unknown)
type BodyType = Record<string, unknown>;

// GET Request
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("GET API Error: " + res.statusText);
  }

  return res.json() as Promise<T>;
}

// POST Request
export async function apiPost<T>(path: string, body: BodyType): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("POST API Error: " + res.statusText);
  }

  return res.json() as Promise<T>;
}

// GET + Token
export async function apiGetAuth<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("AUTH API Error: " + res.statusText);
  }

  return res.json() as Promise<T>;
}
