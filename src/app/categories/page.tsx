import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import CategoriesManager from "./categories-manager";

export default async function CategoriesPage() {
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  return <CategoriesManager initialCategories={(categories ?? []) as Category[]} />;
}
