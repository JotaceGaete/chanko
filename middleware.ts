import { NextRequest, NextResponse } from "next/server"
import { adminAccessCookie, adminRefreshCookie } from "@/lib/auth"

function tokenLooksFresh(token?: string) {
  if (!token) return false
  const [, payload] = token.split(".")
  if (!payload) return false
  try {
    const parsed = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return typeof parsed.exp === "number" && parsed.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next()
  }

  const token = request.cookies.get(adminAccessCookie)?.value
  const refreshToken = request.cookies.get(adminRefreshCookie)?.value
  if (tokenLooksFresh(token) || refreshToken) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = "/admin/login"
  url.searchParams.set("next", pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin/:path*"],
}
