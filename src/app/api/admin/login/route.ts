import { NextResponse } from "next/server"
import { loginAdmin, setSessionCookies } from "@/lib/auth"
import { assertRateLimit, safeError } from "@/lib/security"

export async function POST(request: Request) {
  try {
    assertRateLimit(request, "admin-login", 8, 10 * 60_000)
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Ingresa correo y contrasena" }, { status: 400 })
    }
    const session = await loginAdmin(email, password)
    setSessionCookies(session)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: safeError(error, "No se pudo iniciar sesion") }, { status: 401 })
  }
}
