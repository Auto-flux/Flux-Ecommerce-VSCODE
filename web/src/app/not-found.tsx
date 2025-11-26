import Link from 'next/link'

export default function NotFound() {
    return (
        <main className="mx-auto max-w-2xl px-6 py-16 text-center">
            <h1 className="text-6xl font-bold text-emerald-400">404</h1>
            <h2 className="mt-4 text-2xl font-semibold">Página não encontrada</h2>
            <p className="mt-3 text-gray-400">
                A página que você está procurando não existe ou foi movida.
            </p>
            <Link
                href="/"
                className="mt-8 inline-block bg-emerald-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-emerald-400 transition"
            >
                Voltar para home
            </Link>
        </main>
    )
}
