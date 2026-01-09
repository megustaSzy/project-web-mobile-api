const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;
// contoh:
// http://192.168.1.10:3000
// https://api.wisatamu.com

type ApiResponse<T> = {
  data: T;
};

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    console.error("Response bukan JSON:", text);
    throw new Error("Invalid JSON response");
  }
}
