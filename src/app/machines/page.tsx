import { supabase } from "@/lib/supabase";
import type { Machine, MachineImage, Category } from "@/lib/types";
import MachineCard from "@/components/MachineCard";

async function getData() {
  const { data: machines } = await supabase.from("machines").select("*").order("created_at", { ascending: false });
  const { data: images } = await supabase.from("machine_images").select("*");
  const { data: categories } = await supabase.from("categories").select("*");
  return {
    machines: (machines ?? []) as Machine[],
    images: (images ?? []) as MachineImage[],
    categories: (categories ?? []) as Category[],
  };
}

function getFirstImage(machineId: string, images: MachineImage[]) {
  return images.filter((i) => i.machine_id === machineId).sort((a, b) => a.sort_order - b.sort_order)[0];
}

export default async function MachinesPage() {
  const { machines, images, categories } = await getData();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));
  const machineImages = Object.fromEntries(machines.map((m) => [m.id, images.filter((i) => i.machine_id === m.id)]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Máquinas</h1>
        <a
          href="/machines/new"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700"
        >
          + Nueva máquina
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {machines.map((m) => {
          const firstImage = getFirstImage(m.id, images);
          return (
            <MachineCard
              key={m.id}
              id={m.id}
              name={m.name}
              brand={m.brand}
              model={m.model}
              price={m.price != null ? Number(m.price) : null}
              currency={m.currency}
              location={m.location}
              status={m.status}
              imageUrl={firstImage?.url}
              categoryName={m.category_id ? categoryMap[m.category_id]?.name : null}
            />
          );
        })}
      </div>

      {machines.length === 0 && (
        <div className="text-center py-16 text-zinc-400">
          <p className="text-lg">No hay máquinas todavía</p>
          <a href="/machines/new" className="text-zinc-900 underline mt-2 inline-block">
            Añadir la primera
          </a>
        </div>
      )}
    </div>
  );
}
