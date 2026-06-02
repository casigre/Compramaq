export default function Header() {
  return (
    <header className="bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="text-xl font-bold text-zinc-900">
            Alojamiento
          </a>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Dashboard
            </a>
            <a href="/machines" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Máquinas
            </a>
            <a href="/categories" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Categorías
            </a>
            <a
              href="/machines/new"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700"
            >
              + Nueva máquina
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
