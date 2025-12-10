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

  // console.log("🌐 Fetching URL:", fullUrl);

  // Ambil token dari cookies
  const token = Cookies.get("accessToken");

  // console.log(token)

  // Set header default
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // otomatis kirim token
    ...(options.headers ?? {}),
  };

  try {
    const response = await fetch(fullUrl, {
      ...options,
      method: options.method ?? "GET",
      credentials: "include", // kirim cookies bila diperlukan
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `❌ HTTP Error ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as T;
    return data;

  } catch (error) {
    console.error("🔥 API FETCH ERROR:", error);
    throw error;
  }
}