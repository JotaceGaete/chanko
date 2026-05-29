import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

export const adminAccessCookie = "chanko_admin_access"
export const adminRefreshCookie = "chanko_admin_refresh"

type SupabaseUser = {
  id: string
  email?: string
  role?: string
}

function authHeaders(token?: string) {
  if (!anonKey) throw new Error("Auth no configurado")
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token || anonKey}`,
    "Content-Type": "application/json",
  }
}

function allowedEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAllowedAdmin(user: SupabaseUser | null) {
  if (!user?.email) return false
  const allowlist = allowedEmails()
  return allowlist.length === 0 || allowlist.includes(user.email.toLowerCase())
}

export async function loginAdmin(email: string, password: string) {
  if (!supabaseUrl || !anonKey) throw new Error("Auth no configurado")
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Credenciales invalidas")
  const session = await res.json()
  const user = session.user as SupabaseUser
  if (!isAllowedAdmin(user)) throw new Error("Usuario sin permisos de administracion")
  return session
}

export async function getUserFromToken(token?: string) {
  if (!supabaseUrl || !token) return null
  const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: authHeaders(token),
    cache: "no-store",
  })
  if (!res.ok) return null
  return (await res.json()) as SupabaseUser
}

export async function getCurrentAdmin() {
  const token = cookies().get(adminAccessCookie)?.value
  let user = await getUserFromToken(token)
  if (!user) {
    const refreshed = await refreshAdminSession().catch(() => null)
    user = refreshed?.user || null
  }
  return isAllowedAdmin(user) ? user : null
}

export async function refreshAdminSession() {
  const refreshToken = cookies().get(adminRefreshCookie)?.value
  if (!supabaseUrl || !refreshToken) return null
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  })
  if (!res.ok) return null
  const session = await res.json()
  if (!isAllowedAdmin(session.user)) return null
  setSessionCookies(session)
  return session
}

export async function requireAdmin() {
  const user = await getCurrentAdmin()
  if (!user) throw new Error("No autorizado")
  return user
}

export function setSessionCookies(session: any) {
  const jar = cookies()
  const secure = process.env.NODE_ENV === "production"
  jar.set(adminAccessCookie, session.access_token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in || 3600,
  })
  if (session.refresh_token) {
    jar.set(adminRefreshCookie, session.refresh_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    })
  }
}

export function clearSessionCookies() {
  const jar = cookies()
  jar.delete(adminAccessCookie)
  jar.delete(adminRefreshCookie)
}

export function tokenLooksValid(token?: string) {
  if (!token) return false
  const [, payload] = token.split(".")
  if (!payload) return false
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    return typeof parsed.exp === "number" && parsed.exp * 1000 > Date.now()
  } catch {
    return false
  }
}
