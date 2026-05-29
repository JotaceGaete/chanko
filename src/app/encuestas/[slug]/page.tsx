import Link from "next/link"
import { getEncuesta } from "@/lib/cms"
import EncuestaForm from "./EncuestaForm"

export default async function EncuestaPage({ params }: { params: { slug: string } }) {
  const encuesta = await getEncuesta(params.slug).catch(() => null)

  if (!encuesta) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">Esta encuesta no existe o ya no esta disponible.</p>
        <Link href="/encuestas" className="btn-primary">Volver a encuestas</Link>
      </div>
    )
  }

  return <EncuestaForm encuesta={encuesta} />
}
