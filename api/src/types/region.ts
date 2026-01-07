export interface CreateRegionDTO {
  name: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface UpdateRegionDTO {
  name?: string;
  imageUrl?: string;
  imagePublicId?: string;
}
