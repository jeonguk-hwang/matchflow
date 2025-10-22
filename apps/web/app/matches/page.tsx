'use client'
import Navbar from '@/components/navbar'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

type Match = { id: string; event: string; red: string; blue: string; status: 'scheduled' | 'changed' | 'canceled' | 'finished' }

export default function MatchesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => (await api.get<Match[]>('/matches')).data
  })

  return (
    <>
      <Navbar />
      <div className="container section">
        <h2 className="brand text-2xl">Match Cards</h2>
        <div className="mt-4">
          {isLoading && <div>Loading…</div>}
          {error && <div className="text-red-400">에러가 발생했어요.</div>}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.map((m) => (
              <article key={m.id} className="card p-4">
                <div className="flex items-center gap-2">
                  <span className={`badge ${m.status !== 'scheduled' ? 'badge-accent' : ''}`}>{m.status}</span>
                  <span className="ml-auto text-xs opacity-70">{m.event}</span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-lg">
                  <strong className="truncate">{m.red}</strong>
                  <span className="opacity-60">vs</span>
                  <strong className="truncate">{m.blue}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
