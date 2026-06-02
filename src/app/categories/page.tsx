import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";

export default async function CategoriesPage() {
  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const cats = (categories ?? []) as Category[];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
      </div>

      <div className="grid gap-3">
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-zinc-200 p-4"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-medium text-zinc-900">{cat.name}</p>
              <p className="text-xs text-zinc-400">{cat.color}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
