import Link from 'next/link'
import { headers } from 'next/headers'
import { getCategories } from '@/lib/supabase/queries'

export default async function Home() {
    const h = await headers()
    const tenantId = h.get('x-tenant') ?? 'default'
    const categories = await getCategories(tenantId)

    return (
        <main className="mx-auto max-w-6xl px-6 py-8">
            <section className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Bem-vindo à nossa loja</h1>
                <p className="mt-3 text-gray-300 max-w-2xl mx-auto">
                    Navegue pelas categorias e encontre o que você precisa.
                </p>
                <Link
                    href="/busca"
                    className="mt-6 inline-block bg-emerald-500 text-black px-6 py-2 rounded-lg font-medium hover:bg-emerald-400 transition"
                >
                    Buscar produtos
                </Link>
            </section>

            {categories.length > 0 && (
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Categorias</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map(cat => (
                            <Link
                                key={cat.id}
                                href={`/categoria/${cat.slug}`}
                                className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition"
                            >
                                <h3 className="font-semibold text-lg">{cat.name}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="mt-16 text-center text-gray-400 text-sm">
                <Link href="/demo" className="hover:text-emerald-400">Ver configuração de tenant</Link>
                {' • '}
                <a href="https://autoflux.com.br" target="_blank" rel="noreferrer" className="hover:text-emerald-400">
                    Powered by Autoflux
                </a>
            </section>
        </main>
    )
}