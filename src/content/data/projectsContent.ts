export interface ProjectPhase {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  status: "completed" | "in_progress" | "upcoming";
  statusLabel: string;
  description: string;
  highlights: string[];
}

export interface DemographicMetric {
  value: string;
  label: string;
  detail: string;
  source: string;
  icon: string;
}

export interface NeighborhoodReach {
  name: string;
  population: string;
  distanceTime: string;
  profile: string;
}

export const projectsContent = {
  hero: {
    badge: "Projetos ICE Jardins",
    title: "Construção do Nosso Futuro Templo",
    subtitle: "Um espaço dedicado a Deus, edificado para as próximas gerações no Jardim Botânico e Tororó.",
    verse: "“Disse-lhes eu: Dispúnhamo-nos e edifiquemos. E fortaleceram as mãos para a boa obra.”",
    reference: "Neemias 2:18",
    image: "/images/projetos/templo-ice-jardins-conceito.webp"
  },

  terrainStatus: {
    badge: "Status Atual da Propriedade",
    headline: "Terreno Adquirido e em Processo Ativo de Pagamento",
    callout: "A ICE Jardins já adquiriu a propriedade da futura sede na Fazenda Taboquinha (Gleba 01). O terreno ainda está sendo pago e a igreja segue honrando fielmente cada parcela com a provisão de Deus e o compromisso da nossa comunidade.",
    details: [
      "A aquisição da Gleba 01 representa um marco histórico para a proclamação do Evangelho no Distrito Federal.",
      "Seguimos amortizando as parcelas contratuais com rigor e responsabilidade orçamentária.",
      "Cada contribuição mensal fortalece a quitação definitiva do solo onde nossos filhos e novas famílias adorarão a Deus."
    ]
  },

  terrainSpecs: {
    title: "Ficha Técnica do Terreno",
    subtitle: "Dados cadastrais e topográficos oficiais do levantamento planialtimétrico",
    property: "Fazenda Taboquinha - Gleba 01",
    municipality: "RA XXVII Jardim Botânico / Tororó - Brasília, DF",
    cep: "71686-206",
    areaM2: "24.368,29 m²",
    areaHectares: "2,44 hectares",
    perimeter: "675,37 metros lineares",
    datum: "SIRGAS 2000 / UTM fuso 23S",
    coordinates: "15°51'57\" S | 47°47'02\" W (-15.8658°, -47.7840°)",
    verticesCount: 22,
    kmlDownloadUrl: "/downloads/terreno-ice-jardins-fazenda-taboquinha.kml",
    googleEarthWebUrl: "https://earth.google.com/earth/d/1KC_qk9um_6lkK5n5C-WTyGA_GdvzuE8_?usp=sharing",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-15.86583,-47.78385"
  },

  demographics: {
    title: "Diagnóstico Habitacional e Potencial de Alcance",
    subtitle: "Por que construir no Jardim Botânico e no polo habitacional da DF-140 / Tororó?",
    intro:
      "A Região Administrativa do Jardim Botânico (RA XXVII) e seu entorno imediato vivenciam uma das maiores transformações urbanísticas e demográficas do Distrito Federal. A aquisição de uma gleba de 24 mil m² nessa localização estratégica atende a uma bacia de milhares de famílias em busca de raízes espirituais, apoio familiar e comunidade bíblica sólida.",
    metrics: [
      {
        value: "77.767+",
        label: "População Jardim Botânico",
        detail: "Habitantes registrados na RA XXVII com expansão de ~4% ao ano.",
        source: "Censo IBGE 2022 & PDAD-A 2024 (IPEDF)",
        icon: "people-fill"
      },
      {
        value: "92k a 117k",
        label: "Novo Polo DF-140 / Tororó",
        detail: "Projeção governamental para o Centro Urbano Tororó e novos bairros planejados.",
        source: "Planejamento Urbano SEDUH-GDF",
        icon: "building"
      },
      {
        value: "240.000+",
        label: "Bacia de Alcance Direto",
        detail: "Moradores em um raio de até 15 minutos (Jardim Botânico, Tororó, São Sebastião e Mangueiral).",
        source: "Estimativa Consolidada IPEDF/IBGE",
        icon: "geo-alt-fill"
      },
      {
        value: "80%+",
        label: "Condomínios Horizontais",
        detail: "Predomínio de famílias com crianças e jovens, com alta demanda por convivência comunitária.",
        source: "PDAD Jardim Botânico",
        icon: "houses-fill"
      }
    ] as DemographicMetric[],

    reachNeighborhoods: [
      {
        name: "Jardim Botânico & Tororó (DF-140)",
        population: "~80.000 hab. (em forte alta)",
        distanceTime: "0 a 7 minutos",
        profile: "Condomínios residenciais fechados, alta renda familiar, casais jovens com filhos pequenos e adolescentes."
      },
      {
        name: "Jardins Mangueiral",
        population: "~30.000 hab.",
        distanceTime: "8 a 12 minutos",
        profile: "Bairro planejado horizontal e vertical, alta densidade de jovens casais, crianças em idade escolar e jovens profissionais."
      },
      {
        name: "São Sebastião",
        population: "~115.000 hab.",
        distanceTime: "10 a 15 minutos",
        profile: "Centro urbano consolidado com vibrante comércio local, famílias trabalhadoras e demanda por ações sociais e ministeriais."
      },
      {
        name: "Altiplano Leste & Barreiro",
        population: "~15.000 hab.",
        distanceTime: "12 a 18 minutos",
        profile: "Área de chácaras e condomínios ecológicos em transição urbana e integração com o Lago Sul."
      }
    ] as NeighborhoodReach[],

    strategicInsights: [
      {
        title: "Carência de Espaços Comunitários",
        text: "Os diagnósticos do IPEDF e da administração distrital apontam escassez severa de áreas de convivência pública, centros culturais e praças comunitárias. O projeto da ICE Jardins funcionará como um centro de acolhimento e suporte para toda a bacia habitacional.",
        icon: "heart-pulse-fill"
      },
      {
        title: "Compromisso com as Próximas Gerações",
        text: "Com milhares de crianças e adolescentes nos condomínios da região, nossa missão prioritária é oferecer ensino bíblico fiel, discipulado prático, apoio aos pais e formação ética cristã fundamentada nas Escrituras Sagradas.",
        icon: "mortarboard-fill"
      },
      {
        title: "Preservação do Cerrado e Sustentabilidade",
        text: "Com 24.368 m², o terreno possibilita um projeto de baixo impacto ambiental, com ampla preservação da vegetação nativa do Cerrado, drenagem sustentável e harmonia com a paisagem natural de Brasília.",
        icon: "tree-fill"
      }
    ]
  },

  masterplan: {
    title: "O Que Teremos no Complexo",
    subtitle: "Um projeto arquitetônico multifuncional desenhado para servir a comunidade e glorificar a Deus",
    items: [
      {
        title: "Templo Principal (Nave de Adoração)",
        description:
          "Auditório acolhedor com excelente acústica, visibilidade e conforto para cultos congregacionais, celebrações de batismo e conferências bíblicas.",
        icon: "building"
      },
      {
        title: "Pavilhão do Ministério Infantil e EBD",
        description:
          "Salas equipadas por faixas etárias, berçário seguro com visores, salas temáticas e banheiros acessíveis para acolher crianças e famílias com excelência.",
        icon: "puzzle"
      },
      {
        title: "Espaço de Convivência & Cafeteria",
        description:
          "Pátio arborizado e área social para comunhão pós-cultos, recepção de visitantes, pequenos grupos e integração entre membros.",
        icon: "cup-hot"
      },
      {
        title: "Auditório Multiuso e Juventude",
        description:
          "Ambiente versátil para reuniões dos jovens e adolescentes, palestras familiares, casamentos e capacitações de liderança.",
        icon: "people"
      },
      {
        title: "Estacionamento Amplo e Seguro",
        description:
          "Vagas planejadas para centenas de automóveis e motocicletas, essencial para o perfil de condomínios da região onde o acesso é predominantemente veicular.",
        icon: "car-front"
      },
      {
        title: "Parque Verde e Trilha Nativa",
        description:
          "Manutenção de reserva verde com ipês e flora nativa do Cerrado, proporcionando momentos de oração ao ar livre e retiros contemplativos.",
        icon: "flower1"
      }
    ]
  },

  phases: [
    {
      id: "phase-1",
      number: 1,
      title: "Aquisição e Quitação do Terreno",
      subtitle: "Gleba 01 - Fazenda Taboquinha",
      status: "in_progress",
      statusLabel: "Em Andamento (Terreno Sendo Pago)",
      description:
        "O terreno de 24.368,29 m² foi contratado e está em fase ativa de quitação parcelada pela ICE Jardins. Mantemos nossos compromissos rigorosamente em dia através da generosidade dos membros e apoiadores.",
      highlights: [
        "Terreno com levantamento planialtimétrico cadastral oficializado",
        "Área de 2,44 hectares com perímetro de 675 metros",
        "Pagamento regular das parcelas com prestação de contas transparente"
      ]
    },
    {
      id: "phase-2",
      number: 2,
      title: "Estudos Preliminares & Licenciamento",
      subtitle: "Topografia, Sondagem e Meio Ambiente",
      status: "in_progress",
      statusLabel: "Em Andamento",
      description:
        "Elaboração dos estudos técnicos de sondagem de solo, levantamento altimétrico de precisão, diretrizes urbanísticas e estudos de conformidade ambiental junto aos órgãos competentes do Distrito Federal.",
      highlights: [
        "Estudo de permeabilidade e drenagem do solo",
        "Compatibilização com o plano viário da região (DF-140)",
        "Adequação às diretrizes da SEDUH-GDF e órgãos ambientais"
      ]
    },
    {
      id: "phase-3",
      number: 3,
      title: "Projeto Arquitetônico & Engenharia",
      subtitle: "Masterplan, Nave e Módulos Educacionais",
      status: "upcoming",
      statusLabel: "Próxima Etapa",
      description:
        "Desenvolvimento do projeto executivo de arquitetura, cálculos estruturais, instalações elétricas, hidráulicas, conforto acústico, climatização natural e acessibilidade universal.",
      highlights: [
        "Design integrado ao relevo e vegetação do Cerrado",
        "Projeto modular permitindo inauguração em etapas funcionais",
        "Acessibilidade completa (norma NBR 9050)"
      ]
    },
    {
      id: "phase-4",
      number: 4,
      title: "Infraestrutura Básica & Terraplanagem",
      subtitle: "Acessos, Cercamento e Drenagem",
      status: "upcoming",
      statusLabel: "Fase Futura",
      description:
        "Execução dos serviços de terraplanagem sustentável, muros e cercamento perimetral, guarita de acesso, redes de abastecimento e vias internas pavimentadas com piso intertravado permeável.",
      highlights: [
        "Acesso pavimentado conectado à malha viária local",
        "Contenções e taludes ecológicos",
        "Poço artesiano e energia limpa"
      ]
    },
    {
      id: "phase-5",
      number: 5,
      title: "Construção da Nave & Salas de Apoio",
      subtitle: "Edificação e Cobertura",
      status: "upcoming",
      statusLabel: "Fase Futura",
      description:
        "Levantamento da estrutura principal, alvenarias, telhado com isolamento termoacústico, banheiros, berçário e salas prioritárias para o Ministério Infantil e cultos de domingo.",
      highlights: [
        "Estrutura com vãos amplos e excelente visibilidade",
        "Sistemas eficientes de energia solar e ventilação",
        "Salas modulares de apoio comunitário"
      ]
    },
    {
      id: "phase-6",
      number: 6,
      title: "Acabamentos, Mobiliário e Inauguração",
      subtitle: "Dedicação e Consagração ao Senhor",
      status: "upcoming",
      statusLabel: "Fase Futura",
      description:
        "Instalação dos equipamentos multimídia, som profissional, climatização, iluminação cênica, mobiliário do auditório e salas, paisagismo e solene culto de consagração a Deus.",
      highlights: [
        "Sistema de áudio e transmissão ao vivo de alta qualidade",
        "Ambientes acolhedores prontos para as famílias",
        "Início das atividades regulares em sede própria"
      ]
    }
  ] as ProjectPhase[],

  googleEarthGuide: {
    title: "Como Visualizar o Terreno no Google Earth",
    description:
      "Você pode explorar a topografia, relevo tridimensional e localização exata da Gleba 01 da ICE Jardins no Google Earth.",
    webTip:
      "Clique no botão 'Abrir Projeto no Google Earth (3D)' para carregar instantaneamente o projeto oficial publicado com o polígono demarcado e relevo tridimensional de Brasília diretamente no seu navegador.",
    desktopSteps: [
      "Clique em 'Abrir Projeto no Google Earth' para carregar o mapa tridimensional interativo diretamente no navegador em seu computador ou celular, sem precisar importar arquivos.",
      "Se desejar trabalhar offline ou no Google Earth Pro (desktop), clique em 'Baixar Arquivo KML' para salvar o arquivo oficial 'terreno-ice-jardins-fazenda-taboquinha.kml'.",
      "No Google Earth instalado, abra o arquivo KML baixado para visualizar o polígono vermelho cadastral, os 22 marcos georreferenciados e a área total de 24.368,29 m²."
    ]
  },

  givingCta: {
    title: "Participe da Construção do Templo",
    subtitle: "Sua oração e sua contribuição financeira direta ajudam a pagar o terreno e preparar o solo para as próximas gerações.",
    pixKey: "35.896.960/0001-66",
    pixRaw: "35896960000166",
    bank: "001 - Banco do Brasil S.A.",
    agency: "3596-3",
    account: "22901-6",
    recipient: "IGREJA CRISTA EVANGELICA JARDINS - ICE JARDINS",
    whatsappUrl: "https://wa.me/5561982624952?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Projeto%20de%20Constru%C3%A7%C3%A3o%20do%20Templo%20da%20ICE%20Jardins",
    internationalUrl: "https://reliant.org/acts29br.jardins"
  }
};
