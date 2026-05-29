# ChankoCiudadano - checklist de seguridad y recuperacion

## Variables requeridas

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`: correos admin separados por coma.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `SUPABASE_STORAGE_BUCKET`: opcional, por defecto `cms`.
- `NEXT_PUBLIC_SITE_URL`: URL publica para SEO/OG.

## Supabase Auth

1. Crear usuarios admin en Supabase Auth.
2. Agregar esos correos a `ADMIN_EMAILS`.
3. En produccion, asignar `app_metadata.role = "admin"` a usuarios admin si se usaran politicas RLS directas desde cliente.
4. Rotar contrasenas y retirar accesos cuando una persona salga del equipo.

## Backups y recuperacion

- Activar Point-in-Time Recovery o backups diarios desde el panel de Supabase si el plan lo permite.
- Antes de migraciones manuales, exportar schema y datos criticos:
  - `supabase db dump --db-url "$DATABASE_URL" -f backup.sql`
  - o desde Dashboard > Database > Backups.
- Probar restauracion en un proyecto Supabase separado antes de sobrescribir produccion.
- Guardar copia de `supabase/schema.sql` versionada en Git.
- Rotar `SUPABASE_SERVICE_ROLE_KEY` si se sospecha exposicion; actualizar Vercel inmediatamente y redeploy.

## RLS esperado

- Lectura publica solo para noticias/eventos/videos publicados y no archivados.
- Encuestas publicas solo activas y no archivadas.
- Comentarios publicos solo desde vista `participaciones_publicas`, aprobados y sin email/RUT.
- Escrituras admin via APIs protegidas y service role server-side.
- Escrituras publicas pasan por API, rate limit y Turnstile.
- RUT se guarda solo como hash mediante `registrar_participacion`.

## Prueba manual antes de abrir

1. Login en `/admin/login`.
2. Crear noticia, subir imagen, publicar y abrir detalle.
3. Revisar preview de WhatsApp/OG con URL publica.
4. Crear evento con imagen, fecha, hora, lugar y publicar.
5. Crear video desde URL YouTube y verificar thumbnail.
6. Crear encuesta, responder desde publico y revisar resultados.
7. Enviar apoyo con comentario y confirmar que queda pendiente.
8. Aprobar/rechazar comentario desde admin.
9. Revisar `/resultados` y home.
10. Probar logout y confirmar que `/admin` redirige a login.
