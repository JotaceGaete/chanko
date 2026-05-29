-- ============================================================
-- ChankoCiudadano — Modelo de datos Supabase
-- Plataforma de participación ciudadana ambiental
-- ============================================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- NOTICIAS
-- ============================================================
CREATE TABLE noticias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  resumen TEXT NOT NULL,
  contenido TEXT NOT NULL,
  bloques JSONB NOT NULL DEFAULT '[]'::jsonb,
  imagen_url TEXT,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria TEXT NOT NULL,
  autor TEXT NOT NULL,
  publicada BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE noticias ADD COLUMN IF NOT EXISTS bloques JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- ============================================================
-- EVENTOS
-- ============================================================
CREATE TABLE eventos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagen_url TEXT,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  lugar TEXT NOT NULL,
  region TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('presencial', 'virtual', 'hibrido')),
  inscripcion_url TEXT,
  publicado BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIDEOS
-- ============================================================
CREATE TABLE videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria TEXT NOT NULL,
  publicado BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE videos ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- ============================================================
-- PORTADA
-- ============================================================
CREATE TABLE portada_config (
  id TEXT PRIMARY KEY DEFAULT 'home',
  noticia_id UUID REFERENCES noticias(id) ON DELETE SET NULL,
  evento_id UUID REFERENCES eventos(id) ON DELETE SET NULL,
  video_id UUID REFERENCES videos(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO portada_config (id)
VALUES ('home')
ON CONFLICT (id) DO NOTHING;

-- Bucket publico para imagenes CMS. Crear tambien desde Dashboard si Storage no esta disponible en SQL.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('cms', 'cms', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================
-- ENCUESTAS
-- ============================================================
CREATE TABLE encuestas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  activa BOOLEAN DEFAULT TRUE,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE encuestas ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE TABLE preguntas_encuesta (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  encuesta_id UUID NOT NULL REFERENCES encuestas(id) ON DELETE CASCADE,
  orden INTEGER NOT NULL DEFAULT 0,
  texto TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('opcion_multiple', 'texto_libre', 'escala')),
  opciones JSONB,  -- array de strings para opcion_multiple y escala
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE respuestas_encuesta (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pregunta_id UUID NOT NULL REFERENCES preguntas_encuesta(id) ON DELETE CASCADE,
  respuesta TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PARTICIPACIONES (Apoya la iniciativa)
-- Campos sensibles: email, rut — PRIVADOS, con RLS estricto
-- ============================================================
CREATE TABLE participaciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  posicion TEXT NOT NULL CHECK (posicion IN ('apoyo', 'no_apoyo', 'necesito_info')),
  nombre TEXT NOT NULL,
  comuna TEXT NOT NULL,

  -- CAMPO PRIVADO: nunca exponer en queries públicas
  email TEXT,

  -- CAMPO PRIVADO: almacenar hasheado, nunca exponer
  -- Usar pgcrypto: rut_hash = crypt(rut, gen_salt('bf'))
  rut_hash TEXT,

  comentario TEXT,
  estado_comentario TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_comentario IN ('pendiente', 'aprobado', 'rechazado')),
  ip_hash TEXT,  -- hash de IP para detección de duplicados, nunca exponer
  fecha TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX participaciones_posicion_idx ON participaciones(posicion);
CREATE INDEX participaciones_comuna_idx ON participaciones(comuna);
CREATE INDEX participaciones_estado_comentario_idx ON participaciones(estado_comentario);
CREATE INDEX participaciones_fecha_idx ON participaciones(fecha);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE encuestas ENABLE ROW LEVEL SECURITY;
ALTER TABLE preguntas_encuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE respuestas_encuesta ENABLE ROW LEVEL SECURITY;
ALTER TABLE participaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE portada_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (lectura de contenido publicado)
CREATE POLICY "noticias_publicas" ON noticias
  FOR SELECT TO anon, authenticated
  USING (publicada = TRUE AND archived_at IS NULL);

CREATE POLICY "eventos_publicos" ON eventos
  FOR SELECT TO anon, authenticated
  USING (publicado = TRUE AND archived_at IS NULL);

CREATE POLICY "videos_publicos" ON videos
  FOR SELECT TO anon, authenticated
  USING (publicado = TRUE AND archived_at IS NULL);

CREATE POLICY "encuestas_publicas" ON encuestas
  FOR SELECT TO anon, authenticated
  USING (activa = TRUE AND archived_at IS NULL);

CREATE POLICY "preguntas_publicas" ON preguntas_encuesta
  FOR SELECT TO anon, authenticated
  USING (TRUE);

CREATE POLICY "portada_publica" ON portada_config
  FOR SELECT TO anon, authenticated
  USING (TRUE);

CREATE POLICY "storage_cms_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'cms');

CREATE POLICY "storage_cms_admin_all" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'cms' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK (bucket_id = 'cms' AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Políticas admin: asignar app_metadata.role = 'admin' al usuario Supabase Auth.
CREATE POLICY "noticias_admin_all" ON noticias
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "eventos_admin_all" ON eventos
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "videos_admin_all" ON videos
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "encuestas_admin_all" ON encuestas
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "preguntas_admin_all" ON preguntas_encuesta
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "respuestas_admin_select" ON respuestas_encuesta
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "portada_admin_all" ON portada_config
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Participaciones: solo se exponen datos NO sensibles al público
-- (usar una vista para esto, ver más abajo)
CREATE POLICY "participaciones_solo_admin" ON participaciones
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Inserción de participaciones: permitida a anónimos
CREATE POLICY "participaciones_insert_anonimo" ON participaciones
  FOR INSERT TO anon
  WITH CHECK (TRUE);

-- ============================================================
-- VISTA PÚBLICA DE PARTICIPACIONES (sin datos sensibles)
-- ============================================================
CREATE VIEW participaciones_publicas AS
SELECT
  id,
  posicion,
  nombre,
  comuna,
  comentario,
  estado_comentario,
  DATE(fecha) AS fecha
FROM participaciones
WHERE estado_comentario = 'aprobado'
  AND comentario IS NOT NULL;

-- ============================================================
-- VISTA DE ESTADÍSTICAS AGREGADAS
-- ============================================================
CREATE VIEW estadisticas_participacion AS
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE posicion = 'apoyo') AS apoyo,
  COUNT(*) FILTER (WHERE posicion = 'no_apoyo') AS no_apoyo,
  COUNT(*) FILTER (WHERE posicion = 'necesito_info') AS necesita_info,
  ROUND(COUNT(*) FILTER (WHERE posicion = 'apoyo') * 100.0 / NULLIF(COUNT(*), 0), 1) AS pct_apoyo,
  ROUND(COUNT(*) FILTER (WHERE posicion = 'no_apoyo') * 100.0 / NULLIF(COUNT(*), 0), 1) AS pct_no_apoyo
FROM participaciones;

CREATE VIEW participacion_por_comuna AS
SELECT
  comuna,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE posicion = 'apoyo') AS apoyo,
  COUNT(*) FILTER (WHERE posicion = 'no_apoyo') AS no_apoyo,
  COUNT(*) FILTER (WHERE posicion = 'necesito_info') AS necesita_info
FROM participaciones
GROUP BY comuna
ORDER BY total DESC;

CREATE VIEW participacion_por_mes AS
SELECT
  DATE_TRUNC('month', fecha) AS mes,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE posicion = 'apoyo') AS apoyo,
  COUNT(*) FILTER (WHERE posicion = 'no_apoyo') AS no_apoyo
FROM participaciones
GROUP BY DATE_TRUNC('month', fecha)
ORDER BY mes;

-- ============================================================
-- FUNCIÓN: Registrar participación (con hash del RUT)
-- ============================================================
CREATE OR REPLACE FUNCTION registrar_participacion(
  p_posicion TEXT,
  p_nombre TEXT,
  p_comuna TEXT,
  p_email TEXT DEFAULT NULL,
  p_rut TEXT DEFAULT NULL,
  p_comentario TEXT DEFAULT NULL,
  p_ip TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  nueva_id UUID;
  rut_hash TEXT;
  ip_hash TEXT;
BEGIN
  -- Hash del RUT (si se proporcionó)
  IF p_rut IS NOT NULL AND p_rut != '' THEN
    rut_hash := crypt(p_rut, gen_salt('bf', 8));
  END IF;

  -- Hash de la IP (para detección de duplicados, nunca exponer)
  IF p_ip IS NOT NULL THEN
    ip_hash := encode(digest(p_ip, 'sha256'), 'hex');
  END IF;

  INSERT INTO participaciones (posicion, nombre, comuna, email, rut_hash, comentario, ip_hash)
  VALUES (p_posicion, p_nombre, p_comuna, p_email, rut_hash, p_comentario, ip_hash)
  RETURNING id INTO nueva_id;

  RETURN nueva_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER noticias_updated_at BEFORE UPDATE ON noticias FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER eventos_updated_at BEFORE UPDATE ON eventos FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER encuestas_updated_at BEFORE UPDATE ON encuestas FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER portada_config_updated_at BEFORE UPDATE ON portada_config FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- NOTAS DE PRIVACIDAD Y SEGURIDAD
-- ============================================================
-- 1. El campo `email` se almacena en texto plano pero solo es accesible
--    por admins autenticados. Considerar cifrado a nivel aplicación para producción.
-- 2. El campo `rut` NUNCA se almacena — solo su hash bcrypt (`rut_hash`).
-- 3. La vista `participaciones_publicas` solo expone nombre, comuna y comentarios aprobados.
-- 4. Usar Supabase Auth para el panel de administración en producción.
-- 5. La función `registrar_participacion` usa SECURITY DEFINER para evitar
--    que usuarios anónimos manipulen directamente la tabla.
