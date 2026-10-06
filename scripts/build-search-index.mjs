import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const generatedDir = path.join(rootDir, "src", "content", "generated");
const staticDir = path.join(rootDir, "static");

function stripHtml(input) {
  return String(input ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

import { CATEGORY_TRANSLATIONS, TAG_TRANSLATIONS } from "../src/features/blog/utils/taxonomyTranslations.ts";

function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const [pagesRaw, postsRaw, resourcesRaw] = await Promise.all([
    fs.readFile(path.join(generatedDir, "pages.json"), "utf8"),
    fs.readFile(path.join(generatedDir, "posts.json"), "utf8"),
    fs.readFile(path.join(generatedDir, "resources.json"), "utf8").catch(() => "[]")
  ]);

  const pages = JSON.parse(pagesRaw.replace(/^\uFEFF/, ""));
  const posts = JSON.parse(postsRaw.replace(/^\uFEFF/, ""));
  const resources = JSON.parse(resourcesRaw.replace(/^\uFEFF/, ""));

  const institutionalDocs = [
    {
      title: "Igreja Cristã Evangélica Jardins | Brasília - DF",
      description: "Comunidade cristã reformada e acolhedora no Jardim Botânico, Brasília - DF. Cultos aos domingos às 9h30.",
      content: "Igreja Cristã Evangélica Jardins ICE Jardins Jardim Botânico Brasília DF cultos aos domingos 9h30 comunhão pregação expositiva discipulado ministério infantil.",
      image: null,
      permalink: "/"
    },
    {
      title: "ICE Jardins Church | Evangelical Christian Church in Brasília",
      description: "English-friendly evangelical Christian church in Jardim Botânico, Brasília - DF. Sunday worship at 9:30 AM. Bible-centered community welcoming expats, diplomats, and visitors.",
      content: "ICE Jardins Church evangelical reformed Christian church Jardim Botânico Brasília DF Brazil Sunday worship 9:30 AM expats diplomats international visitors biblical expository preaching communion fellowship gospel faith.",
      image: null,
      permalink: "/en/"
    },
    {
      title: "Iglesia ICE Jardins | Iglesia Cristiana Evangélica en Brasília",
      description: "Comunidad cristiana evangélica y reformada en Jardim Botânico, Brasília - DF. Culto dominical a las 9:30 AM. Mensajes expositivos y calurosa bienvenida a hispanohablantes y familias.",
      content: "Iglesia Cristiana Evangélica Jardins ICE Jardins Jardim Botânico Brasília DF Brasil culto dominical 9:30 AM predicación expositiva doctrina bíblica bienvenida hispanohablantes comunión fe en Jesucristo salvación.",
      image: null,
      permalink: "/es/"
    },
    {
      title: "Sermões e Mensagens Bíblicas | ICE Jardins",
      description: "Ouça e leia sermões expositivos e estudos bíblicos da Igreja Cristã Evangélica Jardins em Brasília - DF.",
      content: "Sermões estudos bíblicos pregações mensagens expositivas Novo Testamento Antigo Testamento Evangelho Jesus Cristo ICE Jardins.",
      image: null,
      permalink: "/posts/"
    },
    {
      title: "Sermons & Biblical Messages | ICE Jardins Church",
      description: "Listen to and read expository sermons and biblical teachings from ICE Jardins Church in Brasília, Brazil.",
      content: "Sermons biblical messages expository preaching New Testament Old Testament Gospel Jesus Christ ICE Jardins Brasília Brazil teachings study.",
      image: null,
      permalink: "/en/sermons/"
    },
    {
      title: "Sermones y Mensajes Bíblicos | Iglesia ICE Jardins",
      description: "Escuche y lea sermones expositivos y mensajes bíblicos de la Iglesia ICE Jardins en Brasília, Brasil.",
      content: "Sermones estudios bíblicos predicaciones mensajes expositivos Nuevo Testamento Antiguo Testamento Evangelio Jesucristo Iglesia ICE Jardins Brasília Brasil fe doctrina.",
      image: null,
      permalink: "/es/sermones/"
    },
    {
      title: "Giving & Donations | ICE Jardins Church",
      description: "Support the ministries and church campus project of ICE Jardins Church. US tax-deductible giving via Reliant Mission, international wire, or PIX.",
      content: "Giving donations tithes offerings ICE Jardins Church Brasília Brazil support Reliant Mission Acts 29 US tax-deductible wire transfer PIX bank.",
      image: null,
      permalink: "/en/give/"
    },
    {
      title: "Donaciones y Ofrendas | Iglesia ICE Jardins",
      description: "Apoye los ministerios y el proyecto del templo de la Iglesia ICE Jardins en Brasília. Donaciones vía PIX, transferencia bancaria y Reliant.",
      content: "Donar donaciones ofrendas diezmos contribuciones Iglesia Cristiana Evangélica Jardins ICE Jardins Brasília Brasil soporte misionero Reliant PIX banco.",
      image: null,
      permalink: "/es/donar/"
    },
    {
      title: "Plan Your Visit | ICE Jardins Church in Brasília",
      description: "Visit ICE Jardins Church in Jardim Botânico, Brasília - DF. Sunday worship at 9:30 AM and Sunday School at 11:00 AM. Welcoming community for expats, diplomats, visitors, and families.",
      content: "Plan your visit to ICE Jardins Church Jardim Botânico Brasília DF Brazil Sunday worship service 9:30 AM Sunday School 11:00 AM children ministry kids auditorium Colégio In-Nova fellowship coffee welcome address location.",
      image: null,
      permalink: "/en/visit/"
    },
    {
      title: "Planifique su Visita | Iglesia ICE Jardins en Brasília",
      description: "Visite la Iglesia Cristiana Evangélica Jardins en Jardim Botânico, Brasília - DF. Culto dominical a las 9:30 AM y Escuela Dominical a las 11:00 AM. Una comunidad acogedora para toda la familia.",
      content: "Planifique su visita Iglesia Cristiana Evangélica Jardins Jardim Botânico Brasília DF Brasil culto dominical 9:30 AM Escuela Dominical 11:00 AM ministerio infantil niños auditorio Colégio In-Nova comunión café bienvenida dirección.",
      image: null,
      permalink: "/es/visita/"
    },
    {
      title: "Projeto do Templo: Sede Definitiva | ICE Jardins",
      description: "Conheça o projeto do templo sede da ICE Jardins na Fazenda Taboquinha (Gleba 01), Jardim Botânico - DF. Dados habitacionais, terreno sendo pago, mapa 3D no Google Earth e como contribuir.",
      content: "Construção do novo templo sede da Igreja Cristã Evangélica Jardins na Fazenda Taboquinha Gleba 01 Jardim Botânico DF. Terreno de 24.368 m2 adquirido e sendo pago parcelado. Dados habitacionais, população do Jardim Botânico, Tororó, Mangueiral e São Sebastião. Visualização no Google Earth em 3D, download do arquivo KML, fases da obra, templo, ministério infantil, estacionamento e contribuição via PIX.",
      image: "/images/projetos/templo-ice-jardins-conceito.webp",
      permalink: "/contribuir/projeto-templo/"
    },
    {
      title: "Temple Project: Future Church Campus | ICE Jardins Church",
      description: "Learn about the future church campus and temple project of ICE Jardins Church at Fazenda Taboquinha (Gleba 01), Jardim Botânico, Brasília. Housing data, outreach potential, 3D Google Earth tour, land status (currently being paid off), and giving options.",
      content: "Building the permanent church campus of ICE Jardins Church at Fazenda Taboquinha Gleba 01 Jardim Botânico Brasília DF Brazil. 6-acre land acquired and currently being paid off. Demographic data for Jardim Botânico, Tororó, Mangueiral, and São Sebastião. Google Earth 3D tour, KML file download, project phases, sanctuary, children's ministry, parking, and tax-deductible US giving via Reliant Mission Acts 29.",
      image: "/images/projetos/templo-ice-jardins-conceito.webp",
      permalink: "/en/give/temple-project/"
    },
    {
      title: "Proyecto del Templo: Sede Definitiva | ICE Jardins",
      description: "Conozca el proyecto del templo sede de ICE Jardins en Fazenda Taboquinha (Gleba 01), Jardim Botânico - DF. Datos habitacionales, terreno en pago, mapa 3D en Google Earth y cómo donar.",
      content: "Construcción del nuevo templo sede de la Iglesia Cristiana Evangélica Jardins en Fazenda Taboquinha Gleba 01 Jardim Botânico DF. Terreno de 24.368 m2 adquirido y en proceso de pago. Datos demográficos de Jardim Botânico, Tororó, Mangueiral y São Sebastião. Recorrido 3D en Google Earth, descarga de archivo KML, fases del proyecto, templo, ministerio infantil, estacionamiento y donación vía PIX y Reliant.",
      image: "/images/projetos/templo-ice-jardins-conceito.webp",
      permalink: "/es/donar/proyecto-templo/"
    }
  ];

  const docs = [
    ...institutionalDocs,
    ...pages.map((page) => ({
      title: page.title,
      description: page.description,
      content: stripHtml(page.bodyHtml),
      image: null,
      permalink: page.route
    })),
    ...posts.map((post) => {
      const localizedKeywords = [];
      for (const cat of post.categories || []) {
        const slug = slugify(cat);
        const trans = CATEGORY_TRANSLATIONS[slug];
        if (trans) {
          localizedKeywords.push(trans.en, trans.es);
        }
      }
      for (const tag of post.tags || []) {
        const slug = slugify(tag);
        const trans = TAG_TRANSLATIONS[slug];
        if (trans) {
          localizedKeywords.push(trans.en, trans.es);
        }
      }

      const extraText = [
        ...(post.categories || []),
        ...(post.tags || []),
        ...localizedKeywords
      ].join(" ");

      return {
        title: post.title,
        description: post.description,
        content: `${stripHtml(post.bodyHtml)} ${extraText}`,
        image: post.image,
        permalink: post.route
      };
    }),
    ...resources.map((resource) => ({
      title: resource.title,
      description: resource.description,
      content: stripHtml(resource.bodyHtml),
      image: resource.image,
      permalink: resource.route
    }))
  ];

  await fs.mkdir(staticDir, { recursive: true });
  await fs.writeFile(
    path.join(staticDir, "search-index.json"),
    `${JSON.stringify(docs, null, 2)}\n`,
    "utf8"
  );

  console.log(`Generated search index with ${docs.length} records.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
