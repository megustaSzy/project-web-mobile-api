const BASE_URL = "https://domain-api-kamu.com"; // GANTI

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`);
  if (!res.ok) throw new Error("API Error");
  return res.json();
}

/* ================= REGION ================= */
export async function getRegions() {
  const res = await apiGet<any>("/api/region");
  return res.data.items ?? [];
}

/* ================= CATEGORY ================= */
export async function getCategories() {
  const res = await apiGet<any>("/api/category");
  return res.data.items ?? [];
}

/* ================= DESTINATION ================= */
export async function getDestinations(params?: {
  regionId?: number;
  categoryId?: number;
}) {
  const q = new URLSearchParams();

  if (params?.regionId)
    q.append("region_id", String(params.regionId));
  if (params?.categoryId)
    q.append("category_id", String(params.categoryId));

  const res = await apiGet<any>(`/api/destinations?${q.toString()}`);
  return res.data.items ?? [];
}
