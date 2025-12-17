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
    ...(options.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(fullUrl, {
    ...options,
    method: options.method ?? "GET",
    credentials: "include",
    headers,
  });

  const contentType = response.headers.get("content-type");
  const text = await response.text();

  if (!response.ok) {
    console.error("❌ API ERROR:", {
      url: fullUrl,
      status: response.status,
      response: text,
    });
    throw new Error(`HTTP ${response.status}`);
  }

  if (!contentType || !contentType.includes("application/json")) {
    console.error("❌ RESPONSE BUKAN JSON:", {
      url: fullUrl,
      contentType,
      response: text,
    });
    throw new Error("Response is not JSON");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    console.error("❌ GAGAL PARSE JSON:", text);
    throw new Error("Invalid JSON");
  }
}