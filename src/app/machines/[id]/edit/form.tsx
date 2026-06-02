"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Machine, MachineImage, Category } from "@/lib/types";
import MachineForm from "@/components/MachineForm";
import type { MachineFormData } from "@/lib/types";

interface Props {
  machine: Machine & { images: MachineImage[] };
  categories: Category[];
}

export default function EditMachineForm({ machine, categories }: Props) {
  const router = useRouter();

  const handleSubmit = async (data: MachineFormData) => {
    const { error } = await supabase
      .from("machines")
      .update({
        name: data.name,
        brand: data.brand || null,
        model: data.model || null,
        year: data.year ? parseInt(data.year) : null,
        hours: data.hours ? parseInt(data.hours) : null,
        kms: data.kms ? parseInt(data.kms) : null,
        specs: data.specs || null,
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
      .eq("id", machine.id);

    if (error) {
      alert("Error al actualizar: " + error.message);
      return;
    }

    // Eliminar imágenes existentes que ya no se quieren
    const currentUrls = machine.images.map((i) => i.url);
    const removedUrls = currentUrls.filter(
      (url) => !data.existing_images.includes(url)
    );
    for (const url of removedUrls) {
      const img = machine.images.find((i) => i.url === url);
      if (img) {
        await supabase.storage.from("machine-images").remove([img.storage_path]);
        await supabase.from("machine_images").delete().eq("id", img.id);
      }
    }

    // Subir nuevas imágenes
    if (data.images.length > 0) {
      const nextOrder = machine.images.length;
      const uploads = data.images.map(async (file, i) => {
        const path = `${machine.id}/${Date.now()}-${file.name}`;
        await supabase.storage.from("machine-images").upload(path, file);
        const { data: urlData } = supabase.storage.from("machine-images").getPublicUrl(path);
        return {
          machine_id: machine.id,
          storage_path: path,
          url: urlData.publicUrl,
          sort_order: nextOrder + i,
        };
      });
      const imageRecords = await Promise.all(uploads);
      await supabase.from("machine_images").insert(imageRecords);
    }

    router.push(`/machines/${machine.id}`);
    router.refresh();
  };

  return <MachineForm machine={machine} categories={categories} onSubmit={handleSubmit} />;
}
