"use client";

import { useState } from "react";

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void;
  existingImages?: string[];
  onRemoveExisting?: (index: number) => void;
}

export default function ImageUpload({ onFilesChange, existingImages, onRemoveExisting }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    onFilesChange(fileArray);
    const newPreviews = fileArray.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700 mb-2">
        Imágenes
      </label>

      {existingImages && existingImages.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {existingImages.map((url, i) => (
            <div key={`exist-${i}`} className="relative w-24 h-24 rounded-lg overflow-hidden border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {previews.map((src, i) => (
          <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <label className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 cursor-pointer">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Añadir imágenes
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
      <p className="mt-1 text-xs text-zinc-400">Múltiples imágenes permitidas</p>
    </div>
  );
}
