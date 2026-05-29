export interface Noticia {
  id: string
  slug: string
  titulo: string
  resumen: string
  contenido: string
  bloques?: unknown[]
  imagen: string
  fecha: string
  categoria: string
  autor: string
  publicada: boolean
}

export interface Evento {
  id: string
  slug: string
  titulo: string
  descripcion: string
  imagen: string
  fecha: string
  hora: string
  lugar: string
  region: string
  tipo: "presencial" | "online" | "virtual" | "hibrido"
  inscripcionUrl?: string
  publicado: boolean
}

export interface Video {
  id: string
  titulo: string
  descripcion: string
  youtubeId: string
  thumbnail: string
  fecha: string
  categoria: string
  publicado: boolean
}

export interface Encuesta {
  id: string
  slug: string
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaFin: string
  activa: boolean
  preguntas: PreguntaEncuesta[]
}

export interface PreguntaEncuesta {
  id: string
  texto: string
  tipo: "opcion_multiple" | "texto_libre" | "escala"
  opciones?: string[]
}

export interface Participacion {
  id: string
  posicion: "apoyo" | "no_apoyo" | "necesito_info"
  nombre: string
  comuna: string
  estadoComentario: "pendiente" | "aprobado" | "rechazado"
  comentario?: string
  fecha: string
}

export interface ComentarioPublico {
  id: string
  nombre: string
  comuna: string
  comentario: string
  posicion: "apoyo" | "no_apoyo" | "necesito_info"
  fecha: string
}

export interface Estadisticas {
  total: number
  apoyo: number
  noApoyo: number
  necesitaInfo: number
  porComuna: { comuna: string; total: number }[]
  porFecha: { fecha: string; total: number; apoyo: number }[]
  comentariosAprobados: ComentarioPublico[]
}
