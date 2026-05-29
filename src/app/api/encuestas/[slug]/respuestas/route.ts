import { NextResponse } from "next/server"
import { submitEncuesta } from "@/lib/cms"
import { assertRateLimit, requestIp, safeError, verifyTurnstile } from "@/lib/security"

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    assertRateLimit(request, `encuesta:${params.slug}`, 5, 60_000)
    const { respuestas, turnstileToken } = await request.json()
    await verifyTurnstile(turnstileToken, requestIp(request))
    await submitEncuesta(params.slug, respuestas || {})
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = safeError(error, "No se pudieron guardar las respuestas")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
