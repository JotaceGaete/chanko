import type { Noticia, Evento, Video, Encuesta, Participacion, Estadisticas } from "./types"

export const noticias: Noticia[] = [
  {
    id: "1",
    slug: "humedales-biobio-amenaza-industrial",
    titulo: "Humedales del Biobío bajo amenaza: proyecto industrial avanza sin evaluación ambiental",
    resumen: "Un nuevo polo industrial proyectado en la desembocadura del río Biobío amenaza con destruir más de 300 hectáreas de humedales costeros, hábitat de más de 80 especies de aves.",
    contenido: `<p>Los humedales de la desembocadura del río Biobío, uno de los ecosistemas más importantes del centro-sur de Chile, enfrentan una amenaza sin precedentes. Un proyecto de desarrollo industrial que contempla la construcción de bodegas, plantas de procesamiento y vías de acceso avanza en sus trámites administrativos sin haber ingresado al Sistema de Evaluación de Impacto Ambiental (SEIA).</p>
    <p>Según información obtenida por organizaciones ambientalistas locales, el proyecto ocuparía al menos 320 hectáreas de terrenos que albergan humedales de importancia para la biodiversidad regional. El área es hábitat permanente y estacional de más de 80 especies de aves, incluyendo varias en categoría de conservación.</p>
    <p>"Estamos ante una vulneración flagrante de la normativa ambiental", señaló la directora de la organización, quien añadió que han presentado recursos ante la Superintendencia del Medio Ambiente.</p>
    <p>Los humedales costeros cumplen funciones ecosistémicas clave: regulan inundaciones, filtran contaminantes, capturan carbono y sostienen cadenas tróficas marinas y terrestres. Su destrucción tendría consecuencias que van mucho más allá del área afectada directamente.</p>
    <p>La comunidad local se ha organizado para oponerse al proyecto y está recolectando firmas para exigir una evaluación ambiental completa y participación ciudadana en el proceso de decisión.</p>`,
    imagen: "https://picsum.photos/seed/humedal1/800/450",
    fecha: "2024-05-15",
    categoria: "Alerta Ambiental",
    autor: "Redacción ChankoCiudadano",
    publicada: true,
  },
  {
    id: "2",
    slug: "nueva-ley-proteccion-humedales",
    titulo: "Proyecto de ley busca proteger humedales urbanos y costeros en todo Chile",
    resumen: "Parlamentarios presentaron un proyecto que obligaría a inventariar, delimitar y proteger todos los humedales del país, con especial énfasis en zonas costeras.",
    contenido: `<p>Un grupo de parlamentarios de distintas bancadas presentó esta semana un proyecto de ley que busca establecer una protección integral para los humedales urbanos y costeros de Chile. La iniciativa, que cuenta con el apoyo de organizaciones ambientalistas, propone la creación de un inventario nacional y mecanismos de protección efectivos.</p>
    <p>El proyecto establece la obligación de que los municipios delimiten y protejan los humedales dentro de sus territorios, prohibiendo intervenciones que alteren su estructura o funcionalidad. También propone incentivos para propietarios privados que mantengan o restauren estos ecosistemas.</p>
    <p>La iniciativa llega en un momento crucial, cuando varios humedales costeros del Biobío enfrentan presiones de desarrollo industrial y habitacional. Organizaciones como ChankoCiudadano han estado impulsando esta legislación desde hace más de dos años.</p>`,
    imagen: "https://picsum.photos/seed/ley2/800/450",
    fecha: "2024-05-08",
    categoria: "Legislación",
    autor: "Equipo de Comunicaciones",
    publicada: true,
  },
  {
    id: "3",
    slug: "monitoreo-aves-resultados",
    titulo: "Monitoreo ciudadano registra 47 especies de aves en humedales amenazados",
    resumen: "Voluntarios de la organización realizaron un censo intensivo de aves en el área amenazada y documentaron la presencia de especies en categorías de conservación.",
    contenido: `<p>Durante tres fines de semana consecutivos, más de 40 voluntarios participaron en un monitoreo ciudadano de aves en los humedales amenazados de la desembocadura del Biobío. Los resultados superaron las expectativas: se registraron 47 especies de aves, de las cuales 6 se encuentran en categorías de conservación según el Reglamento de Clasificación de Especies.</p>
    <p>Entre las especies detectadas destacan el playerito de rabadilla blanca (Calidris fuscicollis), el pilpilén (Haematopus palliatus) y la garza cuca (Ardea cocoi). También se observaron colonias de queltehues y bandurrias, especies que utilizan los humedales como zona de descanso en sus migraciones.</p>
    <p>Los datos recopilados serán presentados ante las autoridades ambientales como evidencia de la importancia ecológica del área y la urgencia de su protección.</p>`,
    imagen: "https://picsum.photos/seed/aves3/800/450",
    fecha: "2024-04-28",
    categoria: "Ciencia Ciudadana",
    autor: "Valentina Rojas",
    publicada: true,
  },
  {
    id: "4",
    slug: "municipio-concepcion-propuesta-proteccion",
    titulo: "Municipalidad de Concepción presenta propuesta de protección para humedales comunales",
    resumen: "El alcalde anunció el inicio de un proceso participativo para definir zonas de protección ambiental que incluirían los principales humedales de la ciudad.",
    contenido: `<p>La Municipalidad de Concepción dio a conocer una propuesta de actualización del Plan Regulador Comunal que contempla la creación de zonas de protección ecológica en torno a los principales humedales del municipio. La iniciativa es resultado de meses de conversaciones con organizaciones ambientales y ciudadanas.</p>
    <p>El alcalde señaló que la propuesta surge como respuesta a la creciente preocupación ciudadana por la conservación de estos ecosistemas. "Los humedales son el corazón verde de nuestra ciudad y tenemos la responsabilidad de protegerlos para las generaciones futuras", afirmó.</p>
    <p>El proceso participativo para definir los límites exactos de las zonas protegidas comenzará el próximo mes e incluirá talleres en los barrios aledaños a los humedales.</p>`,
    imagen: "https://picsum.photos/seed/munici4/800/450",
    fecha: "2024-04-15",
    categoria: "Política Local",
    autor: "Redacción ChankoCiudadano",
    publicada: true,
  },
  {
    id: "5",
    slug: "carbono-azul-humedales-costeros",
    titulo: "Estudio confirma potencial de captura de carbono de humedales costeros del Biobío",
    resumen: "Una investigación de la Universidad de Concepción cuantificó por primera vez el stock de carbono azul almacenado en los humedales costeros de la región.",
    contenido: `<p>Un equipo de investigadores de la Universidad de Concepción publicó los resultados de un estudio pionero que cuantificó el carbono almacenado en los suelos y biomasa de los humedales costeros del Biobío. Los hallazgos revelan que estos ecosistemas almacenan hasta cinco veces más carbono por hectárea que un bosque tropical.</p>
    <p>El estudio, financiado por el Fondo Nacional de Desarrollo Científico y Tecnológico (FONDECYT), analizó muestras de sedimentos y vegetación en cinco humedales de la región, incluyendo áreas amenazadas por el proyecto industrial cuestionado por organizaciones ambientalistas.</p>
    <p>La destrucción de estos humedales liberaría a la atmósfera el carbono acumulado durante siglos, contribuyendo significativamente a las emisiones de gases de efecto invernadero de la región y el país.</p>`,
    imagen: "https://picsum.photos/seed/carbono5/800/450",
    fecha: "2024-04-02",
    categoria: "Investigación",
    autor: "Dr. Rodrigo Saavedra",
    publicada: true,
  },
  {
    id: "6",
    slug: "jornada-limpieza-humedal",
    titulo: "Más de 200 personas participaron en jornada de limpieza del humedal Los Batros",
    resumen: "La actividad convocó a familias, estudiantes y vecinos que extrajeron más de 3 toneladas de residuos del humedal urbano de San Pedro de la Paz.",
    contenido: `<p>Bajo un cielo despejado y con gran entusiasmo, más de 200 personas se congregaron el pasado sábado para participar en la jornada de limpieza del humedal Los Batros, en San Pedro de la Paz. La actividad, organizada por ChankoCiudadano en conjunto con el municipio, logró extraer más de 3 toneladas de residuos del ecosistema.</p>
    <p>Entre los materiales retirados predominaron plásticos, electrodomésticos en desuso, neumáticos y escombros. Los participantes también plantaron 150 ejemplares de vegetación nativa para restaurar áreas degradadas en el borde del humedal.</p>
    <p>"Ver a tanta gente comprometida con cuidar este espacio es una señal esperanzadora", comentó una de las organizadoras. "Cada familia que viene se convierte en guardiana del humedal".</p>`,
    imagen: "https://picsum.photos/seed/limpieza6/800/450",
    fecha: "2024-03-20",
    categoria: "Acción Ciudadana",
    autor: "Equipo de Comunicaciones",
    publicada: true,
  },
]

