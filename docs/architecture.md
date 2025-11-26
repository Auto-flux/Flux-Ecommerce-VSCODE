# Flux-Ecommerce — Arquitetura (MVP)

- Frontend: Next.js (App Router, TS, Tailwind)
- Backend: Supabase (Postgres + RLS, Auth, Storage)
- Multi-tenant: Subdomínio → `x-tenant` via `middleware.ts` → consultas filtradas por `tenant_id`
- Catálogo: Import job cria versões, publica e dispara revalidação de páginas
- Mídia: Upload para Supabase Storage, WebP/otimização (fase 2)
- Tracking: Hash de sessão + logs de clique via endpoint/Edge Function

## Rotas (MVP)
- `/` Home do tenant (SSG + revalidate)
- `/categoria/[slug]` Lista de produtos
- `/produto/[slug]` Produto com botão WhatsApp
- `/busca` Busca simples
- `/demo` Página de diagnóstico de tenant

## Páginas Estáticas
- FAQ / Políticas / Contato (templates em `page_content`)

## SEO
- Titles/Descriptions automáticos, Sitemap por tenant, Schema.org Product/ItemList

## Segurança
- RLS por `tenant_id` em todas as tabelas de dados do cliente
- Logs com `session_hash` anônimo
