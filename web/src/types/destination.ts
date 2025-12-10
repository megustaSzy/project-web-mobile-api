
export interface ApiDestinationItem {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
  price: number;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
}

// Bentuk response API
export interface ApiDestinationsResponse {
  status: number;
  message: string;
  data: {
    total_items: number;
    total_pages: number;
    current_page: number;
    limit: number;
    items: ApiDestinationItem[];
  };
}

// ─────────────────────────────────────────────────────────────
// Tipe yang dipakai UI (hasil mapping)
export interface DestinationsType {
  id: number; 
  name: string;
  imageUrl: string | null; 
  desc: string;
  price: number;
  category: string;
}
