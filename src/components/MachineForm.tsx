"use client";

import { useState } from "react";
import type { Machine, MachineFormData, Category } from "@/lib/types";
import ImageUpload from "./ImageUpload";

interface Props {
  machine?: Machine & { images?: { url: string }[] };
  categories: Category[];
  onSubmit: (data: MachineFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export default function MachineForm({ machine, categories, onSubmit, isSubmitting: externalSubmitting }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = externalSubmitting || isSubmitting;

  const [name, setName] = useState(machine?.name ?? "");
  const [brand, setBrand] = useState(machine?.brand ?? "");
  const [model, setModel] = useState(machine?.model ?? "");
  const [location, setLocation] = useState(machine?.location ?? "");
  const [description, setDescription] = useState(machine?.description ?? "");
  const [price, setPrice] = useState(machine?.price?.toString() ?? "");
  const [currency, setCurrency] = useState(machine?.currency ?? "EUR");
  const [link, setLink] = useState(machine?.link ?? "");
  const [category_id, setCategoryId] = useState(machine?.category_id ?? "");
  const [status, setStatus] = useState(machine?.status ?? "pending");
  const [notes, setNotes] = useState(machine?.notes ?? "");
  const [is_public, setIsPublic] = useState(machine?.is_public ?? false);

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    machine?.images?.map((i) => i.url) ?? []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        brand,
        model,
        location,
        description,
        price,
        currency,
        link,
        category_id,
        status,
        notes,
        is_public,
        images,
        existing_images: existingImages,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Identificador de la máquina"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 mb-1">Marca</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Ej: Haas, Mazak, DMG..."
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Modelo</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Ej: VF-2, ST-20..."
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Ubicación</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej: Barcelona, Madrid..."
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 mb-1">Descripción</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Precio</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Moneda</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="ARS">ARS ($)</option>
            <option value="CLP">CLP ($)</option>
            <option value="MXN">MXN ($)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Link del anuncio</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Categoría</label>
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Machine["status"])}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="pending">Pendiente</option>
            <option value="contacted">Contactado</option>
            <option value="bought">Comprado</option>
            <option value="discarded">Descartado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-700 mb-1">Notas personales</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        <div className="md:col-span-2">
          <ImageUpload
            onFilesChange={setImages}
            existingImages={existingImages}
            onRemoveExisting={(i) => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>

        <div className="md:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="is_public"
            checked={is_public}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-300"
          />
          <label htmlFor="is_public" className="text-sm text-zinc-700">
            Hacer pública esta máquina (generar link compartible)
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-700 disabled:opacity-50"
        >
          {submitting ? "Guardando..." : machine ? "Actualizar máquina" : "Crear máquina"}
        </button>
        <a
          href="/machines"
          className="px-6 py-2.5 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancelar
        </a>
      </div>
    </form>
  );
}