export const eventos: Evento[] = [
  {
    id: "1",
    slug: "foro-humedales-concepcion",
    titulo: "Foro Ciudadano: Humedales del Biobío, ¿qué futuro queremos?",
    descripcion: "Espacio de diálogo y debate sobre el futuro de los humedales costeros de la región. Participarán expertos en ecología, abogados ambientales, representantes municipales y líderes comunitarios. El evento es abierto a la comunidad y no requiere inscripción previa.",
    imagen: "https://picsum.photos/seed/foro1/800/450",
    fecha: "2024-06-15",
    hora: "10:00",
    lugar: "Aula Magna, Universidad de Concepción",
    region: "Biobío",
    tipo: "presencial",
    publicado: true,
  },
  {
    id: "2",
    slug: "taller-fotografia-naturaleza",
    titulo: "Taller de Fotografía para la Conservación",
    descripcion: "Aprende a documentar la biodiversidad de los humedales con tu teléfono o cámara. El taller está orientado a personas sin experiencia previa en fotografía y buscamos formar monitores ciudadanos capaces de registrar y denunciar daños ambientales.",
    imagen: "https://picsum.photos/seed/taller2/800/450",
    fecha: "2024-06-22",
    hora: "09:00",
    lugar: "Humedal Los Batros (sector oriente)",
    region: "Biobío",
    tipo: "presencial",
    inscripcionUrl: "#",
    publicado: true,
  },
  {
    id: "3",
    slug: "webinar-ley-humedales",
    titulo: "Webinar: Cómo funciona la nueva Ley de Humedales",
    descripcion: "Sesión online para entender qué protege la ley vigente, cuáles son sus vacíos y cómo la ciudadanía puede utilizarla para defender los ecosistemas de su comunidad.",
    imagen: "https://picsum.photos/seed/webinar3/800/450",
    fecha: "2024-07-03",
    hora: "19:00",
    lugar: "Zoom (link por confirmar)",
    region: "Nacional",
    tipo: "virtual",
    inscripcionUrl: "#",
    publicado: true,
  },
  {
    id: "4",
    slug: "marcha-por-los-humedales",
    titulo: "Marcha por los Humedales del Biobío",
    descripcion: "Concentración ciudadana para visibilizar la amenaza que enfrenta la desembocadura del río Biobío. Convocamos a todas las personas, organizaciones y familias que quieran expresar su apoyo a la conservación de estos ecosistemas vitales.",
    imagen: "https://picsum.photos/seed/marcha4/800/450",
    fecha: "2024-07-20",
    hora: "11:00",
    lugar: "Plaza de la Independencia, Concepción",
    region: "Biobío",
    tipo: "presencial",
    publicado: true,
  },
]

