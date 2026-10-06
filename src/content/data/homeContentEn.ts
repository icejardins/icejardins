import type { HomeIdentityItem } from "./homeContent";

export const homeContentEn = {
  hero: {
    title: "ICE Jardins Evangelical Christian Church",
    subtitle: "Imperfect people sharing the perfection of Christ\nSundays at 9:30 AM • Jardim Botânico, Brasília - Brazil",
    ctaLabel: "Get to Know Us",
    ctaTarget: "#about"
  },
  about: {
    title: "Who We Are",
    lead: "We are a Christian church community in Brasília where imperfect people experience and share the undeserved love of Jesus Christ.",
    body: "The name Jardins (Gardens) is no coincidence. God created us in a garden and desires to cultivate in us the beauty He designed. Here, everyone is a seed that can blossom by God's grace.",
    highlight: "Everyone can be transformed by Jesus!"
  },
  identity: [
    {
      title: "Biblical",
      description:
        "All our faith and practice are grounded in the Holy Scriptures. The Bible is our final authority in all matters of faith and conduct.",
      iconClass: "bi bi-book"
    },
    {
      title: "Discipling",
      description:
        "We believe every believer is called to grow in faith and disciple others. We invest in transformative relationships that lead to spiritual maturity.",
      iconClass: "bi bi-people"
    },
    {
      title: "Evangelistic",
      description:
        "Driven by the Great Commission, every member is an ambassador for Christ, called to share the Good News with family, friends, and the community.",
      iconClass: "bi bi-globe-americas"
    }
  ] as HomeIdentityItem[],
  worship: {
    title: "Sunday Service Times",
    description: "Join us on Sundays in Jardim Botânico. There is a place prepared for you and your family.",
    items: [
      {
        title: "Worship Service",
        time: "Sundays at 9:30 AM",
        iconClass: "bi bi-clock"
      },
      {
        title: "Sunday School & Kids Ministry",
        time: "Sundays at 11:00 AM",
        iconClass: "bi bi-book"
      }
    ]
  },
  location: {
    title: "How to Find ICE Jardins (Jardim Botânico)",
    place: "Colégio In-Nova Auditorium",
    regionNote: "Welcoming families from Jardim Botânico, Jardins Mangueiral, Tororó, Altiplano Leste, São Bartolomeu, and Lago Sul.",
    mapUrl: "https://maps.app.goo.gl/ddMo7kUUDr6fHYyX9",
    mapLabel: "Open in Google Maps / Waze",
    details: [
      "(former COC Jardim Botânico)",
      "Condomínio Estância Jardim Botânico II",
      "SH Jardim Botânico",
      "Brasília — DF, 71686-301, Brazil"
    ],
    email: "secretaria@icejardins.org.br"
  },
  closing: {
    quote: "Don't walk alone. Let's journey together!",
    invitation: "We look forward to welcoming you."
  },
  images: {
    hero: "/images/sobre/identidade.webp",
    congregation: "/images/sobre/congregacao.webp",
    community: "/images/sobre/comunidade.webp"
  },
  buildingSpotlight: {
    badge: "Mission & Campus • Future Generations",
    title: "Temple & Campus Project — Fazenda Taboquinha",
    subtitle: "So that future generations may know Jesus Christ and find lasting hope",
    image: "/images/projetos/templo-ice-jardins-conceito.webp",
    image640: "/images/projetos/templo-ice-jardins-conceito-640.webp",
    image1040: "/images/projetos/templo-ice-jardins-conceito-1040.webp",
    statusText:
      "Our mission is to live and pass on the gospel to generations to come — nurturing children, youth, and families in a Christ-centered community. We have secured 6.02 acres (24,368 m²) in the Jardim Botânico / Tororó corridor for our permanent home, which is actively being paid off. Your giving directly supports retiring the land debt and preparing a permanent sanctuary for those yet to come.",
    bullets: [
      { label: "Acquired Land", value: "6.02 Acres (24,368 m²)" },
      { label: "Land Status", value: "Active Land Payments" },
      { label: "Outreach Basin", value: "240,000+ residents" },
      { label: "Campus Plan", value: "Sanctuary, Children's Wing & Fellowship" }
    ],
    detailsLink: "/en/give/temple-project/",
    detailsLabel: "Explore Temple Project & Regional Study",
    earthUrl: "https://earth.google.com/earth/d/1KC_qk9um_6lkK5n5C-WTyGA_GdvzuE8_?usp=sharing",
    earthLabel: "View in Google Earth (3D)"
  }
};
