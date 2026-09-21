export type HomeIdentityItem = {
  title: string;
  description: string;
  iconClass: string;
};

export const homeContent = {
  hero: {
    title: "Igreja Cristã Evangélica Jardins",
    subtitle: "Pessoas imperfeitas compartilhando a perfeição de Cristo\nDomingos, 9h30 • Jardim Botânico (Colégio In-Nova)",
    ctaLabel: "Conheça a Igreja",
    ctaTarget: "#quem-somos"
  },
  about: {
    title: "Quem Somos",
    lead: "Somos uma comunidade em Brasília onde pessoas imperfeitas vivenciam e compartilham o amor imerecido de Cristo.",
    body: "O nome Jardins não é por acaso. Deus nos criou em um jardim e deseja cultivar em nós as belezas que Ele mesmo planejou. Aqui, cada pessoa é uma semente que pode florescer pela graça de Deus.",
    highlight: "Todos podem ser transformados por Jesus!"
  },
  identity: [
    {
      title: "Bíblica",
      description:
        "Toda a nossa fé e prática são fundamentadas nas Escrituras Sagradas. A Bíblia é a nossa autoridade final em todas as questões de fé e conduta.",
      iconClass: "bi bi-book"
    },
    {
      title: "Discipuladora",
      description:
        "Acreditamos que cada crente é chamado a crescer na fé e a discipular outros. Investimos em relacionamentos transformadores que levam à maturidade espiritual.",
      iconClass: "bi bi-people"
    },
    {
      title: "Evangelizadora",
      description:
        "Somos movidos pela Grande Comissão. Cada membro é um embaixador de Cristo, chamado a compartilhar a Boa Nova com a família, os amigos e a comunidade.",
      iconClass: "bi bi-globe-americas"
    }
  ] as HomeIdentityItem[],
  worship: {
    title: "Horários dos Cultos de Domingo",
    description: "Junte-se a nós aos domingos no Jardim Botânico. Há um lugar preparado para você e sua família.",
    items: [
      {
        title: "Culto Inspirativo",
        time: "Domingos às 9h30",
        iconClass: "bi bi-clock"
      },
      {
        title: "Escola Dominical & Ministério Infantil",
        time: "Domingos às 11h00",
        iconClass: "bi bi-book"
      }
    ]
  },
  location: {
    title: "Como Chegar à ICE Jardins (Jardim Botânico)",
    place: "Auditório do Colégio In-Nova",
    regionNote: "Acolhendo famílias do Jardim Botânico, Jardins Mangueiral, Tororó, Altiplano Leste, São Bartolomeu e Lago Sul.",
    mapUrl: "https://maps.app.goo.gl/ddMo7kUUDr6fHYyX9",
    mapLabel: "Abrir no Google Maps / Waze",
    details: [
      "(antigo COC Jardim Botânico)",
      "Condomínio Estância Jardim Botânico II",
      "SH Jardim Botânico",
      "Brasília — DF, CEP 71686-301"
    ],
    email: "secretaria@icejardins.org.br"
  },
  closing: {
    quote: "Não fique só. Vamos caminhar juntos!",
    invitation: "Esperamos por você."
  },
  images: {
    hero: "/images/sobre/identidade.webp",
    congregation: "/images/sobre/congregacao.webp",
    community: "/images/sobre/comunidade.webp"
  },
  buildingSpotlight: {
    badge: "Missão & Edificação • Próximas Gerações",
    title: "Construção do Templo — Fazenda Taboquinha",
    subtitle: "Para que as próximas gerações conheçam Jesus Cristo e encontrem esperança",
    image: "/images/projetos/templo-ice-jardins-conceito.webp",
    image640: "/images/projetos/templo-ice-jardins-conceito-640.webp",
    image1040: "/images/projetos/templo-ice-jardins-conceito-1040.webp",
    statusText:
      "Nossa missão é viver e transmitir o evangelho às futuras gerações — acolhendo crianças, jovens e famílias em uma comunidade fiel a Cristo. Já adquirimos a propriedade de 24.368 m² na Fazenda Taboquinha (DF-140) para a nossa sede definitiva e seguimos honrando os pagamentos do terreno com fé e responsabilidade. Sua contribuição viabiliza a quitação do solo e prepara um espaço permanente para acolher quem ainda vai chegar.",
    bullets: [
      { label: "Área Adquirida", value: "24.368 m² (~2,44 ha)" },
      { label: "Status do Terreno", value: "Ativo em Pagamento" },
      { label: "Bacia de Alcance", value: "240.000+ pessoas" },
      { label: "Complexo", value: "Nave, Ministério Infantil e Convivência" }
    ],
    detailsLink: "/contribuir/edificacao/",
    detailsLabel: "Conhecer Projeto Completo & Diagnóstico",
    earthUrl: "https://earth.google.com/earth/d/1KC_qk9um_6lkK5n5C-WTyGA_GdvzuE8_?usp=sharing",
    earthLabel: "Ver no Google Earth (3D)"
  }
};
