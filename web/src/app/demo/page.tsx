import { headers } from 'next/headers'

export default async function Demo() {
  const h = await headers()
  const tenant = h.get('x-tenant') ?? 'default'
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h2 className="text-2xl font-semibold">Contexto de Tenant</h2>
      <p className="mt-2 text-gray-300">Tenant detectado: <span className="text-emerald-400 font-mono">{tenant}</span></p>
      <p className="mt-6 text-gray-400 text-sm">Configure um subdomínio para ver a detecção dinâmica de tenant em produção.</p>
    </main>
  )
}