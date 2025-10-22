export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-900">
      <div className="container py-6 text-sm text-zinc-400">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <span className="brand">MATCH<span className="brand-accent">FLOW</span></span>
          <span className="opacity-60">© {new Date().getFullYear()} MatchFlow</span>
          <span className="opacity-60">For Black Combat style operations</span>
        </div>
      </div>
    </footer>
  )
}