export const videos: Video[] = [
  {
    id: "1",
    titulo: "Los humedales costeros: guardianes silenciosos del clima",
    descripcion: "Documental breve que explica la importancia de los humedales costeros en la mitigación del cambio climático y la protección de la biodiversidad.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/video1/640/360",
    fecha: "2024-04-10",
    categoria: "Educación",
    publicado: true,
  },
  {
    id: "2",
    titulo: "Recorrido por el humedal Los Batros",
    descripcion: "Un paseo virtual por uno de los humedales urbanos más importantes de la región del Biobío, en San Pedro de la Paz.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/video2/640/360",
    fecha: "2024-03-28",
    categoria: "Territorio",
    publicado: true,
  },
  {
    id: "3",
    titulo: "Entrevista: científicos explican el carbono azul",
    descripcion: "Investigadores de la Universidad de Concepción explican en términos simples qué es el carbono azul y por qué los humedales son cruciales para enfrentar el cambio climático.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/video3/640/360",
    fecha: "2024-03-15",
    categoria: "Ciencia",
    publicado: true,
  },
  {
    id: "4",
    titulo: "Aves de los humedales del Biobío",
    descripcion: "Registro audiovisual de las 47 especies de aves documentadas durante el monitoreo ciudadano de noviembre 2023.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/video4/640/360",
    fecha: "2024-02-20",
    categoria: "Biodiversidad",
    publicado: true,
  },
  {
    id: "5",
    titulo: "Testimonio: vecinos de la desembocadura del Biobío",
    descripcion: "Habitantes históricos de las zonas aledañas a los humedales comparten sus memorias y su preocupación por el futuro de estos ecosistemas.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/video5/640/360",
    fecha: "2024-02-05",
    categoria: "Comunidad",
    publicado: true,
  },
  {
    id: "6",
    titulo: "¿Qué dice la ley chilena sobre los humedales?",
    descripcion: "Un repaso claro y accesible a la legislación vigente en Chile sobre la protección de humedales urbanos y las herramientas que tiene la ciudadanía.",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://picsum.photos/seed/video6/640/360",
    fecha: "2024-01-22",
    categoria: "Legal",
    publicado: true,
  },
]

