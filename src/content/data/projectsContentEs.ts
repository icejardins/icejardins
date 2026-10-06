import type { DemographicMetric, NeighborhoodReach, ProjectPhase } from "./projectsContent";

export const projectsContentEs = {
  hero: {
    badge: "Proyectos ICE Jardins",
    title: "Construcción de Nuestro Futuro Templo",
    subtitle: "Un espacio sagrado dedicado a Dios, construido para las generaciones venideras en Jardim Botânico y Tororó.",
    verse: "“Entonces les dije: Levantémonos y edifiquemos. Y esforzaron sus manos para bien.”",
    reference: "Nehemías 2:18",
    image: "/images/projetos/templo-ice-jardins-conceito.webp"
  },

  terrainStatus: {
    badge: "Estado Actual de la Propiedad",
    headline: "Terreno Adquirido y Actualmente en Proceso de Pago",
    callout:
      "ICE Jardins ya adquirió la propiedad para su futura sede definitiva en Fazenda Taboquinha (Gleba 01). El terreno aún se está pagando, y nuestra iglesia cumple fielmente cada cuota programada a través de la provisión de Dios y el compromiso constante de nuestra comunidad de fe.",
    details: [
      "La adquisición de la Gleba 01 marca un hito histórico para la proclamación del Evangelio en el Distrito Federal.",
      "Amortizamos progresivamente las cuotas contractuales con estricta disciplina presupuestaria y transparencia financiera.",
      "Cada contribución apoya directamente el pago del terreno donde nuestros hijos, nietos y nuevas familias adorarán a Dios."
    ]
  },

  terrainSpecs: {
    title: "Especificaciones de la Propiedad",
    subtitle: "Datos catastrales y levantamiento topográfico oficial",
    property: "Fazenda Taboquinha — Gleba 01",
    municipality: "RA XXVII Jardim Botânico / Tororó — Brasília, DF, Brasil",
    cep: "71686-206",
    areaM2: "24.368,29 m²",
    areaHectares: "2,44 hectáreas (~6,02 acres)",
    perimeter: "675,37 metros lineales (2.215 pies)",
    datum: "SIRGAS 2000 / Zona UTM 23S",
    coordinates: "15°51'57\" S | 47°47'02\" O (-15.8658°, -47.7840°)",
    verticesCount: 22,
    kmlDownloadUrl: "/downloads/terreno-ice-jardins-fazenda-taboquinha.kml",
    googleEarthWebUrl: "https://earth.google.com/earth/d/1KC_qk9um_6lkK5n5C-WTyGA_GdvzuE8_?usp=sharing",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-15.86583,-47.78385"
  },

  demographics: {
    title: "Diagnóstico Habitacional y Potencial de Alcance Regional",
    subtitle: "¿Por qué construir en Jardim Botânico y en el corredor de expansión DF-140 / Tororó?",
    intro:
      "La Región Administrativa de Jardim Botânico (RA XXVII) y sus alrededores experimentan una de las expansiones urbanas y demográficas más aceleradas de Brasília. Adquirir una propiedad de 2,44 hectáreas (24.000 m²) en este corredor estratégico atiende a una cuenca poblacional de cientos de miles de residentes en busca de raíces espirituales genuinas, apoyo familiar y una comunidad bíblica fiel.",
    metrics: [
      {
        value: "77.767+",
        label: "Población de Jardim Botânico",
        detail: "Residentes registrados en RA XXVII con un crecimiento anual aproximado del 4%.",
        source: "Censo IBGE 2022 y PDAD-A 2024 (IPEDF)",
        icon: "people-fill"
      },
      {
        value: "92k a 117k",
        label: "Expansión Tororó / DF-140",
        detail: "Proyección gubernamental para el nuevo Polo Urbano de Tororó y barrios planificados.",
        source: "SEDUH-GDF Planificación Urbana",
        icon: "building"
      },
      {
        value: "240.000+",
        label: "Cuenca Directa de Alcance",
        detail: "Población en un radio de 15 minutos en automóvil (Jardim Botânico, Tororó, São Sebastião y Mangueiral).",
        source: "Datos Consolidados IPEDF / IBGE",
        icon: "geo-alt-fill"
      },
      {
        value: "80%+",
        label: "Condominios Cerrados",
        detail: "Predominio de familias con niños pequeños y adolescentes, con alta demanda de vida comunitaria.",
        source: "PDAD Jardim Botânico",
        icon: "houses-fill"
      }
    ] as DemographicMetric[],

    reachNeighborhoods: [
      {
        name: "Jardim Botânico y Tororó (DF-140)",
        population: "~80.000 residentes (rápida expansión)",
        distanceTime: "0 a 7 minutos",
        profile: "Condominios horizontales cerrados, familias de ingresos medios-altos, parejas jóvenes con niños y adolescentes."
      },
      {
        name: "Jardins Mangueiral",
        population: "~30.000 residentes",
        distanceTime: "8 a 12 minutos",
        profile: "Barrio residencial planificado, alta concentración de parejas jóvenes, niños en edad escolar y profesionales."
      },
      {
        name: "São Sebastião",
        population: "~115.000 residentes",
        distanceTime: "10 a 15 minutos",
        profile: "Zona urbana consolidada con comercio vibrante, familias trabajadoras y gran necesidad de proyectos sociales y ministeriales."
      },
      {
        name: "Altiplano Leste y Barreiro",
        population: "~15.000 residentes",
        distanceTime: "12 a 18 minutos",
        profile: "Propiedades campestres y sectores suburbanos en transición hacia el tejido integrado de Brasília."
      }
    ] as NeighborhoodReach[],

    strategicInsights: [
      {
        title: "Escasez de Espacios Públicos Comunitarios",
        text: "Los diagnósticos oficiales del IPEDF señalan una profunda falta de plazas, espacios cívicos y centros de convivencia en la región. El complejo de ICE Jardins servirá como un punto de encuentro, esperanza, comunión y cuidado para las familias locales.",
        icon: "heart-pulse-fill"
      },
      {
        title: "Discipulado de la Próxima Generación",
        text: "Con decenas de miles de niños y adolescentes viviendo en los condominios circundantes, nuestra vocación prioritaria es la enseñanza bíblica sólida, la mentoría juvenil, el apoyo a los padres y la formación de carácter en Cristo.",
        icon: "mortarboard-fill"
      },
      {
        title: "Preservación y Mayordomía del Cerrado",
        text: "Con 2,44 hectáreas, el terreno permite una arquitectura sustentable de bajo impacto, preservando los árboles nativos del Cerrado (ipês, palmeras buriti), el drenaje natural y la belleza escénica del altiplano brasileño.",
        icon: "tree-fill"
      }
    ]
  },

  masterplan: {
    title: "Plan Maestro: Qué Incluirá el Complejo",
    subtitle: "Un diseño arquitectónico multipropósito concebido para servir a la comunidad y glorificar a Dios",
    items: [
      {
        title: "Santuario Principal (Nave del Templo)",
        description:
          "Auditorio acogedor con excelente acústica, iluminación natural y confort térmico para los cultos dominicales, bautismos y conferencias bíblicas.",
        icon: "building"
      },
      {
        title: "Ala de Ministerio Infantil y Escuela Dominical",
        description:
          "Aulas por edades, sala cuna segura con visores, salones preescolares temáticos y baños adaptados para servir a las familias con excelencia.",
        icon: "puzzle"
      },
      {
        title: "Patio de Convivencia y Café",
        description:
          "Jardín interno y espacio de hospitalidad para la comunión después del culto, recepción de visitantes, grupos pequeños y conexión comunitaria.",
        icon: "cup-hot"
      },
      {
        title: "Auditorio Juvenil y Multipropósito",
        description:
          "Espacio dinámico para reuniones de jóvenes y adolescentes, seminarios familiares, bodas y programas de capacitación de liderazgo.",
        icon: "people"
      },
      {
        title: "Estacionamiento Amplio y Seguro",
        description:
          "Capacidad planificada para cientos de vehículos y motocicletas, esencial para la dinámica residencial de condominios donde el transporte automotor es predominante.",
        icon: "car-front"
      },
      {
        title: "Parque Ecológico del Cerrado y Sendero de Oración",
        description:
          "Área verde protegida con flora y árboles nativos, que ofrecerá senderos de oración al aire libre y retiros para familias.",
        icon: "flower1"
      }
    ]
  },

  phases: [
    {
      id: "phase-1",
      number: 1,
      title: "Adquisición y Pago del Terreno",
      subtitle: "Gleba 01 — Fazenda Taboquinha",
      status: "in_progress",
      statusLabel: "En Curso (Terreno en Pago)",
      description:
        "La propiedad de 24.368,29 m² (2,44 hectáreas) fue adquirida contractualmente y actualmente está siendo pagada por ICE Jardins. Cumplimos nuestros compromisos financieros al día mediante la generosidad de los miembros y aliados ministeriales.",
      highlights: [
        "Coordenadas planialtimétricas de límites registradas oficialmente",
        "2,44 hectáreas con un perímetro de 675 metros",
        "Amortización periódica de cuotas con rendición de cuentas transparente"
      ]
    },
    {
      id: "phase-2",
      number: 2,
      title: "Estudios Preliminares y Permisos",
      subtitle: "Topografía, Mecánica de Suelos y Cumplimiento Ambiental",
      status: "in_progress",
      statusLabel: "En Curso",
      description:
        "Realización de levantamientos altimétricos de alta precisión, ensayos de permeabilidad y carga de suelo, y licenciamiento ambiental en coordinación con SEDUH-GDF y los organismos correspondientes.",
      highlights: [
        "Estudios de drenaje y permeabilidad del suelo",
        "Integración con el plan maestro del corredor vial DF-140",
        "Alineación urbanística con las directrices del Distrito Federal"
      ]
    },
    {
      id: "phase-3",
      number: 3,
      title: "Diseño Arquitectónico y de Ingeniería",
      subtitle: "Plan Maestro, Santuario y Edificios Educativos",
      status: "upcoming",
      statusLabel: "Próxima Fase",
      description:
        "Elaboración de planos completos, ingeniería estructural, instalaciones eléctricas, hidrosanitarias, acondicionamiento acústico, ventilación natural sustentable y accesibilidad universal.",
      highlights: [
        "Diseño integrado con la topografía y vegetación del Cerrado",
        "Disposición modular que permite habilitaciones operativas por etapas",
        "Accesibilidad total sin barreras arquitectónicas"
      ]
    },
    {
      id: "phase-4",
      number: 4,
      title: "Infraestructura Básica y Movimiento de Tierras",
      subtitle: "Vías de Acceso, Cierre Perimetral y Drenaje",
      status: "upcoming",
      statusLabel: "Fase Futura",
      description:
        "Nivelación del terreno y terraplenes sustentables, cerramiento de seguridad perimetral, portones de acceso, canalización de servicios, manejo de aguas pluviales y vías internas permeables.",
      highlights: [
        "Acceso pavimentado conectado a la red vial municipal",
        "Biolagos y cuencas de retención de aguas pluviales",
        "Pozo artesiano y preparación para energía solar limpia"
      ]
    },
    {
      id: "phase-5",
      number: 5,
      title: "Construcción del Santuario y Edificios de Apoyo",
      subtitle: "Estructura, Cubierta y Aulas Principales",
      status: "upcoming",
      statusLabel: "Fase Futura",
      description:
        "Construcción de la estructura principal, albañilería, cubierta de alto rendimiento termoacústico, módulos sanitarios, sala cuna y aulas prioritarias de Escuela Dominical.",
      highlights: [
        "Nave amplia sin columnas intermedias con visibilidad total",
        "Sistemas de iluminación y ventilación natural energéticamente eficientes",
        "Espacios multipropósito listos para uso ministerial inmediato"
      ]
    },
    {
      id: "phase-6",
      number: 6,
      title: "Acabados, Mobiliario y Dedicación del Templo",
      subtitle: "Consagración e Inauguración del Complejo",
      status: "upcoming",
      statusLabel: "Fase Futura",
      description:
        "Instalación de sistemas audiovisuales y acústicos, iluminación escénica, silletería del auditorio, paisajismo con especies del Cerrado y culto solemne de consagración del lugar al Señor.",
      highlights: [
        "Equipamiento profesional de sonido y transmisión digital",
        "Ambientes cálidos y acogedores preparados para las familias",
        "Comienzo de todas las actividades regulares en la sede permanente"
      ]
    }
  ] as ProjectPhase[],

  googleEarthGuide: {
    title: "Cómo Explorar la Propiedad en Google Earth",
    description:
      "Descubra la topografía 3D, elevación y perímetro de límites de la Gleba 01 de ICE Jardins en Google Earth.",
    webTip:
      "Haga clic en 'Abrir Proyecto en Google Earth (3D)' para cargar instantáneamente el proyecto oficial publicado con el polígono demarcado y el terreno 3D directamente en su navegador.",
    desktopSteps: [
      "Haga clic en 'Abrir en Google Earth' para cargar el proyecto 3D interactivo directamente en su navegador, sin necesidad de instalar programas ni importar archivos manualmente.",
      "Si prefiere usar Google Earth Pro en su computadora de escritorio o verlo sin conexión, use 'Descargar Archivo KML' para guardar el archivo oficial 'terreno-ice-jardins-fazenda-taboquinha.kml'.",
      "En la aplicación de escritorio, abra el archivo KML descargado para visualizar el polígono completo de 24.368 m², los 22 vértices georreferenciados y las medidas del perímetro."
    ]
  },

  givingCta: {
    title: "Únase a Nosotros en la Construcción del Templo",
    subtitle:
      "Sus oraciones y colaboración financiera ayudan a saldar las cuotas del terreno y preparar este lugar sagrado para las futuras generaciones.",
    usaTaxDeductible: "501(c)(3) Deducible de Impuestos para Donantes en EE.UU.",
    usaDescription:
      "Si reside en los Estados Unidos o prefiere donar en dólares estadounidenses, su contribución puede realizarse de forma segura a través de Reliant Mission en alianza con Acts 29, con deducción fiscal completa en EE.UU.",
    usaButtonLabel: "Donar vía Reliant (Acts 29)",
    usaUrl: "https://reliant.org/acts29br.jardins",
    pixKey: "35.896.960/0001-66",
    pixRaw: "35896960000166",
    bank: "001 - Banco do Brasil S.A.",
    agency: "3596-3",
    account: "22901-6",
    recipient: "IGREJA CRISTA EVANGELICA JARDINS - ICE JARDINS",
    whatsappUrl:
      "https://wa.me/5561982624952?text=¡Hola!%20Me%20gustaría%20saber%20más%20sobre%20el%20Proyecto%20de%20Edificación%20de%20ICE%20Jardins"
  }
};
