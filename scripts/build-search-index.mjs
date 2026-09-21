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

async function main() {
  const [pagesRaw, postsRaw, resourcesRaw] = await Promise.all([
    fs.readFile(path.join(generatedDir, "pages.json"), "utf8"),
    fs.readFile(path.join(generatedDir, "posts.json"), "utf8"),
    fs.readFile(path.join(generatedDir, "resources.json"), "utf8").catch(() => "[]")
  ]);

  const pages = JSON.parse(pagesRaw.replace(/^\uFEFF/, ""));
  const posts = JSON.parse(postsRaw.replace(/^\uFEFF/, ""));
  const resources = JSON.parse(resourcesRaw.replace(/^\uFEFF/, ""));

  const docs = [
    {
      title: "Construção do Futuro Templo | Projetos ICE Jardins",
      description: "Conheça o projeto de construção do novo templo da ICE Jardins na Fazenda Taboquinha (Gleba 01), Jardim Botânico - DF. Dados habitacionais, terreno sendo pago, mapa 3D no Google Earth e como contribuir.",
      content: "Construção do novo templo sede da Igreja Cristã Evangélica Jardins na Fazenda Taboquinha Gleba 01 Jardim Botânico DF. Terreno de 24.368 m2 adquirido e sendo pago parcelado. Dados habitacionais, população do Jardim Botânico, Tororó, Mangueiral e São Sebastião. Visualização no Google Earth em 3D, download do arquivo KML, fases da obra, templo, ministério infantil, estacionamento e contribuição via PIX.",
      image: "/images/projetos/templo-ice-jardins-conceito.webp",
      permalink: "/projetos/"
    },
    {
      title: "Future Church Campus & Temple Building Project | ICE Jardins Church",
      description: "Learn about the future church building project of ICE Jardins Church at Fazenda Taboquinha (Gleba 01), Jardim Botânico, Brasília. Housing data, outreach potential, 3D Google Earth tour, land status (currently being paid off), and giving options.",
      content: "Building the permanent church campus of ICE Jardins Church at Fazenda Taboquinha Gleba 01 Jardim Botânico Brasília DF Brazil. 6-acre land acquired and currently being paid off. Demographic data for Jardim Botânico, Tororó, Mangueiral, and São Sebastião. Google Earth 3D tour, KML file download, project phases, sanctuary, children's ministry, parking, and tax-deductible US giving via Reliant Mission Acts 29.",
      image: "/images/projetos/templo-ice-jardins-conceito.webp",
      permalink: "/en/projects/"
    },
    ...pages.map((page) => ({
      title: page.title,
      description: page.description,
      content: stripHtml(page.bodyHtml),
      image: null,
      permalink: page.route
    })),
    ...posts.map((post) => ({
      title: post.title,
      description: post.description,
      content: stripHtml(post.bodyHtml),
      image: post.image,
      permalink: post.route
    })),
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
