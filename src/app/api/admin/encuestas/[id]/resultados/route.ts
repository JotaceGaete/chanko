import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { encuestaResultados } from "@/lib/cms"
import { safeError } from "@/lib/security"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin()
    return NextResponse.json(await encuestaResultados(params.id))
  } catch (error) {
    const message = safeError(error, "No se pudieron cargar los resultados")
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
