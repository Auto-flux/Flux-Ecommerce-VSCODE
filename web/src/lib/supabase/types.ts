export type Tenant = {
  id: string
  name: string
  subdomain: string
  active: boolean
  theme_config: Record<string, unknown>
  created_at: string
}

export type Category = {
  id: string
  tenant_id: string
  name: string
  slug: string
  position: number
}

export type Product = {
  id: string
  tenant_id: string
  catalog_id: string
  category_id: string | null
  title: string
  slug: string
  description: string | null
  price: number
  sku: string | null
  attributes: Record<string, unknown>
  created_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  attributes: Record<string, unknown>
  price: number | null
  stock: number | null
  sku: string | null
}

export type MediaAsset = {
  id: string
  tenant_id: string
  product_id: string | null
  kind: 'image' | 'video'
  path: string
  variants: Record<string, unknown>
  position: number
}

export type ClickLog = {
  id: string
  tenant_id: string
  product_id: string | null
  event: 'whatsapp_click' | 'product_view' | 'visit'
  session_hash: string
  utm: Record<string, unknown>
  created_at: string
}

export type Catalog = {
  id: string
  tenant_id: string
  version: number
  status: 'draft' | 'processing' | 'error' | 'published'
  source_file: Record<string, unknown> | null
  diagnostics: Record<string, unknown>
  created_at: string
  published_at: string | null
}
