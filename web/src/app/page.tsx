import Link from 'next/link'

export default function Home() {
    return (
        <main className="mx-auto max-w-5xl p-6">
            <section className="my-16">
                <h1 className="text-4xl font-semibold tracking-tight">Flux-Ecommerce</h1>
                <p className="mt-3 text-gray-300 max-w-2xl">
                    Plataforma whitelabel para gerar landpages premium e catálogos a partir de um upload de catálogo.
                </p>
                <div className="mt-8 flex gap-3">
                    <Link className="rounded-md bg-emerald-500 px-4 py-2 text-black font-medium" href="/demo">Ver demo</Link>
                    <a className="rounded-md border border-gray-700 px-4 py-2" href="https://autoflux.com.br" target="_blank" rel="noreferrer">Marca principal</a>
                </div>
            </section>
        </main>
    )
}
