import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft, HelpCircle, ThumbsDown, ThumbsUp } from "lucide-react"
import { adminList, getEstadisticas } from "@/lib/cms"
import { getCurrentAdmin } from "@/lib/auth"
import type { Participacion } from "@/lib/types"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

const posicionConfig: Record<string, { label: string; badge: string; icon: React.ElementType }> = {
  apoyo: { label: "Apoya", badge: "bg-verde-100 text-verde-700", icon: ThumbsUp },
  no_apoyo: { label: "No apoya", badge: "bg-red-100 text-red-700", icon: ThumbsDown },
  necesito_info: { label: "Necesita info", badge: "bg-amber-100 text-amber-700", icon: HelpCircle },
}

export default async function AdminParticipacionesPage() {
  if (!(await getCurrentAdmin())) redirect("/admin/login")
  let participaciones: Participacion[] = []
  let estadisticas = { total: 0, apoyo: 0, noApoyo: 0, necesitaInfo: 0 }
  try {
    participaciones = await adminList("participaciones") as Participacion[]
    estadisticas = await getEstadisticas()
  } catch {
    participaciones = []
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Panel de administracion
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="section-title mb-2">Participaciones Ciudadanas</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
          <strong>Privacidad:</strong> El RUT y correo electronico de los participantes no se muestran en esta interfaz.
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: estadisticas.total, color: "text-gray-900" },
          { label: "Apoyan", value: estadisticas.apoyo, color: "text-verde-700" },
          { label: "No apoyan", value: estadisticas.noApoyo, color: "text-red-600" },
          { label: "Necesitan info", value: estadisticas.necesitaInfo, color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <p className="text-gray-500 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Comuna</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Posicion</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Comentario</th>
                <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {participaciones.slice(0, 50).map(p => {
                const cfg = posicionConfig[p.posicion]
                const Icon = cfg.icon
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-verde-100 rounded-full flex items-center justify-center text-verde-700 text-xs font-bold">{p.nombre.charAt(0)}</div><span className="font-medium text-gray-900 text-sm">{p.nombre}</span></div></td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{p.comuna}</td>
                    <td className="px-4 py-3.5"><span className={`badge text-xs flex items-center gap-1 w-fit ${cfg.badge}`}><Icon className="w-3 h-3" />{cfg.label}</span></td>
                    <td className="px-4 py-3.5 hidden md:table-cell">{p.comentario ? <div><span className={`badge text-xs mb-1 inline-block ${p.estadoComentario === "aprobado" ? "bg-verde-100 text-verde-700" : p.estadoComentario === "rechazado" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{p.estadoComentario}</span><p className="text-gray-400 text-xs line-clamp-1">&ldquo;{p.comentario}&rdquo;</p></div> : <span className="text-gray-300 text-xs">Sin comentario</span>}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-400 hidden lg:table-cell">{formatDate(p.fecha)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 text-sm text-gray-400">Mostrando {Math.min(50, participaciones.length)} de {participaciones.length} participaciones</div>
      </div>
    </div>
  )
}
