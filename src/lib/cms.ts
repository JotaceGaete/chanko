import type { Encuesta, Evento, Noticia, Participacion, Video } from "./types"

type QueryValue = string | number | boolean | null | undefined

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || anonKey

export const isSupabaseConfigured = Boolean(supabaseUrl && anonKey)

function apiUrl(path: string, query?: Record<string, QueryValue>) {
  if (!supabaseUrl) throw new Error("Supabase no esta configurado")
  const url = new URL(`/rest/v1/${path}`, supabaseUrl)
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value))
  })
  return url.toString()
}

function headers(admin = false, extra?: HeadersInit) {
  const key = admin ? serviceKey : anonKey
  if (!key) throw new Error("Falta configurar la clave de Supabase")
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  }
}

async function request<T>(path: string, options: RequestInit & { admin?: boolean; query?: Record<string, QueryValue> } = {}) {
  const res = await fetch(apiUrl(path, options.query), {
    ...options,
    headers: headers(options.admin, options.headers),
    cache: options.method && options.method !== "GET" ? "no-store" : "no-store",
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.error("Supabase request failed", res.status, path, text)
    throw new Error("No se pudo completar la operacion")
  }

  if (res.status === 204) return null as T
  return (await res.json()) as T
}

export function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function extractYoutubeId(value: string) {
  const trimmed = value.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  return patterns.map(pattern => trimmed.match(pattern)?.[1]).find(Boolean) || ""
}

export function youtubeThumbnail(youtubeId: string) {
  return youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : ""
}

function imageFallback(seed: string) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed || "chanko")}/800/450`
}

export function mapNoticia(row: any): Noticia {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    resumen: row.resumen || "",
    contenido: row.contenido || "",
    bloques: Array.isArray(row.bloques) ? row.bloques : [],
    imagen: row.imagen_url || imageFallback(row.slug),
    fecha: row.fecha,
    categoria: row.categoria || "General",
    autor: row.autor || "ChankoCiudadano",
    publicada: Boolean(row.publicada),
  }
}

export function mapEvento(row: any): Evento {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    descripcion: row.descripcion || "",
    imagen: row.imagen_url || imageFallback(row.slug),
    fecha: row.fecha,
    hora: String(row.hora || "").slice(0, 5),
    lugar: row.lugar || "",
    region: row.region || "",
    tipo: row.tipo === "virtual" ? "online" : row.tipo,
    inscripcionUrl: row.inscripcion_url || undefined,
    publicado: Boolean(row.publicado),
  }
}

export function mapVideo(row: any): Video {
  return {
    id: row.id,
    titulo: row.titulo,
    descripcion: row.descripcion || "",
    youtubeId: row.youtube_id,
    thumbnail: row.thumbnail_url || youtubeThumbnail(row.youtube_id),
    fecha: row.fecha,
    categoria: row.categoria || "General",
    publicado: Boolean(row.publicado),
  }
}

export function mapEncuesta(row: any): Encuesta {
  const preguntas = (row.preguntas_encuesta || row.preguntas || []).map((p: any) => ({
    id: p.id,
    texto: p.texto,
    tipo: p.tipo,
    opciones: Array.isArray(p.opciones) ? p.opciones : [],
  }))
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    descripcion: row.descripcion || "",
    fechaInicio: row.fecha_inicio,
    fechaFin: row.fecha_fin,
    activa: Boolean(row.activa),
    preguntas,
  }
}

export function mapParticipacion(row: any): Participacion {
  return {
    id: row.id,
    posicion: row.posicion,
    nombre: row.nombre,
    comuna: row.comuna,
    estadoComentario: row.estado_comentario,
    comentario: row.comentario || undefined,
    fecha: row.fecha || row.created_at,
  }
}

export async function listNoticias(admin = false) {
  const query: Record<string, QueryValue> = { select: "*", order: "fecha.desc", archived_at: "is.null" }
  if (!admin) query.publicada = "eq.true"
  const rows = await request<any[]>("noticias", { query, admin })
  return rows.map(mapNoticia)
}

export async function getNoticia(slug: string, admin = false) {
  const rows = await request<any[]>("noticias", {
    admin,
    query: { select: "*", slug: `eq.${slug}`, archived_at: "is.null", ...(admin ? {} : { publicada: "eq.true" }), limit: 1 },
  })
  return rows[0] ? mapNoticia(rows[0]) : null
}

export async function listEventos(admin = false) {
  const query: Record<string, QueryValue> = { select: "*", order: "fecha.asc", archived_at: "is.null" }
  if (!admin) query.publicado = "eq.true"
  const rows = await request<any[]>("eventos", { query, admin })
  return rows.map(mapEvento)
}

export async function getEvento(slug: string, admin = false) {
  const rows = await request<any[]>("eventos", {
    admin,
    query: { select: "*", slug: `eq.${slug}`, archived_at: "is.null", ...(admin ? {} : { publicado: "eq.true" }), limit: 1 },
  })
  return rows[0] ? mapEvento(rows[0]) : null
}

export async function listVideos(admin = false) {
  const query: Record<string, QueryValue> = { select: "*", order: "fecha.desc", archived_at: "is.null" }
  if (!admin) query.publicado = "eq.true"
  const rows = await request<any[]>("videos", { query, admin })
  return rows.map(mapVideo)
}

export async function listEncuestas(admin = false) {
  const query: Record<string, QueryValue> = { select: "*,preguntas_encuesta(*)", order: "fecha_inicio.desc", archived_at: "is.null" }
  if (!admin) query.activa = "eq.true"
  const rows = await request<any[]>("encuestas", { query, admin })
  return rows.map(mapEncuesta)
}

export async function getEncuesta(slug: string, admin = false) {
  const rows = await request<any[]>("encuestas", {
    admin,
    query: { select: "*,preguntas_encuesta(*)", slug: `eq.${slug}`, archived_at: "is.null", ...(admin ? {} : { activa: "eq.true" }), limit: 1 },
  })
  return rows[0] ? mapEncuesta(rows[0]) : null
}

export async function adminList(resource: string) {
  if (resource === "noticias") return listNoticias(true)
  if (resource === "eventos") return listEventos(true)
  if (resource === "videos") return listVideos(true)
  if (resource === "encuestas") return listEncuestas(true)
  if (resource === "participaciones") {
    const rows = await request<any[]>("participaciones", { admin: true, query: { select: "id,posicion,nombre,comuna,comentario,estado_comentario,fecha,created_at", order: "fecha.desc" } })
    return rows.map(mapParticipacion)
  }
  throw new Error("Recurso no soportado")
}

export async function saveAdminResource(resource: string, payload: any) {
  if (resource === "noticias") return saveNoticia(payload)
  if (resource === "eventos") return saveEvento(payload)
  if (resource === "videos") return saveVideo(payload)
  if (resource === "encuestas") return saveEncuesta(payload)
  throw new Error("Recurso no soportado")
}

async function upsert(table: string, body: any) {
  const rows = await request<any[]>(table, {
    method: "POST",
    admin: true,
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(body),
  })
  return rows[0]
}

async function saveNoticia(payload: any) {
  const slug = payload.slug || toSlug(payload.titulo)
  const row = await upsert("noticias", {
    id: payload.id || undefined,
    slug,
    titulo: payload.titulo,
    resumen: payload.resumen,
    contenido: payload.contenido,
    bloques: payload.bloques || [],
    imagen_url: payload.imagen || payload.imagen_url || null,
    fecha: payload.fecha,
    categoria: payload.categoria,
    autor: payload.autor,
    publicada: Boolean(payload.publicada),
  })
  return mapNoticia(row)
}

async function saveEvento(payload: any) {
  const slug = payload.slug || toSlug(payload.titulo)
  const tipo = payload.tipo === "online" ? "virtual" : payload.tipo
  const row = await upsert("eventos", {
    id: payload.id || undefined,
    slug,
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    imagen_url: payload.imagen || payload.imagen_url || null,
    fecha: payload.fecha,
    hora: payload.hora,
    lugar: payload.lugar,
    region: payload.region,
    tipo,
    inscripcion_url: payload.inscripcionUrl || payload.inscripcion_url || null,
    publicado: Boolean(payload.publicado),
  })
  return mapEvento(row)
}

async function saveVideo(payload: any) {
  const youtubeId = extractYoutubeId(payload.youtubeUrl || payload.youtubeId || payload.youtube_id)
  if (!youtubeId) throw new Error("La URL de YouTube no es valida")
  const row = await upsert("videos", {
    id: payload.id || undefined,
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    youtube_id: youtubeId,
    thumbnail_url: payload.thumbnail || payload.thumbnail_url || youtubeThumbnail(youtubeId),
    fecha: payload.fecha,
    categoria: payload.categoria,
    publicado: Boolean(payload.publicado),
  })
  return mapVideo(row)
}

async function saveEncuesta(payload: any) {
  const slug = payload.slug || toSlug(payload.titulo)
  const row = await upsert("encuestas", {
    id: payload.id || undefined,
    slug,
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    fecha_inicio: payload.fechaInicio,
    fecha_fin: payload.fechaFin,
    activa: Boolean(payload.activa),
  })

  await request("preguntas_encuesta", {
    method: "DELETE",
    admin: true,
    headers: { Prefer: "return=minimal" },
    query: { encuesta_id: `eq.${row.id}` },
  })

  const preguntas = (payload.preguntas || []).map((p: any, index: number) => ({
    encuesta_id: row.id,
    orden: index,
    texto: p.texto,
    tipo: p.tipo,
    opciones: p.tipo === "texto_libre" ? [] : (p.opciones || []),
  })).filter((p: any) => p.texto)

  if (preguntas.length > 0) {
    await request("preguntas_encuesta", {
      method: "POST",
      admin: true,
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(preguntas),
    })
  }

  return getEncuesta(slug, true)
}

export async function patchAdminResource(resource: string, id: string, payload: any) {
  const table = resource
  const rows = await request<any[]>(table, {
    method: "PATCH",
    admin: true,
    headers: { Prefer: "return=representation" },
    query: { id: `eq.${id}` },
    body: JSON.stringify(payload),
  })
  if (resource === "noticias") return mapNoticia(rows[0])
  if (resource === "eventos") return mapEvento(rows[0])
  if (resource === "videos") return mapVideo(rows[0])
  if (resource === "encuestas") return mapEncuesta(rows[0])
  return rows[0]
}

export async function deleteAdminResource(resource: string, id: string) {
  await request(resource, {
    method: "PATCH",
    admin: true,
    headers: { Prefer: "return=minimal" },
    query: { id: `eq.${id}` },
    body: JSON.stringify({ archived_at: new Date().toISOString() }),
  })
  return { ok: true }
}

export async function submitEncuesta(slug: string, respuestas: Record<string, string>) {
  const encuesta = await getEncuesta(slug, false)
  if (!encuesta) throw new Error("Encuesta no disponible")
  const rows = Object.entries(respuestas)
    .filter(([, respuesta]) => respuesta.trim())
    .map(([preguntaId, respuesta]) => ({ pregunta_id: preguntaId, respuesta }))
  if (rows.length === 0) throw new Error("Debes responder al menos una pregunta")
  await request("respuestas_encuesta", {
    method: "POST",
    admin: true,
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(rows),
  })
  return { ok: true }
}

export async function encuestaResultados(id: string) {
  const preguntas = await request<any[]>("preguntas_encuesta", {
    admin: true,
    query: { select: "id,texto,tipo,opciones,respuestas_encuesta(respuesta)", encuesta_id: `eq.${id}`, order: "orden.asc" },
  })
  return preguntas.map(p => ({
    id: p.id,
    texto: p.texto,
    tipo: p.tipo,
    opciones: p.opciones || [],
    respuestas: (p.respuestas_encuesta || []).map((r: any) => r.respuesta),
  }))
}

export async function registrarParticipacion(payload: any, ip?: string | null) {
  const rows = await request<any>("rpc/registrar_participacion", {
    method: "POST",
    admin: false,
    body: JSON.stringify({
      p_posicion: payload.posicion,
      p_nombre: payload.nombre,
      p_comuna: payload.comuna,
      p_email: payload.email || null,
      p_rut: payload.rut || null,
      p_comentario: payload.comentario || null,
      p_ip: ip || null,
    }),
  })
  return rows
}

export async function getEstadisticas() {
  const [statsRows, comunaRows, fechaRows, comentariosRows] = await Promise.all([
    request<any[]>("estadisticas_participacion", { admin: true, query: { select: "*" } }),
    request<any[]>("participacion_por_comuna", { admin: true, query: { select: "*", limit: 10 } }),
    request<any[]>("participacion_por_mes", { admin: true, query: { select: "*" } }),
    request<any[]>("participaciones_publicas", { query: { select: "*", order: "fecha.desc", limit: 12 } }),
  ])
  const stats = statsRows[0] || {}
  return {
    total: Number(stats.total || 0),
    apoyo: Number(stats.apoyo || 0),
    noApoyo: Number(stats.no_apoyo || 0),
    necesitaInfo: Number(stats.necesita_info || 0),
    porComuna: comunaRows.map(row => ({ comuna: row.comuna, total: Number(row.total || 0) })),
    porFecha: fechaRows.map(row => ({ fecha: row.mes, total: Number(row.total || 0), apoyo: Number(row.apoyo || 0) })),
    comentariosAprobados: comentariosRows.map(row => ({
      id: row.id,
      nombre: row.nombre,
      comuna: row.comuna,
      comentario: row.comentario,
      posicion: row.posicion,
      fecha: row.fecha,
    })),
  }
}

export async function getPortadaConfig() {
  const rows = await request<any[]>("portada_config", {
    admin: true,
    query: { select: "*", id: "eq.home", limit: 1 },
  })
  return rows[0] || { id: "home", noticia_id: null, evento_id: null, video_id: null }
}

export async function savePortadaConfig(payload: any) {
  const rows = await request<any[]>("portada_config", {
    method: "POST",
    admin: true,
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({
      id: "home",
      noticia_id: payload.noticia_id || null,
      evento_id: payload.evento_id || null,
      video_id: payload.video_id || null,
    }),
  })
  return rows[0]
}
