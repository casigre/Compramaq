"use client";

import { useState } from "react";

interface SearchFiltersProps {
  categories: { id: string; name: string }[];
  onSearch: (query: string) => void;
  onFilterCategory: (categoryId: string) => void;
  onFilterStatus: (status: string) => void;
  onSort: (sort: string) => void;
}

export default function SearchFilters({
  categories,
  onSearch,
  onFilterCategory,
  onFilterStatus,
  onSort,
}: SearchFiltersProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Buscar máquinas..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          className="w-full pl-9 pr-4 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <select
        onChange={(e) => onFilterCategory(e.target.value)}
        className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => onFilterStatus(e.target.value)}
        className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
      >
        <option value="">Todos los estados</option>
        <option value="pending">Pendiente</option>
        <option value="contacted">Contactado</option>
        <option value="bought">Comprado</option>
        <option value="discarded">Descartado</option>
      </select>

      <select
        onChange={(e) => onSort(e.target.value)}
        className="px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white"
      >
        <option value="created_desc">Más recientes</option>
        <option value="created_asc">Más antiguos</option>
        <option value="price_desc">Precio ↓</option>
        <option value="price_asc">Precio ↑</option>
        <option value="name_asc">Nombre A-Z</option>
      </select>
    </div>
  );
}
