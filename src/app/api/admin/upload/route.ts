import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { safeError } from "@/lib/security"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
const bucket = process.env.SUPABASE_STORAGE_BUCKET || "cms"
const maxBytes = 5 * 1024 * 1024

function storageHeaders(contentType?: string) {
  if (!serviceKey) throw new Error("Storage no configurado")
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    ...(contentType ? { "Content-Type": contentType } : {}),
  }
}

function extFromType(type: string) {
  if (type === "image/png") return "png"
  if (type === "image/webp") return "webp"
  return "jpg"
}

function objectPathFromPublicUrl(url: string) {
  if (!supabaseUrl || !url.startsWith(`${supabaseUrl}/storage/v1/object/public/${bucket}/`)) return null
  return decodeURIComponent(url.split(`/storage/v1/object/public/${bucket}/`)[1] || "")
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    if (!supabaseUrl || !serviceKey) throw new Error("Storage no configurado")
    const form = await request.formData()
    const file = form.get("file")
    const folder = String(form.get("folder") || "general").replace(/[^a-z0-9_-]/gi, "")
    const previousUrl = String(form.get("previousUrl") || "")
    if (!(file instanceof File)) return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return NextResponse.json({ error: "Formato de imagen no permitido" }, { status: 400 })
    if (file.size > maxBytes) return NextResponse.json({ error: "La imagen no puede superar 5MB" }, { status: 400 })

    const path = `${folder}/${crypto.randomUUID()}.${extFromType(file.type)}`
    const upload = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
      method: "PUT",
      headers: { ...storageHeaders(file.type), "x-upsert": "true" },
      body: await file.arrayBuffer(),
    })
    if (!upload.ok) throw new Error("No se pudo subir la imagen")

    const oldPath = objectPathFromPublicUrl(previousUrl)
    if (oldPath) {
      await fetch(`${supabaseUrl}/storage/v1/object/${bucket}`, {
        method: "DELETE",
        headers: storageHeaders("application/json"),
        body: JSON.stringify({ prefixes: [oldPath] }),
      }).catch(() => null)
    }

    return NextResponse.json({ url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}` })
  } catch (error) {
    return NextResponse.json({ error: safeError(error, "No se pudo subir la imagen") }, { status: 400 })
  }
}
