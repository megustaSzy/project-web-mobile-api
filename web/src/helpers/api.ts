import Cookies from "js-cookie";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("❌ Environment NEXT_PUBLIC_API_URL tidak ditemukan.");
  }

  const fullUrl = `${baseUrl.replace(/\/+$/, "")}${endpoint}`;

  const token = Cookies.get("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const response = await fetch(fullUrl, {
    ...options,
    method: options.method ?? "GET",
    headers,
  });

  const text = await response.text();

  // ❌ API ERROR
  if (!response.ok) {
    console.error("❌ API ERROR:", {
      url: fullUrl,
      status: response.status,
      response: text,
    });

    throw new Error(text || `HTTP ${response.status}`);
  }

  // ✅ RESPONSE KOSONG (DELETE / 204)
  if (!text) {
    return {} as T;
  }

  // ✅ RESPONSE JSON NORMAL
  return JSON.parse(text) as T;
}
