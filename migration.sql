-- Ejecutar en SQL Editor de Supabase para añadir los nuevos campos
ALTER TABLE machines ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE machines ADD COLUMN IF NOT EXISTS model TEXT;
ALTER TABLE machines ADD COLUMN IF NOT EXISTS location TEXT;

CREATE INDEX IF NOT EXISTS idx_machines_brand ON machines(brand);