export const encuestas: Encuesta[] = [
  {
    id: "1",
    slug: "uso-humedales-comunidad",
    titulo: "¿Cómo usas los humedales de tu comunidad?",
    descripcion: "Queremos saber cómo los habitantes de la región se relacionan con los humedales locales y qué tan informados están sobre su importancia.",
    fechaInicio: "2024-05-01",
    fechaFin: "2024-07-31",
    activa: true,
    preguntas: [
      {
        id: "p1",
        texto: "¿Has visitado algún humedal en los últimos 12 meses?",
        tipo: "opcion_multiple",
        opciones: ["Sí, varias veces", "Sí, una o dos veces", "No, pero me gustaría", "No y no tengo interés"],
      },
      {
        id: "p2",
        texto: "¿Qué actividades realizas o realizarías en un humedal?",
        tipo: "opcion_multiple",
        opciones: ["Observación de aves", "Fotografía", "Caminata o deporte", "Educación ambiental con niños", "Ninguna"],
      },
      {
        id: "p3",
        texto: "¿Qué tan informado/a te consideras sobre la importancia ecológica de los humedales?",
        tipo: "escala",
        opciones: ["1", "2", "3", "4", "5"],
      },
      {
        id: "p4",
        texto: "¿Qué te gustaría encontrar en un área de humedal habilitada para visitas?",
        tipo: "texto_libre",
      },
    ],
  },
  {
    id: "2",
    slug: "prioridades-ambientales-region",
    titulo: "Prioridades ambientales para el Biobío",
    descripcion: "Ayúdanos a identificar cuáles son los temas ambientales más urgentes para la ciudadanía de la región del Biobío.",
    fechaInicio: "2024-04-15",
    fechaFin: "2024-06-30",
    activa: true,
    preguntas: [
      {
        id: "p1",
        texto: "¿Cuál es el problema ambiental que más te preocupa en la región?",
        tipo: "opcion_multiple",
        opciones: ["Contaminación del río Biobío", "Pérdida de humedales", "Contaminación del aire en ciudades", "Deforestación", "Contaminación de playas"],
      },
      {
        id: "p2",
        texto: "¿Cuánta importancia le das a la protección del medio ambiente en las decisiones de tu municipio?",
        tipo: "escala",
        opciones: ["1", "2", "3", "4", "5"],
      },
      {
        id: "p3",
        texto: "¿Qué medidas crees que el municipio debería tomar de manera prioritaria?",
        tipo: "texto_libre",
      },
    ],
  },
]

const comunas = [
  "Concepción", "Talcahuano", "San Pedro de la Paz", "Coronel", "Lota",
  "Chiguayante", "Penco", "Tomé", "Hualpén", "Florida",
  "Hualqui", "Santa Juana", "San Rosendo", "Lebu", "Los Álamos",
  "Arauco", "Curanilahue", "Tirúa", "Los Ángeles", "Nacimiento",
  "Negrete", "Mulchén", "Quilaco", "Quilleco", "Santa Bárbara",
  "Antuco", "Tucapel", "Yumbel", "Cabrero", "Laja",
  "Temuco", "Valdivia", "Osorno", "Puerto Montt", "Santiago",
]

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split("T")[0]
}

