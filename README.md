# Flux-Ecommerce

Plataforma whitelabel multi-tenant para criação automática de landpages e catálogos de e-commerce. Gera páginas premium a partir de upload de catálogo (CSV, XLSX, JSON, XML, PDF).

## Stack

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Postgres + RLS + Auth + Storage)
- **Multi-tenant**: Subdomain routing via middleware
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Funcionalidades Implementadas (MVP)

✅ Multi-tenant com isolamento por RLS  
✅ Middleware de detecção de subdomínio  
✅ Páginas: Home, Produto, Categoria, Busca  
✅ API de upload de catálogo (CSV/JSON)  
✅ Schema completo com tipos TypeScript  
✅ Design premium com Tailwind  

## Setup Local

### 1. Clone e instale dependências

```powershell
git clone https://github.com/Auto-flux/Flux-Ecommerce.git
cd Flux-Ecommerce\web
cmd /c "npm install"
```

### 2. Configure Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. No SQL Editor, execute `supabase/schema.sql`
3. (Opcional) Execute `supabase/seed.sql` para dados de teste
4. Copie URL e Anon Key de **Settings → API**

### 3. Configure variáveis de ambiente

```powershell
copy .env.local.example .env.local
# Edite .env.local com suas credenciais Supabase
```

Exemplo de `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
NEXT_PUBLIC_PRIMARY_BRAND_URL=https://autoflux.com.br
```

### 4. Rode o servidor de desenvolvimento

```powershell
# Opção 1 (recomendado)
node node_modules\next\dist\bin\next dev

# Opção 2 (se npm scripts funcionarem)
npm run dev
```

Acesse: http://localhost:3000

### 5. Teste com dados seed

Se você rodou `seed.sql`, terá:
- Tenant: `exemplo` (ID: `00000000-0000-0000-0000-000000000001`)
- Categorias: Eletrônicos, Moda, Casa e Decoração
- 4 produtos de exemplo

⚠️ **Importante**: Como você está rodando em localhost, o tenant será sempre `default`. Para testar multi-tenancy real:
- Configure wildcard DNS apontando `*.seudominio.com` para sua Vercel
- Deploy na Vercel e acesse `exemplo.seudominio.com`

## Estrutura do Projeto

```
Flux-Ecommerce/
├── web/                      # App Next.js
│   ├── src/
│   │   ├── app/             # Rotas e páginas
│   │   │   ├── produto/[slug]/   # Página de produto
│   │   │   ├── categoria/[slug]/ # Página de categoria
│   │   │   ├── busca/            # Busca
│   │   │   ├── api/catalog/      # API de upload
│   │   │   └── page.tsx          # Home
│   │   ├── lib/
│   │   │   ├── supabase/    # Client, queries, types
│   │   │   └── parsers/     # CSV, JSON, XLSX parsers
│   │   └── styles/          # Tailwind globals
│   └── middleware.ts        # Tenant detection
├── supabase/
│   ├── schema.sql           # Schema completo + RLS
│   └── seed.sql             # Dados de teste
└── docs/
    └── architecture.md      # Decisões de arquitetura
```

## Páginas Disponíveis

- `/` - Home (lista categorias)
- `/categoria/[slug]` - Lista produtos por categoria
- `/produto/[slug]` - Detalhes do produto + WhatsApp
- `/busca?q=termo` - Busca de produtos
- `/demo` - Diagnóstico de tenant

## API Endpoints

### `POST /api/catalog/upload`

Upload de catálogo (CSV, XLSX, JSON).

**Body**: FormData com campo `file`

**Response**:
```json
{
  "tenant": "default",
  "rows": [...],
  "total": 100,
  "message": "Preview OK. Async processing not yet implemented."
}
```

## Deploy

### Vercel (Frontend)

```powershell
# Instale Vercel CLI
npm i -g vercel

# Deploy
cd web
vercel
```

Configure env vars na Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Supabase (Backend)

1. Projeto já configurado com schema
2. Configure JWT custom claims para incluir `tenant_id` (necessário para RLS)
3. Configure storage buckets para mídia (futuro)

### DNS Wildcard (Multi-tenant)

Configure no seu provedor DNS:
```
A    @                  → IP Vercel
CNAME *.seudominio.com  → projeto.vercel.app
```

## Próximos Passos

- [ ] Processar upload assíncrono (import_jobs)
- [ ] Auto-mapping de campos de catálogo
- [ ] Tracking de cliques WhatsApp
- [ ] Dashboard de métricas
- [ ] Upload e otimização de imagens (WebP)
- [ ] SEO: sitemap, meta tags, Schema.org
- [ ] Layouts por nicho (Moda, Perfumaria, etc)
- [ ] Admin panel

## Suporte

- Documentação técnica: `docs/architecture.md`
- Issues: [GitHub Issues](https://github.com/Auto-flux/Flux-Ecommerce/issues)
- Marca principal: [autoflux.com.br](https://autoflux.com.br)
