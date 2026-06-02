-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLAS
-- ============================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  icon TEXT NOT NULL DEFAULT 'gear'
);

CREATE TABLE machines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  location TEXT,
  description TEXT,
  price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'EUR',
  link TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','contacted','bought','discarded')),
  notes TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE machine_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shared_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shared_list_machines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  list_id UUID NOT NULL REFERENCES shared_lists(id) ON DELETE CASCADE,
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  notes TEXT,
  UNIQUE(list_id, machine_id)
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_machines_status ON machines(status);
CREATE INDEX idx_machines_category ON machines(category_id);
CREATE INDEX idx_machines_created ON machines(created_at DESC);
CREATE INDEX idx_machine_images_machine ON machine_images(machine_id);
CREATE INDEX idx_machine_images_order ON machine_images(machine_id, sort_order);
CREATE INDEX idx_shared_lists_slug ON shared_lists(slug);
CREATE INDEX idx_shared_list_machines_list ON shared_list_machines(list_id);

-- ============================================================
-- FUNCIÓN PARA ACTUALIZAR updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER machines_updated_at
  BEFORE UPDATE ON machines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_list_machines ENABLE ROW LEVEL SECURITY;

-- Políticas: solo el dueño (por ahora asumimos un solo usuario via anon key)
-- En producción se reemplazaría con auth.uid()

CREATE POLICY "Allow full access to categories" ON categories
  USING (true);

CREATE POLICY "Allow full access to machines" ON machines
  USING (true);

CREATE POLICY "Allow full access to machine_images" ON machine_images
  USING (true);

CREATE POLICY "Allow full access to shared_lists" ON shared_lists
  USING (true);

CREATE POLICY "Allow full access to shared_list_machines" ON shared_list_machines
  USING (true);

-- ============================================================
-- BUCKET DE STORAGE
-- ============================================================
-- Ejecutar en SQL Editor de Supabase:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('machine-images', 'machine-images', true);
--
-- Luego en Storage > Policies agregar:
--   SELECT: true (público)
--   INSERT: true (anon)
--   DELETE: true (anon)
-- ============================================================

-- ============================================================
-- DATOS INICIALES
-- ============================================================

INSERT INTO categories (name, color, icon) VALUES
  ('Tornos', '#3b82f6', 'settings'),
  ('Fresadoras', '#10b981', 'grid_view'),
  ('Taladros', '#f59e0b', 'hardware'),
  ('Rectificadoras', '#8b5cf6', 'precision_manufacturing'),
  ('Prensas', '#ef4444', 'compression'),
  ('Cizallas', '#ec4899', 'content_cut'),
  ('CNC', '#14b8a6', 'memory'),
  ('Otra', '#6b7280', 'category');
