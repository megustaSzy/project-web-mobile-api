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

  // 🔍 DEBUG TOKEN
  console.log("🔑 ACCESS TOKEN:", token);
  console.log("🌐 API URL:", fullUrl);

  // ⬇️ JANGAN SET CONTENT-TYPE JIKA FormData
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers ?? {}),
  };

  const response = await fetch(fullUrl, {
    ...options,
    method: options.method ?? "GET",
    headers,
  });

  const text = await response.text();

  // ❌ HANDLE ERROR
  if (!response.ok) {
    console.error("❌ API ERROR:", {
      url: fullUrl,
      status: response.status,
      response: text,
    });

    // 🔐 KHUSUS 401
    if (response.status === 401) {
      console.warn("⚠️ TOKEN TIDAK VALID / EXPIRED");
      // optional: Cookies.remove("accessToken");
    }

    throw new Error(text || `HTTP ${response.status}`);
  }

  if (!text) return {} as T;

  return JSON.parse(text) as T;
}
