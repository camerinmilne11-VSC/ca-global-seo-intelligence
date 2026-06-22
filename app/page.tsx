import { createClient } from '@/lib/supabase-server'
import { OpportunityScore } from '@/components/OpportunityScore'
import Link from 'next/link'

export default async function Home() {
  let keywords: Array<{
    id: string
    keyword: string
    priority_score: number
    volume: number
    brand?: { name: string; slug: string } | null
  }> = []

  try {
    const db = await createClient()
    const { data } = await db
      .from('keywords')
      .select('*, brand:brands(name,slug)')
      .eq('content_status', 'opportunity')
      .order('priority_score', { ascending: false })
      .limit(20)
    keywords = data ?? []
  } catch {
    // Supabase not configured — render empty state
  }

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-brand-teal-dark mb-6">
        Top Opportunities — All Brands
      </h2>
      {keywords.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-12 text-center text-gray-400">
          <p className="text-sm">No data yet — configure Supabase to see keyword opportunities.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-neutral">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Keyword</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Volume</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {keywords.map(kw => (
                <tr key={kw.id} className="hover:bg-brand-neutral/50">
                  <td className="px-4 py-3 font-medium text-brand-teal-dark">
                    <Link href={`/${kw.brand?.slug}/keywords`} className="hover:underline">
                      {kw.keyword}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{kw.brand?.name}</td>
                  <td className="px-4 py-3"><OpportunityScore score={kw.priority_score} size="sm" /></td>
                  <td className="px-4 py-3 text-gray-600">{kw.volume?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
