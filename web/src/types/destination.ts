
export interface ApiDestinationItem {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
  price: number;
  region: string;
  include: string[];
  ketentuan: string[];
  perhatian: string[];
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
  description: string;
  price: number;
   include: string[];
  ketentuan: string[];
  perhatian: string[];
  category: {
    id: number;
    name: string;
  };
  region: string;
};
