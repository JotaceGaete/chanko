"use client"

import { useState } from "react"
import Link from "next/link"
import { ThumbsUp, ThumbsDown, HelpCircle, ChevronRight, CheckCircle, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { comunasChile } from "@/lib/mock-data"
import Turnstile from "@/components/Turnstile"

type Posicion = "apoyo" | "no_apoyo" | "necesito_info"

const opciones: { id: Posicion; label: string; desc: string; icon: React.ElementType; color: string; border: string; bg: string }[] = [
  {
    id: "apoyo",
    label: "Apoyo la iniciativa",
    desc: "Estoy de acuerdo con proteger los humedales del Biobío y exijo una evaluación ambiental del proyecto industrial.",
    icon: ThumbsUp,
    color: "text-verde-700",
    border: "border-verde-500",
    bg: "bg-verde-50",
  },
  {
    id: "no_apoyo",
    label: "No apoyo la iniciativa",
    desc: "Tengo una posición diferente respecto a la gestión de esta área y al desarrollo industrial de la zona.",
    icon: ThumbsDown,
    color: "text-red-600",
    border: "border-red-400",
    bg: "bg-red-50",
  },
  {
    id: "necesito_info",
    label: "Necesito más información",
    desc: "No tengo suficientes antecedentes para definir mi postura y me gustaría conocer más sobre el tema.",
    icon: HelpCircle,
    color: "text-amber-600",
    border: "border-amber-400",
    bg: "bg-amber-50",
  },
]

export default function ApoyaPage() {
  const [posicion, setPosicion] = useState<Posicion | null>(null)
  const [step, setStep] = useState<"posicion" | "datos" | "exito">("posicion")
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [turnstileToken, setTurnstileToken] = useState("")

  const [form, setForm] = useState({
    nombre: "",
    comuna: "",
    email: "",
    rut: "",
    comentario: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio"
    if (!form.comuna) errs.comuna = "Selecciona tu comuna"
    return errs
  }

  function handleContinue() {
    if (!posicion) return
    setStep("datos")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setLoading(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/participaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posicion, ...form, turnstileToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setStep("exito")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "No pudimos registrar tu participacion. Intentalo nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const opcionSeleccionada = opciones.find(o => o.id === posicion)

  if (step === "exito") {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-24 h-24 bg-verde-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-verde-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Gracias, {form.nombre.split(" ")[0]}!</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          Tu participación fue registrada. Las voces ciudadanas son fundamentales para que las autoridades tomen decisiones que protejan nuestros ecosistemas.
        </p>
        {form.comentario && (
          <div className="bg-verde-50 rounded-xl p-4 border border-verde-100 mb-6 text-left">
            <p className="text-xs font-semibold text-verde-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Tu comentario está pendiente de moderación
            </p>
            <p className="text-verde-800 text-sm italic">&ldquo;{form.comentario}&rdquo;</p>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/resultados" className="btn-primary">Ver estadísticas</Link>
          <Link href="/" className="btn-secondary">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="badge-verde mb-3 inline-block">Participación Ciudadana</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {step === "posicion" ? "¿Cuál es tu posición?" : "Completa tus datos"}
        </h1>
        <p className="text-gray-500 leading-relaxed">
          {step === "posicion"
            ? "Sobre la protección de los humedales costeros del Biobío frente al proyecto industrial en la desembocadura del río."
            : "Todos los campos marcados con * son obligatorios. Tus datos personales están protegidos."}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === "posicion" ? "text-verde-700" : "text-verde-500"}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "posicion" ? "bg-verde-600 text-white" : "bg-verde-100 text-verde-700"}`}>1</div>
          Mi posición
        </div>
        <div className="w-8 h-px bg-gray-300" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step === "datos" ? "text-verde-700" : "text-gray-400"}`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === "datos" ? "bg-verde-600 text-white" : "bg-gray-100 text-gray-500"}`}>2</div>
          Mis datos
        </div>
      </div>

      {step === "posicion" && (
        <div>
          <div className="space-y-4 mb-8">
            {opciones.map(opcion => {
              const Icon = opcion.icon
              const selected = posicion === opcion.id
              return (
                <button
                  key={opcion.id}
                  onClick={() => setPosicion(opcion.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selected
                      ? `${opcion.border} ${opcion.bg} shadow-md`
                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? opcion.bg : "bg-gray-100"}`}>
                      <Icon className={`w-6 h-6 ${selected ? opcion.color : "text-gray-400"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-base ${selected ? opcion.color : "text-gray-900"}`}>
                          {opcion.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                          selected ? `${opcion.border} ${opcion.color.replace("text-", "bg-").replace("-700", "-600").replace("-600", "-600")}` : "border-gray-300"
                        }`}>
                          {selected && <div className="w-full h-full rounded-full bg-current" />}
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-1 leading-relaxed">{opcion.desc}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <button
            onClick={handleContinue}
            disabled={!posicion}
            className={`w-full btn-primary text-base py-4 justify-center ${!posicion ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronRight className="w-5 h-5" />
            Continuar
          </button>
        </div>
      )}

      {step === "datos" && (
        <form onSubmit={handleSubmit}>
          {/* Selected position recap */}
          {opcionSeleccionada && (
            <div className={`flex items-center gap-3 p-4 rounded-xl border-2 mb-8 ${opcionSeleccionada.border} ${opcionSeleccionada.bg}`}>
              <opcionSeleccionada.icon className={`w-5 h-5 ${opcionSeleccionada.color} flex-shrink-0`} />
              <span className={`font-semibold text-sm ${opcionSeleccionada.color}`}>{opcionSeleccionada.label}</span>
              <button
                type="button"
                onClick={() => setStep("posicion")}
                className="ml-auto text-gray-400 hover:text-gray-600 text-xs underline"
              >
                Cambiar
              </button>
            </div>
          )}

          <div className="space-y-5">
            {/* Nombre */}
            <div>
              <label className="label">Nombre completo *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); setErrors(er => ({ ...er, nombre: "" })) }}
                placeholder="Ej: María González"
                className={`input-field ${errors.nombre ? "border-red-400 focus:ring-red-400" : ""}`}
              />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
            </div>

            {/* Comuna */}
            <div>
              <label className="label">Comuna *</label>
              <select
                value={form.comuna}
                onChange={e => { setForm(f => ({ ...f, comuna: e.target.value })); setErrors(er => ({ ...er, comuna: "" })) }}
                className={`input-field ${errors.comuna ? "border-red-400 focus:ring-red-400" : ""}`}
              >
                <option value="">Selecciona tu comuna</option>
                {comunasChile.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.comuna && <p className="text-red-500 text-xs mt-1">{errors.comuna}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label">
                Correo electrónico
                <span className="ml-1 text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="tucorreo@ejemplo.cl"
                  className="input-field pr-10"
                />
                <Lock className="absolute right-3 top-3.5 w-4 h-4 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Confidencial — nunca se mostrará públicamente
              </p>
            </div>

            {/* RUT */}
            <div>
              <label className="label">
                RUT
                <span className="ml-1 text-gray-400 font-normal">(opcional — para validar participación única)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.rut}
                  onChange={e => setForm(f => ({ ...f, rut: e.target.value }))}
                  placeholder="12.345.678-9"
                  className="input-field pr-10"
                />
                <Lock className="absolute right-3 top-3.5 w-4 h-4 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Confidencial — nunca se mostrará públicamente ni será compartido
              </p>
            </div>

            {/* Comentario */}
            <div>
              <label className="label">
                Comentario
                <span className="ml-1 text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={form.comentario}
                onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
                rows={4}
                placeholder="Comparte tu opinión, experiencia o propuesta (máx. 500 caracteres)"
                maxLength={500}
                className="input-field resize-none"
              />
              <div className="flex items-center justify-between text-xs mt-1">
                <p className="text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Los comentarios serán moderados antes de publicarse
                </p>
                <span className="text-gray-400">{form.comentario.length}/500</span>
              </div>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="mt-7 bg-gray-50 rounded-2xl p-5 border border-gray-200 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-verde-600" />
              Privacidad y protección de datos
            </p>
            <ul className="space-y-1.5 text-xs leading-relaxed">
              <li className="flex items-start gap-1.5"><span className="text-verde-500 mt-0.5">•</span> Tu <strong>RUT y correo electrónico son confidenciales</strong> y nunca serán publicados ni compartidos con terceros.</li>
              <li className="flex items-start gap-1.5"><span className="text-verde-500 mt-0.5">•</span> Solo se publicarán tu nombre y comuna.</li>
              <li className="flex items-start gap-1.5"><span className="text-verde-500 mt-0.5">•</span> Los comentarios serán revisados por nuestro equipo antes de aparecer públicamente.</li>
              <li className="flex items-start gap-1.5"><span className="text-verde-500 mt-0.5">•</span> Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos a contacto@chanko.cl.</li>
            </ul>
          </div>

          <div className="mt-6">
            <Turnstile onVerify={setTurnstileToken} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-primary text-base py-4 justify-center mt-6 ${loading ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Enviando...
              </span>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Enviar mi participación
              </>
            )}
          </button>
          {submitError && <p className="text-center text-sm text-red-600 mt-3">{submitError}</p>}

          <p className="text-center text-xs text-gray-400 mt-4">
            Al enviar, aceptas el uso de tus datos según lo indicado en la política de privacidad.
          </p>
        </form>
      )}
    </div>
  )
}
