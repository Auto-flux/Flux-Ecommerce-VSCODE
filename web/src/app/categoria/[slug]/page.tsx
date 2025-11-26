import { headers } from 'next/headers'
import { getProductsByCategory, getCategories } from '@/lib/supabase/queries'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const h = await headers()
  const tenantId = h.get('x-tenant') ?? 'default'

  const categories = await getCategories(tenantId)
  const category = categories.find(c => c.slug === slug)
  if (!category) notFound()

  const products = await getProductsByCategory(tenantId, slug)

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/" className="text-emerald-400 hover:underline text-sm mb-4 inline-block">
        ← Voltar
      </Link>

      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>

      {products.length === 0 ? (
        <p className="text-gray-400">Nenhum produto encontrado nesta categoria.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link key={p.id} href={`/produto/${p.slug}`} className="group">
              <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                <div className="aspect-square bg-gray-700 flex items-center justify-center text-gray-500">
                  {/* Placeholder; add media query later */}
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
