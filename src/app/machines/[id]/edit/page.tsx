import { supabase } from "@/lib/supabase";
import type { Machine, MachineImage, Category } from "@/lib/types";
import { notFound } from "next/navigation";
import EditMachineForm from "./form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMachinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: machine } = await supabase.from("machines").select("*").eq("id", id).single();
  if (!machine) notFound();

  const { data: images } = await supabase
    .from("machine_images")
    .select("*")
    .eq("machine_id", id)
    .order("sort_order");

  const { data: categories } = await supabase.from("categories").select("*").order("name");

  const machineWithImages = {
    ...(machine as Machine),
    images: (images ?? []) as MachineImage[],
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Editar máquina</h1>
      <EditMachineForm
        machine={machineWithImages}
        categories={(categories ?? []) as Category[]}
      />
    </div>
  );
}
