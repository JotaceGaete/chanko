import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { adminList, deleteAdminResource, patchAdminResource, saveAdminResource } from "@/lib/cms"
import { safeError } from "@/lib/security"

function cleanError(error: unknown) {
  return safeError(error, "No se pudo completar la operacion")
}

export async function GET(request: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const resource = searchParams.get("resource") || ""
    return NextResponse.json(await adminList(resource))
  } catch (error) {
    return NextResponse.json({ error: cleanError(error) }, { status: 400 })
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const { resource, ...payload } = await request.json()
    return NextResponse.json(await saveAdminResource(resource, payload))
  } catch (error) {
    return NextResponse.json({ error: cleanError(error) }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin()
    const { resource, id, changes } = await request.json()
    return NextResponse.json(await patchAdminResource(resource, id, changes))
  } catch (error) {
    return NextResponse.json({ error: cleanError(error) }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(request.url)
    const resource = searchParams.get("resource") || ""
    const id = searchParams.get("id") || ""
    return NextResponse.json(await deleteAdminResource(resource, id))
  } catch (error) {
    return NextResponse.json({ error: cleanError(error) }, { status: 400 })
  }
}
