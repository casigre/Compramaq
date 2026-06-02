import { supabase } from "@/lib/supabase";
import type { Machine, MachineImage, Category } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";

async function getData() {
  const { data: machines } = await supabase.from("machines").select("*").order("created_at", { ascending: false }).limit(5);
  const { data: images } = await supabase.from("machine_images").select("*");
  const { data: categories } = await supabase.from("categories").select("*");
  return { machines: (machines ?? []) as Machine[], images: (images ?? []) as MachineImage[], categories: (categories ?? []) as Category[] };
}

function getFirstImage(machineId: string, images: MachineImage[]) {
  return images.filter((i) => i.machine_id === machineId).sort((a, b) => a.sort_order - b.sort_order)[0];
}

export default async function Home() {
  const { machines, images, categories } = await getData();
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const total = machines.length;
  const countByStatus = { pending: 0, contacted: 0, bought: 0, discarded: 0 };
  const prices = machines.filter((m) => m.price != null).map((m) => Number(m.price));
  machines.forEach((m) => { countByStatus[m.status]++; });
  const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Total máquinas</p>
          <p className="text-3xl font-bold mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Pendientes</p>
          <p className="text-3xl font-bold mt-1 text-yellow-600">{countByStatus.pending}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Contactadas</p>
          <p className="text-3xl font-bold mt-1 text-blue-600">{countByStatus.contacted}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Precio medio</p>
          <p className="text-3xl font-bold mt-1">
            {avgPrice > 0
              ? new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(avgPrice)
              : "—"}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Últimas máquinas</h2>
          <a href="/machines" className="text-sm text-zinc-600 hover:text-zinc-900">Ver todas →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {machines.map((m) => {
            const firstImage = getFirstImage(m.id, images);
            return (
              <a key={m.id} href={`/machines/${m.id}`} className="group block bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
                  {firstImage ? (
                    <img src={firstImage.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm text-zinc-900 truncate">{m.name}</h3>
                    <StatusBadge status={m.status} />
                  </div>
                  {m.price != null && (
                    <p className="mt-1 text-base font-semibold text-zinc-900">
                      {new Intl.NumberFormat("es-ES", { style: "currency", currency: m.currency }).format(Number(m.price))}
                    </p>
                  )}
                  {m.category_id && (
                    <p className="mt-0.5 text-xs text-zinc-500">{categoryMap[m.category_id]}</p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
