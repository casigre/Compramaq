"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import MachineForm from "@/components/MachineForm";
import type { MachineFormData } from "@/lib/types";

export default function NewMachineForm({ categories }: { categories: Category[] }) {
  const router = useRouter();

  const handleSubmit = async (data: MachineFormData) => {
    const { data: machine, error } = await supabase
      .from("machines")
      .insert({
        name: data.name,
        brand: data.brand || null,
        model: data.model || null,
        location: data.location || null,
        description: data.description || null,
        price: data.price ? parseFloat(data.price) : null,
        currency: data.currency,
        link: data.link || null,
        category_id: data.category_id || null,
        status: data.status,
        notes: data.notes || null,
        is_public: data.is_public,
      })
      .select()
      .single();

    if (error) {
      alert("Error al crear: " + error.message);
      return;
    }

    // Subir imágenes
    if (data.images.length > 0 && machine) {
      const uploads = data.images.map(async (file, i) => {
        const path = `${machine.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("machine-images")
          .upload(path, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("machine-images").getPublicUrl(path);

        return {
          machine_id: machine.id,
          storage_path: path,
          url: urlData.publicUrl,
          sort_order: i,
        };
      });

      const imageRecords = await Promise.all(uploads);
      const { error: imgError } = await supabase.from("machine_images").insert(imageRecords);
      if (imgError) alert("Error al subir imágenes");
    }

    router.push(`/machines/${machine.id}`);
    router.refresh();
  };

  return <MachineForm categories={categories} onSubmit={handleSubmit} />;
}
