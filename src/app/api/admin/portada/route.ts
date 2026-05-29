import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { getPortadaConfig, listEventos, listNoticias, listVideos, savePortadaConfig } from "@/lib/cms"
import { safeError } from "@/lib/security"

export async function GET() {
  try {
    await requireAdmin()
    const [config, noticias, eventos, videos] = await Promise.all([
      getPortadaConfig(),
      listNoticias(true),
      listEventos(true),
      listVideos(true),
    ])
    return NextResponse.json({ config, noticias, eventos, videos })
  } catch (error) {
    const message = safeError(error, "No se pudo cargar la portada")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    return NextResponse.json(await savePortadaConfig(await request.json()))
  } catch (error) {
    const message = safeError(error, "No se pudo guardar la portada")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
