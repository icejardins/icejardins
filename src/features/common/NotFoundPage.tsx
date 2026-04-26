import { Link } from "react-router-dom";
import { SeoHead } from "@/shared/components/SeoHead";
import { getSiteConfig } from "@/content/repositories/contentRepository";

export default function NotFoundPage() {
  const site = getSiteConfig();

  return (
    <section className="container py-5">
      <SeoHead title={`Página não encontrada | ${site.title}`} />
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe ou foi movido.</p>
      <Link to="/">Voltar ao início</Link>
    </section>
  );
}
