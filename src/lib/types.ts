export interface Machine {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  location: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  link: string | null;
  category_id: string | null;
  status: "pending" | "contacted" | "bought" | "discarded";
  notes: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface MachineImage {
  id: string;
  machine_id: string;
  storage_path: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface SharedList {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface SharedListMachine {
  id: string;
  list_id: string;
  machine_id: string;
  sort_order: number;
  notes: string | null;
}

export type MachineFormData = {
  name: string;
  brand: string;
  model: string;
  location: string;
  description: string;
  price: string;
  currency: string;
  link: string;
  category_id: string;
  status: Machine["status"];
  notes: string;
  is_public: boolean;
  images: File[];
  existing_images: string[];
};
