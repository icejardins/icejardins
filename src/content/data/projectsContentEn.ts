import type { DemographicMetric, NeighborhoodReach, ProjectPhase } from "./projectsContent";

export const projectsContentEn = {
  hero: {
    badge: "ICE Jardins Projects",
    title: "Building Our Future Church Temple",
    subtitle: "A sacred space dedicated to God, built for generations to come in Jardim Botânico and Tororó.",
    verse: "“Then I said to them: Let us start rebuilding. And they strengthened their hands for the good work.”",
    reference: "Nehemiah 2:18",
    image: "/images/projetos/templo-ice-jardins-conceito.webp"
  },

  terrainStatus: {
    badge: "Current Property Status",
    headline: "Land Acquired and Currently Being Paid Off",
    callout:
      "ICE Jardins has already purchased the property for its future permanent home at Fazenda Taboquinha (Gleba 01). The land is still being paid for, and our church faithfully fulfills each scheduled installment through God's provision and the sustained commitment of our faith community.",
    details: [
      "The purchase of Gleba 01 marks a historic milestone for the proclamation of the Gospel in the Federal District.",
      "We are steadily amortizing the contractual payments with strict budget discipline and financial transparency.",
      "Every contribution directly supports paying off the land where our children, grandchildren, and new families will worship God."
    ]
  },

  terrainSpecs: {
    title: "Property Specifications",
    subtitle: "Official cadastral and topographical survey data",
    property: "Fazenda Taboquinha — Gleba 01",
    municipality: "RA XXVII Jardim Botânico / Tororó — Brasília, DF, Brazil",
    cep: "71686-206",
    areaM2: "24,368.29 m²",
    areaHectares: "2.44 hectares (~6.02 acres)",
    perimeter: "675.37 linear meters (2,215 ft)",
    datum: "SIRGAS 2000 / UTM Zone 23S",
    coordinates: "15°51'57\" S | 47°47'02\" W (-15.8658°, -47.7840°)",
    verticesCount: 22,
    kmlDownloadUrl: "/downloads/terreno-ice-jardins-fazenda-taboquinha.kml",
    googleEarthWebUrl: "https://earth.google.com/earth/d/1KC_qk9um_6lkK5n5C-WTyGA_GdvzuE8_?usp=sharing",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=-15.86583,-47.78385"
  },

  demographics: {
    title: "Housing Diagnostic & Regional Outreach Potential",
    subtitle: "Why build in Jardim Botânico and the expanding DF-140 / Tororó corridor?",
    intro:
      "The Administrative Region of Jardim Botânico (RA XXVII) and its surrounding areas are undergoing one of the fastest urban and population expansions in Brasília. Acquiring a 6-acre (24,000 m²) property in this prime strategic corridor addresses a demographic basin of hundreds of thousands of residents seeking genuine spiritual roots, family support, and a biblically faithful church community.",
    metrics: [
      {
        value: "77,767+",
        label: "Jardim Botânico Population",
        detail: "Registered residents in RA XXVII growing at approximately 4% annually.",
        source: "IBGE 2022 Census & PDAD-A 2024 (IPEDF)",
        icon: "people-fill"
      },
      {
        value: "92k to 117k",
        label: "Tororó / DF-140 Expansion",
        detail: "Government projection for the new Tororó Urban Center and master-planned neighborhoods.",
        source: "SEDUH-GDF Urban Planning",
        icon: "building"
      },
      {
        value: "240,000+",
        label: "Direct Outreach Basin",
        detail: "Population within a 15-minute drive (Jardim Botânico, Tororó, São Sebastião, and Mangueiral).",
        source: "IPEDF / IBGE Consolidated Data",
        icon: "geo-alt-fill"
      },
      {
        value: "80%+",
        label: "Gated Communities",
        detail: "Predominance of families with young children and teens, with high demand for community life.",
        source: "PDAD Jardim Botânico",
        icon: "houses-fill"
      }
    ] as DemographicMetric[],

    reachNeighborhoods: [
      {
        name: "Jardim Botânico & Tororó (DF-140)",
        population: "~80,000 residents (rapidly expanding)",
        distanceTime: "0 to 7 minutes",
        profile: "Horizontal gated communities, high family income, young couples with small children and teenagers."
      },
      {
        name: "Jardins Mangueiral",
        population: "~30,000 residents",
        distanceTime: "8 to 12 minutes",
        profile: "Master-planned residential community, high density of young married couples, school-age children, and young professionals."
      },
      {
        name: "São Sebastião",
        population: "~115,000 residents",
        distanceTime: "10 to 15 minutes",
        profile: "Established urban district with thriving local commerce, hardworking families, and strong need for outreach and social initiatives."
      },
      {
        name: "Altiplano Leste & Barreiro",
        population: "~15,000 residents",
        distanceTime: "12 to 18 minutes",
        profile: "Eco-residential estates and suburban acreages transitioning toward integrated Brasília suburban living."
      }
    ] as NeighborhoodReach[],

    strategicInsights: [
      {
        title: "Shortage of Public Community Spaces",
        text: "Official diagnostics by IPEDF highlight a severe lack of public civic spaces, plazas, and community gathering centers in the area. The ICE Jardins complex will serve as a welcoming haven of hope, fellowship, and care for local families.",
        icon: "heart-pulse-fill"
      },
      {
        title: "Discipling the Next Generation",
        text: "With tens of thousands of children and teens living in surrounding gated communities, our primary calling is faithful biblical teaching, youth mentorship, parenting support, and gospel-centered character formation.",
        icon: "mortarboard-fill"
      },
      {
        title: "Cerrado Preservation & Stewardship",
        text: "At 2.44 hectares (6 acres), the land accommodates low-impact sustainable architecture, preserving native Cerrado savanna trees (golden ipês, buriti palms), natural drainage, and the scenic beauty of Brasília.",
        icon: "tree-fill"
      }
    ]
  },

  masterplan: {
    title: "Masterplan: What the Complex Will Feature",
    subtitle: "A multipurpose architectural design created to serve the community and glorify God",
    items: [
      {
        title: "Main Sanctuary (Worship Hall)",
        description:
          "Warm, welcoming auditorium with excellent acoustics, natural lighting, and climate comfort for Sunday worship, baptismal services, and Bible conferences.",
        icon: "building"
      },
      {
        title: "Children's Ministry & Sunday School Wing",
        description:
          "Age-graded classrooms, secure nursery with viewing windows, thematic preschool rooms, and accessible restrooms designed to serve families with excellence.",
        icon: "puzzle"
      },
      {
        title: "Fellowship Courtyard & Cafe",
        description:
          "Landscaped garden patio and hospitality space for post-service fellowship, welcoming newcomers, small groups, and community connection.",
        icon: "cup-hot"
      },
      {
        title: "Youth & Multipurpose Auditorium",
        description:
          "Dynamic venue for youth and student gatherings, family seminars, weddings, and leadership training programs.",
        icon: "people"
      },
      {
        title: "Spacious & Secure On-Site Parking",
        description:
          "Planned parking for hundreds of vehicles and motorcycles, essential for the residential gated community profile where vehicle transport is primary.",
        icon: "car-front"
      },
      {
        title: "Cerrado Ecological Park & Prayer Trail",
        description:
          "Dedicated green preserve featuring native flora and trees, offering peaceful outdoor prayer paths and family retreat settings.",
        icon: "flower1"
      }
    ]
  },

  phases: [
    {
      id: "phase-1",
      number: 1,
      title: "Land Acquisition & Payment",
      subtitle: "Gleba 01 — Fazenda Taboquinha",
      status: "in_progress",
      statusLabel: "In Progress (Land Being Paid Off)",
      description:
        "The 24,368.29 m² (6-acre) property has been acquired under a contract and is currently being paid off by ICE Jardins. We maintain our financial commitments on schedule through the generosity of church members and ministry partners.",
      highlights: [
        "Officially surveyed planialtimetric boundary coordinates registered",
        "2.44 hectares with a 675-meter perimeter",
        "Regular installment amortization with transparent reporting"
      ]
    },
    {
      id: "phase-2",
      number: 2,
      title: "Preliminary Studies & Permitting",
      subtitle: "Topography, Soil Testing & Environmental Compliance",
      status: "in_progress",
      statusLabel: "In Progress",
      description:
        "Execution of high-precision elevation surveys, soil percolation and load testing, and environmental compliance documentation in alignment with SEDUH-GDF and local environmental authorities.",
      highlights: [
        "Soil drainage and permeability engineering studies",
        "Integration with the DF-140 regional highway corridor masterplan",
        "Urban planning alignment with Federal District regulations"
      ]
    },
    {
      id: "phase-3",
      number: 3,
      title: "Architectural & Engineering Design",
      subtitle: "Masterplan, Sanctuary & Education Buildings",
      status: "upcoming",
      statusLabel: "Upcoming Phase",
      description:
        "Developing complete blueprints, structural engineering, electrical, plumbing, acoustic design, sustainable natural ventilation, and universal accessibility (NBR 9050 standards).",
      highlights: [
        "Design harmonized with local topography and Cerrado vegetation",
        "Modular building layout enabling phased operational openings",
        "Full barrier-free accessibility"
      ]
    },
    {
      id: "phase-4",
      number: 4,
      title: "Basic Infrastructure & Earthworks",
      subtitle: "Access Roads, Perimeter Fencing & Drainage",
      status: "upcoming",
      statusLabel: "Future Phase",
      description:
        "Grading and sustainable earthworks, perimeter security fencing, entrance gates, utility connections, stormwater management, and permeable paved internal roadways.",
      highlights: [
        "Paved access connected to the municipal road network",
        "Eco-friendly embankments and water retention basins",
        "Artesian well water supply and clean solar energy readiness"
      ]
    },
    {
      id: "phase-5",
      number: 5,
      title: "Sanctuary & Support Building Construction",
      subtitle: "Structural Framework, Roof & Core Classrooms",
      status: "upcoming",
      statusLabel: "Future Phase",
      description:
        "Erecting the main building structure, masonry, high-performance thermal and acoustic roofing, restrooms, nursery, and priority Sunday School spaces.",
      highlights: [
        "Spacious open-span sanctuary with clear sightlines",
        "Energy-efficient natural lighting and ventilation systems",
        "Functional multipurpose rooms ready for immediate ministry use"
      ]
    },
    {
      id: "phase-6",
      number: 6,
      title: "Finishes, Furnishings & Church Dedication",
      subtitle: "Consecration & Inauguration Service",
      status: "upcoming",
      statusLabel: "Future Phase",
      description:
        "Audio-visual equipment installation, acoustic treatment, stage lighting, auditorium seating, native Cerrado landscaping, and a celebration service dedicating the property to the Lord.",
      highlights: [
        "Professional broadcast-ready sound and media setup",
        "Warm, inviting spaces fully prepared for worshiping families",
        "Launch of all regular ministries at the church's permanent home"
      ]
    }
  ] as ProjectPhase[],

  googleEarthGuide: {
    title: "How to View the Property in Google Earth",
    description:
      "Explore the 3D topography, elevation, and boundary perimeter of ICE Jardins Gleba 01 in Google Earth.",
    webTip:
      "Click 'Open Project in Google Earth (3D)' to instantly launch the church's official published project with the demarcated boundary and 3D terrain right in your browser.",
    desktopSteps: [
      "Click 'Open in Google Earth' to load the interactive 3D project directly in your browser with no software installation or manual file imports required.",
      "If you prefer using Google Earth Pro on desktop or viewing offline, use 'Download KML File' to save the official 'terreno-ice-jardins-fazenda-taboquinha.kml' file.",
      "In the desktop application, open the downloaded KML file to view the complete 24,368 m² polygon, 22 georeferenced boundary vertices, and perimeter measurements."
    ]
  },

  givingCta: {
    title: "Partner with Us in Building the Temple",
    subtitle:
      "Your prayers and financial partnership help pay off the land and prepare this sacred ground for generations to come.",
    usaTaxDeductible: "501(c)(3) Tax-Deductible for US Donors",
    usaDescription:
      "If you are in the United States or prefer giving in US Dollars, your contribution can be made securely through Reliant Mission in partnership with Acts 29, receiving full tax-deductible benefits in the USA.",
    usaButtonLabel: "Give via Reliant (Acts 29)",
    usaUrl: "https://reliant.org/acts29br.jardins",
    pixKey: "35.896.960/0001-66",
    pixRaw: "35896960000166",
    bank: "001 - Banco do Brasil S.A.",
    agency: "3596-3",
    account: "22901-6",
    recipient: "IGREJA CRISTA EVANGELICA JARDINS - ICE JARDINS",
    whatsappUrl:
      "https://wa.me/5561982624952?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20the%20Building%20Project%20at%20ICE%20Jardins"
  }
};
