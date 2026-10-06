import type { HomeIdentityItem } from "./homeContent";

export const homeContentEs = {
  hero: {
    title: "Iglesia Cristiana Evangélica Jardins",
    subtitle: "Personas imperfectas compartiendo la perfección de Cristo\nDomingos a las 9:30 • Jardim Botânico, Brasília - Brasil",
    ctaLabel: "Conozca la Iglesia",
    ctaTarget: "#about"
  },
  about: {
    title: "Quiénes Somos",
    lead: "Somos una comunidad cristiana en Brasília donde personas imperfectas experimentan y comparten el amor inmerecido de Jesucristo.",
    body: "El nombre Jardins (Jardines) no es una coincidencia. Dios nos creó en un jardín y anhela cultivar en nosotros la belleza que Él mismo diseñó. Aquí, cada persona es una semilla que puede florecer por la gracia de Dios.",
    highlight: "¡Todos pueden ser transformados por Jesús!"
  },
  identity: [
    {
      title: "Bíblica",
      description:
        "Toda nuestra fe y práctica están fundamentadas en las Sagradas Escrituras. La Biblia es nuestra autoridad final en todas las cuestiones de fe y conducta.",
      iconClass: "bi bi-book"
    },
    {
      title: "Discipuladora",
      description:
        "Creemos que cada creyente es llamado a crecer en la fe y a discipular a otros. Invertimos en relaciones transformadoras que conducen a la madurez espiritual.",
      iconClass: "bi bi-people"
    },
    {
      title: "Evangelizadora",
      description:
        "Impulsados por la Gran Comisión, cada miembro es un embajador de Cristo, llamado a compartir las Buenas Nuevas con su familia, amigos y la comunidad.",
      iconClass: "bi bi-globe-americas"
    }
  ] as HomeIdentityItem[],
  worship: {
    title: "Horarios de Cultos de Domingo",
    description: "Únase a nosotros los domingos en Jardim Botânico. Hay un lugar preparado para usted y su familia.",
    items: [
      {
        title: "Culto Inspirativo",
        time: "Domingos a las 9:30",
        iconClass: "bi bi-clock"
      },
      {
        title: "Escuela Dominical y Ministerio Infantil",
        time: "Domingos a las 11:00",
        iconClass: "bi bi-book"
      }
    ]
  },
  location: {
    title: "Cómo Llegar a ICE Jardins (Jardim Botânico)",
    place: "Auditorio del Colegio In-Nova",
    regionNote: "Recibiendo familias de Jardim Botânico, Jardins Mangueiral, Tororó, Altiplano Leste, São Bartolomeu y Lago Sul.",
    mapUrl: "https://maps.app.goo.gl/ddMo7kUUDr6fHYyX9",
    mapLabel: "Abrir en Google Maps / Waze",
    details: [
      "(antiguo COC Jardim Botânico)",
      "Condomínio Estância Jardim Botânico II",
      "SH Jardim Botânico",
      "Brasília — DF, 71686-301, Brasil"
    ],
    email: "secretaria@icejardins.org.br"
  },
  closing: {
    quote: "No camines solo. ¡Caminemos juntos!",
    invitation: "Esperamos darle la bienvenida."
  },
  images: {
    hero: "/images/sobre/identidade.webp",
    congregation: "/images/sobre/congregacao.webp",
    community: "/images/sobre/comunidade.webp"
  },
  buildingSpotlight: {
    badge: "Misión y Edificación • Futuras Generaciones",
    title: "Proyecto del Templo — Fazenda Taboquinha",
    subtitle: "Para que las próximas generaciones conozcan a Jesucristo y encuentren esperanza duradera",
    image: "/images/projetos/templo-ice-jardins-conceito.webp",
    image640: "/images/projetos/templo-ice-jardins-conceito-640.webp",
    image1040: "/images/projetos/templo-ice-jardins-conceito-1040.webp",
    statusText:
      "Nuestra misión es vivir y transmitir el evangelio a las futuras generaciones — acogiendo a niños, jóvenes y familias en una comunidad centrada en Cristo. Hemos adquirido una propiedad de 2,44 hectáreas (24.368 m²) en el corredor Jardim Botânico / Tororó para nuestra sede definitiva, que actualmente se encuentra en proceso de pago. Su donación apoya directamente la cancelación de las cuotas del terreno y la preparación de un santuario permanente para quienes vendrán.",
    bullets: [
      { label: "Área Adquirida", value: "24.368 m² (~2,44 ha)" },
      { label: "Estado del Terreno", value: "Activo en Pago" },
      { label: "Cuenca de Alcance", value: "240.000+ residentes" },
      { label: "Plan del Complejo", value: "Templo, Ministerio Infantil y Convivencia" }
    ],
    detailsLink: "/es/donar/proyecto-templo/",
    detailsLabel: "Conocer el Proyecto del Templo y Estudio Regional",
    earthUrl: "https://earth.google.com/earth/d/1KC_qk9um_6lkK5n5C-WTyGA_GdvzuE8_?usp=sharing",
    earthLabel: "Ver en Google Earth (3D)"
  }
};
