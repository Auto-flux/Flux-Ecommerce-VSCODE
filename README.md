# Flux-Ecommerce

Monorepo inicial com app Next.js em `web/` e schema do Supabase em `supabase/schema.sql`.

## Requisitos
- Node.js 18+ (recomendado 20+)
- Conta Supabase (crie projeto e obtenha URL/Anon Key)

## Setup rápido

1. Instale dependências:

```powershell
cd web
cmd /c "npm install"
```

2. Configure env:

```powershell
copy .env.local.example .env.local
# edite .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY
```

3. Rode em desenvolvimento:

```powershell
npm run dev
```

Abra http://localhost:3000 e veja `/demo` para validar o tenant header.

## Deploy (resumo)
- Hospede `web/` na Vercel
- Configure DNS wildcard para subdomínios e apontar para a Vercel
- No Supabase, rode `supabase/schema.sql` e configure RLS/JWT claim `tenant_id`

## Próximos passos
- Implementar upload de catálogo e jobs de importação
- Páginas: categorias, produto, busca
- Tracking WhatsApp + dashboard básico
