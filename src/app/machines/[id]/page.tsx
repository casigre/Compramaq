import { supabase } from "@/lib/supabase";
import type { Machine, MachineImage, Category } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import ShareButton from "@/components/ShareButton";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MachineDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: machine } = await supabase.from("machines").select("*").eq("id", id).single();
  if (!machine) notFound();
  const m = machine as Machine;

  const { data: images } = await supabase
    .from("machine_images")
    .select("*")
    .eq("machine_id", id)
    .order("sort_order");
  const imgs = (images ?? []) as MachineImage[];

  const { data: category } = m.category_id
    ? await supabase.from("categories").select("name").eq("id", m.category_id).single()
    : { data: null };
  const catName = (category as { name: string } | null)?.name;

  const shareUrl = m.is_public
    ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/machines/${id}/share`
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <a href="/machines" className="text-sm text-zinc-500 hover:text-zinc-900">← Volver</a>
      </div>

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
              <h1 className="text-2xl font-bold">{m.name}</h1>
              {catName && (
                <p className="text-sm text-zinc-500 mt-1">{catName}</p>
              )}
            </div>
            <StatusBadge status={m.status} />
          </div>

          {m.price != null && (
            <p className="text-3xl font-bold">
              {new Intl.NumberFormat("es-ES", { style: "currency", currency: m.currency }).format(Number(m.price))}
            </p>
          )}

          {m.description && (
            <p className="text-zinc-600 whitespace-pre-wrap">{m.description}</p>
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

          {m.notes && (
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-xs text-zinc-500 font-medium uppercase mb-1">Notas</p>
              <p className="text-sm text-zinc-700 whitespace-pre-wrap">{m.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            {shareUrl && <ShareButton url={shareUrl} />}
            <Link
              href={`/machines/${m.id}/edit`}
              className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Editar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
