import { supabase } from './client'
import type { Product, Category } from './types'

export async function getProductBySlug(tenantId: string, slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

export async function getProductsByCategory(tenantId: string, categorySlug: string): Promise<Product[]> {
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('slug', categorySlug)
    .single()

  if (!category) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('category_id', category.id)
    .order('created_at', { ascending: false })

  if (error) return []
  return data ?? []
}

export async function searchProducts(tenantId: string, query: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenantId)
    .ilike('title', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return []
  return data ?? []
}

export async function getCategories(tenantId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('position', { ascending: true })

  if (error) return []
  return data ?? []
}

export async function getMediaForProduct(productId: string) {
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .eq('product_id', productId)
    .order('position', { ascending: true })

  if (error) return []
  return data ?? []
}
