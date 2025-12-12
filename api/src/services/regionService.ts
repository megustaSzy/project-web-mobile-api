import { createError } from "../utilities/createError";

export const regionService = {
  async getRegencies(id: string) {
    const response = await fetch(
      `https://api-wliayah.vercel.app/region/regencies/${id}`
    );

    if (!response.ok) throw createError("Failed to fetch regencies", 400);

    const apiData = await response.json();

    return apiData.data.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  }
};
