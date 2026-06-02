"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <a href="/" className="text-lg sm:text-xl font-bold text-zinc-900">
            Máquinas Vistas
          </a>

          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden p-2 rounded-lg hover:bg-zinc-100"
            aria-label="Menú"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <nav className="hidden sm:flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Dashboard</a>
            <a href="/machines" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Máquinas</a>
            <a href="/categories" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Categorías</a>
            <a href="/machines/new" className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700">
              + Nueva máquina
            </a>
          </nav>
        </div>

        {open && (
          <nav className="sm:hidden pb-4 space-y-2">
            <a href="/" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100">Dashboard</a>
            <a href="/machines" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100">Máquinas</a>
            <a href="/categories" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:bg-zinc-100">Categorías</a>
            <a href="/machines/new" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium text-center">+ Nueva máquina</a>
          </nav>
        )}
      </div>
    </header>
  );
}
