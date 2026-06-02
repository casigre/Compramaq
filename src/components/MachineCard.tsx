import StatusBadge from "./StatusBadge";

interface MachineCardProps {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  status: "pending" | "contacted" | "bought" | "discarded";
  imageUrl?: string | null;
  categoryName?: string | null;
}

export default function MachineCard({ id, name, price, currency, status, imageUrl, categoryName }: MachineCardProps) {
  return (
    <a
      href={`/machines/${id}`}
      className="group block bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] bg-zinc-100 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-zinc-900 truncate">{name}</h3>
          <StatusBadge status={status} />
        </div>
        {price != null && (
          <p className="mt-1 text-lg font-semibold text-zinc-900">
            {new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(price)}
          </p>
        )}
        {categoryName && (
          <p className="mt-1 text-xs text-zinc-500">{categoryName}</p>
        )}
      </div>
    </a>
  );
}
