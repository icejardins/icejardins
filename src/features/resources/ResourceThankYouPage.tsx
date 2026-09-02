import { Link, useParams } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import {
  getResourceBySlug,
  getAllResources,
  getSiteConfig
} from "@/content/repositories/contentRepository";
import styles from "./ResourceThankYouPage.module.css";

interface ResourceThankYouPageProps {
  defaultSlug?: string;
}

export default function ResourceThankYouPage({ defaultSlug }: ResourceThankYouPageProps) {
  const { slug } = useParams();
  const site = getSiteConfig();
  const allResources = getAllResources();

  const activeSlug = slug || defaultSlug || (allResources.length > 0 ? allResources[0].slug : "");
  const resource = getResourceBySlug(activeSlug) || (allResources.length > 0 ? allResources[0] : null);

  if (!resource) {
    return (
      <div className={styles.pageWrapper}>
        <header className={styles.topBar}>
          <div className="container">
            <div className={styles.topBarInner}>
              <Link
                to="/"
                className={styles.brandLink}
                aria-label="Página inicial da ICE Jardins"
              >
                <img
                  src="/images/logo-ice-jardins-01.webp"
                  alt="ICE Jardins"
                  className={styles.churchLogo}
                  width={120}
                  height={52}
                />
              </Link>
            </div>
          </div>
        </header>
        <main className="container py-5 text-center my-auto">
          <h1>Material não encontrado</h1>
          <p className="text-secondary mb-4">
            Não encontramos o material solicitado. Explore todos os recursos disponíveis:
          </p>
          <Link to="/recursos/" className={styles.btnPrimary}>
            Ver Recursos
          </Link>
        </main>
      </div>
    );
  }

  const canonicalPath = `/recursos/${resource.slug}/obrigado/`;
  const pageTitle = `Seu Material Está Pronto | ${resource.title} | ${site.title}`;
  const pageDescription = `Acesse e baixe o seu exemplar gratuito de "${resource.title}".`;

  return (
    <div className={styles.pageWrapper}>
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        noindex={true}
        preloadImage={resource.image || undefined}
      />

      {/* TOP BRAND BAR */}
      <header className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            <Link
              to="/"
              className={styles.brandLink}
              title="Voltar para a página inicial da ICE Jardins"
              aria-label="Página inicial da ICE Jardins"
            >
              <img
                src="/images/logo-ice-jardins-01.webp"
                alt="ICE Jardins"
                className={styles.churchLogo}
                width={120}
                height={52}
              />
            </Link>

            <span className={styles.topBarBadge}>
              <Icon name="check-circle-fill" />
              Download Liberado
            </span>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* HERO / DOWNLOAD SECTION */}
        <section className={styles.heroSection}>
          <div className="container">
            <div className={styles.successPill}>
              <Icon name="check-lg" />
              Solicitação Confirmada
            </div>

            <h1 className={styles.heroTitle}>Seu material está pronto!</h1>
            <p className={styles.heroSubtitle}>
              Ficamos muito felizes pelo seu contato. Clique no botão abaixo para baixar o arquivo
              de <strong>"{resource.title}"</strong> no seu celular, tablet ou computador.
            </p>

            {resource.pdfUrl ? (
              <div className={styles.mainDownloadBox}>
                <a
                  href={resource.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadButton}
                  download={`${resource.slug}-ice-jardins.pdf`}
                >
                  <Icon name="file-earmark-arrow-down-fill" />
                  Baixar {resource.format || "o Material em PDF"}
                </a>
                <p className={styles.downloadMeta}>
                  Formato: {resource.format || "Digital (PDF)"} · Acesso Imediato · 100% Gratuito
                </p>
              </div>
            ) : null}
          </div>
        </section>

        {/* NEXT STEPS & RESOURCE OVERVIEW */}
        <section className={styles.contentSection}>
          <div className="container">
            <div className="row g-4 align-items-center">
              {resource.image ? (
                <div className="col-lg-5">
                  <div className={styles.coverCard}>
                    <img
                      src={resource.image}
                      alt={`Capa de ${resource.title}`}
                      width={320}
                      height={240}
                      className={styles.coverImage}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                </div>
              ) : null}

              <div className={resource.image ? "col-lg-7" : "col-lg-12"}>
                <div className={styles.stepsCard}>
                  <h2>Como aproveitar melhor este material:</h2>
                  <ul className={styles.stepList}>
                    <li className={styles.stepItem}>
                      <div className={styles.stepNumber}>1</div>
                      <div className={styles.stepText}>
                        <h3>Salve o arquivo no seu leitor favorito</h3>
                        <p>
                          Baixe o arquivo e mantenha em um local de fácil acesso no seu smartphone
                          ou leitor de documentos.
                        </p>
                      </div>
                    </li>

                    <li className={styles.stepItem}>
                      <div className={styles.stepNumber}>2</div>
                      <div className={styles.stepText}>
                        <h3>Reserve um tempo para a leitura e reflexão</h3>
                        <p>
                          Leia com calma no seu ritmo, refletindo nos princípios bíblicos e
                          aplicando as orientações no seu dia a dia.
                        </p>
                      </div>
                    </li>

                    <li className={styles.stepItem}>
                      <div className={styles.stepNumber}>3</div>
                      <div className={styles.stepText}>
                        <h3>Compartilhe com quem você ama</h3>
                        <p>
                          Este material é 100% livre e gratuito. Sinta-se à vontade para enviar o
                          link para amigos, familiares e pessoas próximas.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHURCH INVITATION */}
        <section className={styles.invitationSection}>
          <div className="container">
            <div className={styles.invitationCard}>
              <h2>Venha nos fazer uma visita!</h2>
              <p>
                Nossa comunidade no Jardim Botânico está de portas abertas para receber você e sua
                família. Venha participar de um momento de comunhão, ensino bíblico e adoração.
              </p>

              <div className={styles.scheduleGrid}>
                <div className={styles.scheduleItem}>
                  <Icon name="clock-fill" className="me-2 text-primary" />
                  Domingo · 09:30 — Louvor e Culto Inspirativo
                </div>
                <div className={styles.scheduleItem}>
                  <Icon name="clock-fill" className="me-2 text-primary" />
                  Domingo · 11:00 — Escola Bíblica Dominical (EBD)
                </div>
              </div>

              <div className={styles.actionButtons}>
                <Link to="/visita/" className={styles.btnPrimary}>
                  <Icon name="compass" />
                  Planejar minha visita
                </Link>
                <a
                  href={site.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.btnWhatsapp}
                >
                  <Icon name="whatsapp" />
                  Falar com a Secretaria no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className="container">
          <p className="mb-1">
            © {new Date().getFullYear()} ICE Jardins — Igreja Cristã Evangélica Jardins.
          </p>
          <p className="mb-0">
            <Link to="/">Início</Link> · <Link to="/recursos/">Recursos</Link> ·{" "}
            <Link to="/visita/">Visita</Link> · <Link to="/fe/">No que cremos</Link> ·{" "}
            <Link to="/posts/">Sermões</Link> · <Link to="/privacy/">Privacidade</Link>
          </p>

          <p className={styles.footerUnsubscribe}>
            Você recebeu nosso contato porque solicitou este material em nosso site. Se não deseja
            mais receber nossos e-mails,{" "}
            <Link to="/descadastro/">clique aqui para cancelar</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}
