-- Seed data for testing (run in Supabase SQL Editor)

-- Create a test tenant
insert into public.tenants (id, name, subdomain, theme_config)
values 
  ('00000000-0000-0000-0000-000000000001', 'Loja Exemplo', 'exemplo', '{"primary": "#36D399"}')
on conflict (id) do nothing;

-- Create categories
insert into public.categories (id, tenant_id, name, slug, position)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Eletrônicos', 'eletronicos', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Moda', 'moda', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Casa e Decoração', 'casa-decoracao', 3)
on conflict (id) do nothing;

-- Create a test catalog
insert into public.catalogs (id, tenant_id, version, status, published_at)
values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 1, 'published', now())
on conflict (id) do nothing;

-- Create sample products
insert into public.products (id, tenant_id, catalog_id, category_id, title, slug, description, price, sku, attributes)
values
  (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Fone de Ouvido Bluetooth Premium',
    'fone-bluetooth-premium',
    'Fone de ouvido sem fio com cancelamento de ruído ativo, bateria de 30h e qualidade de áudio superior.',
    299.90,
    'FON-BT-001',
    '{"cor": "Preto", "garantia": "12 meses", "marca": "TechSound"}'::jsonb
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Camiseta Básica 100% Algodão',
    'camiseta-basica-algodao',
    'Camiseta de alta qualidade, confortável e durável. Disponível em várias cores.',
    49.90,
    'CAM-BAS-002',
    '{"tamanho": "M", "material": "100% Algodão", "cor": "Branco"}'::jsonb
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    'Luminária LED Inteligente',
    'luminaria-led-inteligente',
    'Controle via app, 16 milhões de cores, compatível com Alexa e Google Home.',
    159.90,
    'LUM-LED-003',
    '{"potencia": "10W", "voltagem": "Bivolt", "conectividade": "Wi-Fi"}'::jsonb
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Mouse Gamer RGB',
    'mouse-gamer-rgb',
    'Mouse com sensor óptico de alta precisão, 7 botões programáveis e iluminação RGB.',
    129.90,
    'MOU-GAM-004',
    '{"dpi": "16000", "conexao": "USB", "peso": "95g"}'::jsonb
  )
on conflict (id) do nothing;
