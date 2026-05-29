const buckets = new Map<string, { count: number; resetAt: number }>()

function clientIp(request: Request) {
  return request.headers.get("cf-connecting-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown"
}

export function safeError(error: unknown, fallback = "No se pudo completar la operacion") {
  if (error instanceof Error && ["No autorizado", "Credenciales invalidas", "Usuario sin permisos de administracion"].includes(error.message)) {
    return error.message
  }
  console.error(error)
  return fallback
}

export function assertRateLimit(request: Request, scope: string, limit = 5, windowMs = 60_000) {
  const key = `${scope}:${clientIp(request)}`
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  current.count += 1
  if (current.count > limit) {
    throw new Error("Demasiados intentos. Espera un momento y vuelve a intentar.")
  }
}

export async function verifyTurnstile(token?: string, remoteIp?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    if (process.env.NODE_ENV === "production") throw new Error("Verificacion anti-bot no configurada")
    return true
  }
  if (!token) throw new Error("Completa la verificacion anti-bot")

  const form = new FormData()
  form.set("secret", secret)
  form.set("response", token)
  if (remoteIp) form.set("remoteip", remoteIp)

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({ success: false }))
  if (!data.success) throw new Error("No pudimos validar la verificacion anti-bot")
  return true
}

export function requestIp(request: Request) {
  return clientIp(request)
}
