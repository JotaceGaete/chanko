import Link from "next/link"
import { redirect } from "next/navigation"
import { AlertTriangle, Calendar, ChevronRight, ClipboardList, Home, MessageSquare, Newspaper, Users, Video } from "lucide-react"
import { adminList, getEstadisticas } from "@/lib/cms"
import { getCurrentAdmin } from "@/lib/auth"
import type { Encuesta, Evento, Noticia, Participacion, Video as VideoType } from "@/lib/types"
import LogoutButton from "@/components/admin/LogoutButton"

export default async function AdminPage() {
  if (!(await getCurrentAdmin())) redirect("/admin/login")
  const [noticias, eventos, videos, encuestas, participaciones, estadisticas] = await Promise.all([
    adminList("noticias").catch(() => []) as Promise<Noticia[]>,
    adminList("eventos").catch(() => []) as Promise<Evento[]>,
    adminList("videos").catch(() => []) as Promise<VideoType[]>,
    adminList("encuestas").catch(() => []) as Promise<Encuesta[]>,
    adminList("participaciones").catch(() => []) as Promise<Participacion[]>,
    getEstadisticas().catch(() => ({ total: 0, apoyo: 0, noApoyo: 0, necesitaInfo: 0, porComuna: [], porFecha: [], comentariosAprobados: [] })),
  ])

  const adminSections = [
    { href: "/admin/noticias", icon: Newspaper, label: "Noticias", count: noticias.length, badge: "publicadas: " + noticias.filter(n => n.publicada).length, color: "bg-blue-50 text-blue-600" },
    { href: "/admin/eventos", icon: Calendar, label: "Eventos", count: eventos.length, badge: "publicados: " + eventos.filter(e => e.publicado).length, color: "bg-violet-50 text-violet-600" },
    { href: "/admin/videos", icon: Video, label: "Videos", count: videos.length, badge: "publicados: " + videos.filter(v => v.publicado).length, color: "bg-rose-50 text-rose-600" },
    { href: "/admin/encuestas", icon: ClipboardList, label: "Encuestas", count: encuestas.length, badge: "activas: " + encuestas.filter(e => e.activa).length, color: "bg-amber-50 text-amber-600" },
    { href: "/admin/portada", icon: Home, label: "Portada", count: 3, badge: "destacados", color: "bg-emerald-50 text-emerald-600" },
    { href: "/admin/participaciones", icon: Users, label: "Participaciones", count: participaciones.length, badge: "total", color: "bg-verde-50 text-verde-600" },
    { href: "/admin/comentarios", icon: MessageSquare, label: "Comentarios", count: participaciones.filter(p => p.estadoComentario === "pendiente" && p.comentario).length, badge: "pendientes", color: "bg-orange-50 text-orange-600" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800">Area de administracion protegida</p>
          <p className="text-amber-700 text-sm mt-0.5">Las APIs admin tambien validan la sesion server-side.</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Panel de Administracion</h1>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-verde-600 hover:text-verde-700 text-sm font-medium">Ver sitio publico</Link>
          <LogoutButton />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total participaciones", value: estadisticas.total, color: "text-verde-700" },
          { label: "% apoyo", value: (estadisticas.total ? Math.round((estadisticas.apoyo / estadisticas.total) * 100) : 0) + "%", color: "text-verde-700" },
          { label: "Comentarios pendientes", value: participaciones.filter(p => p.estadoComentario === "pendiente" && p.comentario).length, color: "text-amber-600" },
          { label: "Comunas representadas", value: estadisticas.porComuna.length, color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="card p-5">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {adminSections.map(sec => {
          const Icon = sec.icon
          return (
            <Link key={sec.href} href={sec.href} className="card p-6 group hover:border-verde-200">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${sec.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-verde-500 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{sec.count}</div>
              <p className="text-gray-700 font-medium">{sec.label}</p>
              <p className="text-gray-400 text-xs mt-1">{sec.badge}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
