export type HomeIdentityItem = {
  title: string;
  description: string;
  iconClass: string;
};

export const homeContent = {
  hero: {
    title: "ICE Jardins",
    subtitle: "Pessoas imperfeitas compartilhando a perfeição de Cristo",
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
    title: "Nossos Cultos",
    description: "Junte-se a nós aos domingos. Há um lugar preparado para você e sua família.",
    items: [
      {
        title: "Culto Inspirativo",
        time: "Domingos às 9h30",
        iconClass: "bi bi-clock"
      },
      {
        title: "Escola Dominical",
        time: "Domingos às 11h00",
        iconClass: "bi bi-book"
      }
    ]
  },
  location: {
    title: "Como Nos Encontrar",
    place: "Auditório do Colégio In-Nova",
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
  }
};
