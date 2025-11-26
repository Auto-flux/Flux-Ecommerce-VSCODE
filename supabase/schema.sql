-- Flux-Ecommerce initial schema (MVP)
-- Note: Configure JWT claim `tenant_id` in Supabase Auth for isolation policies.

create extension if not exists "uuid-ossp";

-- Tenants
create table if not exists public.tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  subdomain text unique not null,
  active boolean not null default true,
  theme_config jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Users (link to auth.users by uid)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  auth_uid uuid not null unique,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  role text not null default 'admin',
  created_at timestamp with time zone default now()
);

-- Categories
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  slug text not null,
  position int not null default 0,
  unique(tenant_id, slug)
);

-- Catalog versions
create table if not exists public.catalogs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  version int not null,
  status text not null default 'draft', -- draft | processing | error | published
  source_file jsonb,
  diagnostics jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  published_at timestamp with time zone,
  unique(tenant_id, version)
);

-- Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  catalog_id uuid not null references public.catalogs(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  title text not null,
  slug text not null,
  description text,
  price numeric(12,2) not null default 0,
  sku text,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  unique(tenant_id, slug)
);

-- Product variants
create table if not exists public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references public.products(id) on delete cascade,
  attributes jsonb not null default '{}'::jsonb,
  price numeric(12,2),
  stock int,
  sku text
);

-- Media assets
create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  kind text not null, -- image | video
  path text not null,
  variants jsonb not null default '{}'::jsonb,
  position int not null default 0
);

-- Static content templates (FAQ, Políticas, etc.)
create table if not exists public.page_content (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  type text not null, -- faq | policies | contact | about
  blocks jsonb not null default '[]'::jsonb,
  unique(tenant_id, type)
);

-- Import jobs (async processing)
create table if not exists public.import_jobs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  file_ref text not null,
  status text not null default 'queued', -- queued | running | failed | completed
  diagnostics jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default now(),
  finished_at timestamp with time zone
);

-- Click logs (WhatsApp, product views, etc.)
create table if not exists public.click_logs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  event text not null, -- whatsapp_click | product_view | visit
  session_hash text not null,
  utm jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Layout themes per niche
create table if not exists public.layout_theme (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  niche text not null, -- moda | perfumaria | acessorios | etc
  config jsonb not null default '{}'::jsonb
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  type text not null, -- upload_complete | upload_error
  payload jsonb not null default '{}'::jsonb,
  seen boolean not null default false,
  created_at timestamp with time zone default now()
);

-- RLS
alter table public.tenants enable row level security;
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.catalogs enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.media_assets enable row level security;
alter table public.page_content enable row level security;
alter table public.import_jobs enable row level security;
alter table public.click_logs enable row level security;
alter table public.layout_theme enable row level security;
alter table public.notifications enable row level security;

-- Helper to extract tenant_id claim
create or replace function public.current_tenant() returns uuid language sql stable as $$
  select nullif((current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id'), '')::uuid;
$$;

-- Policies (read/write only within tenant)
create policy if not exists tenant_isolation_select on public.categories for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_mod on public.categories for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_select_products on public.products for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_mod_products on public.products for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_select_catalogs on public.catalogs for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_mod_catalogs on public.catalogs for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_media_s on public.media_assets for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_media_m on public.media_assets for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_click_s on public.click_logs for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_click_i on public.click_logs for insert with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_layout_s on public.layout_theme for select using (tenant_id is null or tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_layout_m on public.layout_theme for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_pages_s on public.page_content for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_pages_m on public.page_content for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_import_s on public.import_jobs for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_import_m on public.import_jobs for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());

create policy if not exists tenant_isolation_notifications_s on public.notifications for select using (tenant_id = public.current_tenant());
create policy if not exists tenant_isolation_notifications_m on public.notifications for all using (tenant_id = public.current_tenant()) with check (tenant_id = public.current_tenant());
