"use client";

import { useState, useMemo } from "react";
import type { Machine, MachineImage, Category } from "@/lib/types";
import MachineCard from "@/components/MachineCard";

interface Props {
  machines: Machine[];
  images: MachineImage[];
  categories: Category[];
}

function getFirstImage(machineId: string, images: MachineImage[]) {
  return images.filter((i) => i.machine_id === machineId).sort((a, b) => a.sort_order - b.sort_order)[0];
}

export default function DashboardClient({ machines, images, categories }: Props) {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const brands = useMemo(() => {
    const set = new Set(machines.map((m) => m.brand).filter((b): b is string => b != null));
    return Array.from(set).sort();
  }, [machines]);

  const locations = useMemo(() => {
    const set = new Set(machines.map((m) => m.location).filter((l): l is string => l != null));
    return Array.from(set).sort();
  }, [machines]);

  const filtered = useMemo(() => {
    let result = machines;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.brand?.toLowerCase().includes(q) ||
          m.model?.toLowerCase().includes(q) ||
          m.location?.toLowerCase().includes(q)
      );
    }
    if (filterCategory) {
      result = result.filter((m) => m.category_id === filterCategory);
    }
    if (filterStatus) {
      result = result.filter((m) => m.status === filterStatus);
    }
    return result;
  }, [machines, search, filterCategory, filterStatus]);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            placeholder="Buscar por marca, modelo o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <svg className="absolute left-3 top-3 w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2.5 border border-zinc-300 rounded-lg text-sm bg-white"
          >
            <option value="">Tipo: Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2.5 border border-zinc-300 rounded-lg text-sm bg-white"
          >
            <option value="">Estado: Todos</option>
            <option value="pending">Pendiente</option>
            <option value="contacted">Contactado</option>
            <option value="bought">Comprado</option>
            <option value="discarded">Descartado</option>
          </select>
        </div>
      </div>

      {brands.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSearch(search === brand ? "" : brand)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                search === brand
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-300 hover:border-zinc-900"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-lg">No se encontraron máquinas</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((m) => {
            const firstImage = getFirstImage(m.id, images);
            return (
              <MachineCard
                key={m.id}
                id={m.id}
                name={m.name}
                imageUrl={firstImage?.url}
                brand={m.brand}
                model={m.model}
                price={m.price != null ? Number(m.price) : null}
                currency={m.currency}
                location={m.location}
                status={m.status}
                categoryName={m.category_id ? categoryMap[m.category_id] : null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
