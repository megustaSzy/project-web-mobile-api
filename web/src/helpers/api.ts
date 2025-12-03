export async function apiFetch<T>(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("❌ Environment NEXT_PUBLIC_API_URL tidak ditemukan.");
  }

  // Hindari double slash
  const fullUrl = `${baseUrl.replace(/\/+$/, "")}${endpoint}`;

  console.log("🌐 Fetching URL:", fullUrl);

  try {
    const response = await fetch(fullUrl, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`❌ HTTP Error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error("🔥 API FETCH ERROR:", error);
    throw error;
  }
}
