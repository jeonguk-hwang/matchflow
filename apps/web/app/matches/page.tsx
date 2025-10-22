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
      <div className="container">
        <div className="card">
          <h2 className="text-xl font-semibold">Match Cards</h2>
          {isLoading && <div>Loading…</div>}
          {error && <div className="text-red-400">에러가 발생했어요.</div>}
          <div className="grid gap-3 mt-3">
            {data?.map((m) => (
              <div key={m.id} className="card p-3">
                <div className="flex gap-3 items-center">
                  <span className="badge">{m.status}</span>
                  <strong>{m.red}</strong>
                  <span className="opacity-60">vs</span>
                  <strong>{m.blue}</strong>
                  <span className="ml-auto opacity-80">{m.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}