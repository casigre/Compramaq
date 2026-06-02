"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";

const presetColors = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#14b8a6", "#6b7280", "#f97316", "#84cc16",
];

export default function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formColor, setFormColor] = useState("#3b82f6");
  const [formIcon, setFormIcon] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const resetForm = () => {
    setFormName("");
    setFormColor("#3b82f6");
    setFormIcon("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;
    const { data, error } = await supabase
      .from("categories")
      .insert({ name: formName.trim(), color: formColor, icon: formIcon || "category" })
      .select()
      .single();
    if (error) { alert(error.message); return; }
    setCategories((prev) => [...prev, data as Category]);
    resetForm();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !editingId) return;
    const { error } = await supabase
      .from("categories")
      .update({ name: formName.trim(), color: formColor, icon: formIcon || "category" })
      .eq("id", editingId);
    if (error) { alert(error.message); return; }
    setCategories((prev) =>
      prev.map((c) => (c.id === editingId ? { ...c, name: formName.trim(), color: formColor, icon: formIcon || "category" } : c))
    );
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta categoría? Las máquinas asociadas quedarán sin categoría.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setFormName(cat.name);
    setFormColor(cat.color);
    setFormIcon(cat.icon);
    setIsAdding(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold">Categorías</h1>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700"
          >
            + Nueva categoría
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={editingId ? handleUpdate : handleCreate} className="bg-white rounded-xl border border-zinc-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Color</label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${formColor === color ? "border-zinc-900 scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={formColor}
                onChange={(e) => setFormColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Icono (nombre Material Symbol)</label>
            <input
              type="text"
              value={formIcon}
              onChange={(e) => setFormIcon(e.target.value)}
              placeholder="settings, grid_view, hardware..."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700">
              {editingId ? "Guardar cambios" : "Crear categoría"}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between bg-white rounded-xl border border-zinc-200 p-4">
            <div className="flex items-center gap-4">
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
            <div className="flex gap-2">
              <button onClick={() => startEdit(cat)} className="text-sm text-zinc-500 hover:text-zinc-900">
                Editar
              </button>
              <button onClick={() => handleDelete(cat.id)} className="text-sm text-red-500 hover:text-red-700">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !isAdding && (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-lg">No hay categorías</p>
        </div>
      )}
    </div>
  );
}
