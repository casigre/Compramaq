import { supabase } from "@/lib/supabase";
import type { Machine, MachineImage, Category } from "@/lib/types";
import { notFound } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ShareMachinePage({ params }: Props) {
  const { id } = await params;

  const { data: machine } = await supabase.from("machines").select("*").eq("id", id).eq("is_public", true).single();
  if (!machine) notFound();
  const m = machine as Machine;

  const { data: images } = await supabase
    .from("machine_images")
    .select("*")
    .eq("machine_id", id)
    .order("sort_order");
  const imgs = (images ?? []) as MachineImage[];

  const { data: catData } = m.category_id
    ? await supabase.from("categories").select("name").eq("id", m.category_id).single()
    : { data: null };
  const categoryName = (catData as { name: string } | null)?.name;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        {imgs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
            {imgs.map((img) => (
              <div key={img.id} className="aspect-[4/3] bg-zinc-100 rounded-lg overflow-hidden">
                <img src={img.url} alt={m.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{(m.brand || m.model) ? `${m.brand ?? ""} ${m.model ?? ""}`.trim() : m.name}</h1>
              {categoryName && (
                <p className="text-sm text-zinc-500 mt-1">{categoryName}</p>
              )}
            </div>
            <StatusBadge status={m.status} />
          </div>

          {m.price != null && (
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat("es-ES", { style: "currency", currency: m.currency }).format(Number(m.price))}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm">
            {m.year && (
              <span className="flex items-center gap-1 text-zinc-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {m.year}
              </span>
            )}
            {m.hours != null && (
              <span className="flex items-center gap-1 text-zinc-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {m.hours.toLocaleString()} h
              </span>
            )}
            {m.kms != null && (
              <span className="flex items-center gap-1 text-zinc-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {m.kms.toLocaleString()} km
              </span>
            )}
            {m.location && (
              <span className="flex items-center gap-1 text-zinc-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {m.location}
              </span>
            )}
          </div>

          {m.description && (
            <p className="text-zinc-600 whitespace-pre-wrap">{m.description}</p>
          )}

          {m.specs && (
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 font-medium uppercase mb-1">Características técnicas</p>
              <p className="text-sm text-zinc-700 whitespace-pre-wrap">{m.specs}</p>
            </div>
          )}

          {m.link && (
            <a
              href={m.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver anuncio original
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
