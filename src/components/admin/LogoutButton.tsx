"use client"

import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  return (
    <button onClick={logout} className="text-gray-500 hover:text-red-600 text-sm font-medium">
      Cerrar sesion
    </button>
  )
}