const comentariosEjemplo = [
  "Los humedales son el pulmón de nuestra región y es urgente protegerlos.",
  "Vivo cerca del humedal Los Batros y es un espacio invaluable para la comunidad.",
  "Es importante que las generaciones futuras puedan disfrutar de estos ecosistemas.",
  "Necesitamos más información sobre cómo afecta esto a nuestra agua potable.",
  "Apoyo totalmente esta iniciativa, los humedales son vida.",
  "Como vecino de San Pedro, valoro mucho estos espacios naturales.",
  "Excelente iniciativa, la ciudadanía debe involucrarse en estas decisiones.",
  "Los humedales son fundamentales para la biodiversidad de nuestra región.",
]

export const participaciones: Participacion[] = Array.from({ length: 150 }, (_, i) => {
  const posiciones: Participacion["posicion"][] = ["apoyo", "apoyo", "apoyo", "apoyo", "no_apoyo", "necesito_info"]
  const posicion = posiciones[Math.floor(Math.random() * posiciones.length)]
  const tieneComentario = Math.random() > 0.6
  const estadoComentario: Participacion["estadoComentario"] =
    tieneComentario
      ? (Math.random() > 0.3 ? "aprobado" : Math.random() > 0.5 ? "pendiente" : "rechazado")
      : "pendiente"

  return {
    id: String(i + 1),
    posicion,
    nombre: `Ciudadano ${i + 1}`,
    comuna: comunas[Math.floor(Math.random() * comunas.length)],
    estadoComentario,
    comentario: tieneComentario ? comentariosEjemplo[Math.floor(Math.random() * comentariosEjemplo.length)] : undefined,
    fecha: randomDate(new Date("2024-03-01"), new Date("2024-05-28")),
  }
})

function calcularEstadisticas(): Estadisticas {
  const total = participaciones.length
  const apoyo = participaciones.filter(p => p.posicion === "apoyo").length
  const noApoyo = participaciones.filter(p => p.posicion === "no_apoyo").length
  const necesitaInfo = participaciones.filter(p => p.posicion === "necesito_info").length

  const porComunaMap: Record<string, number> = {}
  participaciones.forEach(p => {
    porComunaMap[p.comuna] = (porComunaMap[p.comuna] || 0) + 1
  })
  const porComuna = Object.entries(porComunaMap)
    .map(([comuna, total]) => ({ comuna, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  const porFechaMap: Record<string, { total: number; apoyo: number }> = {}
  participaciones.forEach(p => {
    const mes = p.fecha.slice(0, 7)
    if (!porFechaMap[mes]) porFechaMap[mes] = { total: 0, apoyo: 0 }
    porFechaMap[mes].total++
    if (p.posicion === "apoyo") porFechaMap[mes].apoyo++
  })
  const porFecha = Object.entries(porFechaMap)
    .map(([fecha, data]) => ({ fecha, ...data }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))

  const comentariosAprobados = participaciones
    .filter(p => p.estadoComentario === "aprobado" && p.comentario)
    .slice(0, 6)
    .map(p => ({
      id: p.id,
      nombre: p.nombre,
      comuna: p.comuna,
      comentario: p.comentario!,
      posicion: p.posicion,
      fecha: p.fecha,
    }))

  return { total, apoyo, noApoyo, necesitaInfo, porComuna, porFecha, comentariosAprobados }
}

export const estadisticas = calcularEstadisticas()

export const comunasChile = [
  "Arica", "Camarones", "Putre", "General Lagos",
  "Iquique", "Camiña", "Colchane", "Huara", "Pica", "Pozo Almonte",
  "Antofagasta", "Calama", "Mejillones", "Ollagüe", "San Pedro de Atacama", "Sierra Gorda", "Taltal", "Tocopilla",
  "Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco",
  "La Serena", "Andacollo", "Coquimbo", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado",
  "Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María",
  "Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor",
  "Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz",
  "Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas",
  "Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío",
  "Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria",
  "Valdivia", "Corral", "Futrono", "La Unión", "Lago Ranco", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "Río Bueno",
  "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Montt", "Calbuco", "Cochamó", "Hualaihué", "Ancud", "Castro", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao",
  "Coihaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez",
  "Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Puerto Natales", "Torres del Paine", "Porvenir", "Primavera", "Timaukel",
].sort()
