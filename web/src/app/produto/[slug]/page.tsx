import { headers } from 'next/headers'
import { getProductBySlug, getMediaForProduct } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const h = await headers()
  const tenantId = h.get('x-tenant') ?? 'default'

  const product = await getProductBySlug(tenantId, slug)
  if (!product) notFound()

  const media = await getMediaForProduct(product.id)
  const whatsappMsg = encodeURIComponent(
    `Olá! Gostaria de saber mais sobre: ${product.title} (Cód: ${product.sku || product.id})`
  )
  const whatsappLink = `https://wa.me/5511999999999?text=${whatsappMsg}`

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link href="/" className="text-emerald-400 hover:underline text-sm mb-4 inline-block">
        ← Voltar
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {media.length > 0 ? (
            <div className="relative w-full aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <Image
                src={media[0].path}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full aspect-square bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
              Sem imagem
            </div>
          )}
          {media.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {media.slice(1, 5).map((m, idx) => (
                <div key={idx} className="relative aspect-square bg-gray-800 rounded overflow-hidden">
                  <Image src={m.path} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-emerald-400 text-2xl font-semibold mt-2">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
          {product.sku && (
            <p className="text-gray-400 text-sm mt-1">Cód: {product.sku}</p>
          )}

          {product.description && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Descrição</h2>
              <p className="text-gray-300 leading-relaxed">{product.description}</p>
            </div>
          )}

          {Object.keys(product.attributes).length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Ficha Técnica</h2>
              <dl className="space-y-1 text-sm">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="text-gray-400 font-medium">{key}:</dt>
                    <dd className="text-gray-200">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-8 block w-full bg-emerald-500 text-black text-center font-semibold py-3 rounded-lg hover:bg-emerald-400 transition"
          >
            Comprar via WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
