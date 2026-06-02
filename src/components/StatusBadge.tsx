const statusConfig = {
  pending: { label: "Pendiente", class: "bg-yellow-100 text-yellow-800" },
  contacted: { label: "Contactado", class: "bg-blue-100 text-blue-800" },
  bought: { label: "Comprado", class: "bg-green-100 text-green-800" },
  discarded: { label: "Descartado", class: "bg-zinc-100 text-zinc-600" },
} as const;

type Status = keyof typeof statusConfig;

export default function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
      {config.label}
    </span>
  );
}
