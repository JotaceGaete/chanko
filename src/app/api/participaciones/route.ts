import { NextResponse } from "next/server"
import { registrarParticipacion } from "@/lib/cms"
import { assertRateLimit, requestIp, safeError, verifyTurnstile } from "@/lib/security"

export async function POST(request: Request) {
  try {
    assertRateLimit(request, "participaciones", 3, 60_000)
    const payload = await request.json()
    if (!payload.nombre?.trim() || !payload.comuna || !payload.posicion) {
      return NextResponse.json({ error: "Completa los campos obligatorios" }, { status: 400 })
    }
    const forwardedFor = requestIp(request)
    await verifyTurnstile(payload.turnstileToken, forwardedFor)
    await registrarParticipacion(payload, forwardedFor)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = safeError(error, "No se pudo guardar tu participacion")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
