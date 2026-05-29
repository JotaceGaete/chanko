"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Lock } from "lucide-react"

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.replace(searchParams.get("next") || "/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="card p-6">
        <div className="w-12 h-12 bg-verde-100 rounded-xl flex items-center justify-center text-verde-700 mb-5">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ingreso administrador</h1>
        <p className="text-gray-500 text-sm mb-6">Acceso protegido con Supabase Auth.</p>
        {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Correo</label>
            <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <label className="label">Contrasena</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          <button className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-20 text-gray-400 text-sm">Cargando...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}
