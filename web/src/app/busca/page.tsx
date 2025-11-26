import { headers } from 'next/headers'
import { searchProducts } from '@/lib/supabase/queries'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const h = await headers()
  const tenantId = h.get('x-tenant') ?? 'default'

  const products = q ? await searchProducts(tenantId, q) : []

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/" className="text-emerald-400 hover:underline text-sm mb-4 inline-block">
        ← Voltar
      </Link>

      <h1 className="text-2xl font-bold mb-4">
        {q ? `Resultados para "${q}"` : 'Buscar produtos'}
      </h1>

      <form method="get" className="mb-8">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Digite o nome do produto..."
          className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </form>

      {!q ? (
        <p className="text-gray-400">Digite algo para buscar.</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link key={p.id} href={`/produto/${p.slug}`} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                <div className="aspect-square bg-gray-700 flex items-center justify-center text-gray-500">
                  Imagem
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{p.title}</h3>
                  <p className="text-emerald-400 font-medium mt-1">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
