import { useState, useRef, useEffect, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { getResourceBySlug, getSiteConfig } from "@/content/repositories/contentRepository";
import { trackAdsConversion } from "@/shared/utils/analytics";
import styles from "./ResourcePage.module.css";

export default function ResourcePage() {
  const { slug = "" } = useParams();
  const site = getSiteConfig();
  const resource = getResourceBySlug(slug);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot anti-spam
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formLoadedAtRef = useRef<number>(0);
  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  if (!resource) {
    return (
      <div className={styles.wrapper}>
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
              <Link to="/recursos/" className={styles.allResourcesLink}>
                <i className="bi bi-arrow-left" aria-hidden="true" />
                Ver todos os recursos
              </Link>
            </div>
          </div>
        </header>
        <main className="container py-5 text-center my-auto">
          <SeoHead title={`Recurso não encontrado | ${site.title}`} noindex />
          <h1 className="h2 fw-bold mb-3">Recurso não encontrado</h1>
          <p className="text-secondary mb-4">
            O material ou guia que você procurou não está disponível ou foi movido.
          </p>
          <Link to="/recursos/" className={styles.churchBtnOutline}>
            <i className="bi bi-collection-fill" aria-hidden="true" />
            Explorar outros recursos
          </Link>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("Por favor, informe seu nome.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Por favor, informe um e-mail válido.");
      return;
    }

    // Honeypot anti-spam check
    if (website.trim().length > 0) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          website: website.trim(),
          resourceSlug: resource.slug,
          resourceTitle: resource.title,
          resourceSubtitle: resource.subtitle,
          resourceDescription: resource.description,
          resourcePdfUrl: resource.pdfUrl,
          formLoadedAt: formLoadedAtRef.current || Date.now()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Não foi possível enviar os dados. Tente novamente."
        );
      }

      trackAdsConversion();
      setIsSuccess(true);
    } catch (err: any) {
      console.error("[ResourcePage] Submit error:", err);
      setErrorMessage(
        err.message || "Ocorreu um erro ao enviar seus dados. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setWebsite("");
    formLoadedAtRef.current = Date.now();
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const resourceStructuredData = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: resource.title,
    headline: resource.subtitle || resource.title,
    description: resource.description,
    url: `${site.baseUrl}${resource.route}`,
    image: resource.image ? `${site.baseUrl}${resource.image}` : undefined,
    encodingFormat: "application/pdf",
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock"
    },
    publisher: {
      "@type": "Church",
      name: "Igreja Cristã Evangélica Jardins",
      url: site.baseUrl
    }
  };

  return (
    <div className={styles.wrapper}>
      <SeoHead
        title={`${resource.title} — ${resource.badge || "Recurso Gratuito"} | ${site.title}`}
        description={resource.description}
        canonicalPath={resource.route}
        image={resource.image || undefined}
        jsonLd={resourceStructuredData}
        adsConversionSendTo={site.googleAdsConversionSendTo}
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

            <nav className={styles.topBarNav}>
              <Link to="/recursos/" className={styles.allResourcesLink}>
                <i className="bi bi-collection-fill" aria-hidden="true" />
                Todos os Recursos
              </Link>
              <span className={styles.topBarBadge}>
                <i className="bi bi-gift-fill" aria-hidden="true" />
                {resource.badge || "Recurso Gratuito"}
              </span>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* HERO SECTION */}
        <section className={styles.hero}>
          <div className="container">
            <div className="row align-items-center g-5">
              {/* Left Column: Copy */}
              <div className="col-lg-7">
                <div className={styles.heroContent}>
                  <div className={styles.categoryPill}>
                    <span className={styles.pulseDot} />
                    {resource.badge || "Material Especial Gratuito"}
                  </div>

                  <h1 className={styles.heroTitle}>{resource.title}</h1>
                  {resource.subtitle ? (
                    <p className={styles.heroSubtitle}>{resource.subtitle}</p>
                  ) : null}

                  <p className={styles.heroLead}>{resource.description}</p>

                  <div className={styles.trustBadges}>
                    <div className={styles.trustBadgeItem}>
                      <i className="bi bi-check-circle-fill" aria-hidden="true" />
                      <span>Acesso Imediato</span>
                    </div>
                    <div className={styles.trustBadgeItem}>
                      <i className="bi bi-check-circle-fill" aria-hidden="true" />
                      <span>100% Gratuito</span>
                    </div>
                    <div className={styles.trustBadgeItem}>
                      <i className="bi bi-check-circle-fill" aria-hidden="true" />
                      <span>Sem Spam</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Lead Form or Direct Action */}
              <div className="col-lg-5">
                <div className={styles.formCard}>
                  {isSuccess ? (
                    <div className={styles.successCard}>
                      <div className={styles.successIconWrap}>
                        <i className="bi bi-check-lg" aria-hidden="true" />
                      </div>
                      <h2 className={styles.successTitle}>Tudo pronto!</h2>
                      <p className={styles.successText}>
                        Seu exemplar de <strong>"{resource.title}"</strong> está liberado.
                        Clique no botão abaixo para baixar agora mesmo:
                      </p>

                      {resource.pdfUrl ? (
                        <a
                          href={resource.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.downloadCtaButton}
                          download={`${resource.slug}-ice-jardins.pdf`}
                        >
                          <i className="bi bi-file-earmark-arrow-down-fill" aria-hidden="true" />
                          Baixar o Material em PDF
                        </a>
                      ) : null}

                      <div>
                        <button
                          type="button"
                          onClick={handleResetForm}
                          className={styles.resetButton}
                        >
                          Preencher novamente ou cadastrar outro e-mail
                        </button>
                      </div>
                    </div>
                  ) : resource.actionType === "direct-download" && resource.pdfUrl ? (
                    <div className={styles.successCard}>
                      <h2 className={styles.formTitle}>Download Liberado</h2>
                      <p className={styles.formSubtitle}>
                        Acesse este material gratuitamente em PDF:
                      </p>
                      <a
                        href={resource.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.downloadCtaButton}
                      >
                        <i className="bi bi-file-earmark-arrow-down-fill" aria-hidden="true" />
                        Baixar Arquivo PDF
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Receba seu exemplar gratuito</h2>
                        <p className={styles.formSubtitle}>
                          Preencha seus dados para receber o guia e baixar agora mesmo.
                        </p>
                      </div>

                      {errorMessage && (
                        <div className={styles.errorAlert} role="alert">
                          <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true" />
                          {errorMessage}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className={styles.leadForm}>
                        <input
                          type="text"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className={styles.honeypotField}
                          aria-hidden="true"
                        />

                        <div className={styles.formGroup}>
                          <label htmlFor="lead-name" className={styles.label}>
                            Seu Nome completo *
                          </label>
                          <input
                            id="lead-name"
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Ex: João da Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="lead-email" className={styles.label}>
                            Seu melhor E-mail *
                          </label>
                          <input
                            id="lead-email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="lead-phone" className={styles.label}>
                            WhatsApp / Telefone <span className={styles.labelOptional}>(opcional)</span>
                          </label>
                          <input
                            id="lead-phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="(61) 99999-9999"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.input}
                            disabled={isSubmitting}
                          />
                        </div>

                        <button
                          type="submit"
                          className={styles.submitButton}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Enviando...
                            </>
                          ) : (
                            <>
                              Baixar o Guia Gratuito
                              <i className="bi bi-arrow-right" aria-hidden="true" />
                            </>
                          )}
                        </button>

                        <p className={styles.privacyNote}>
                          <i className="bi bi-shield-lock me-1" aria-hidden="true" />
                          Respeitamos sua privacidade. Seus dados estão seguros e não enviamos spam.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES & DETAILS SECTION */}
        {(resource.features && resource.features.length > 0) || resource.image ? (
          <section className={styles.detailsSection}>
            <div className="container">
              <div className={styles.sectionHeader}>
                <span className={styles.sectionCategory}>O que você vai encontrar</span>
                <h2>Conteúdo e ferramentas práticas</h2>
                <p>
                  Criado para fortalecer sua fé, enriquecer sua rotina e trazer respostas
                  bíblicas claras e acolhedoras para o dia a dia.
                </p>
              </div>

              <div className="row g-4 align-items-center">
                {resource.image ? (
                  <div className="col-lg-5">
                    <div className={styles.bookCoverCard}>
                      <img
                        src={resource.image}
                        alt={`Capa de ${resource.title}`}
                        width={380}
                        height={285}
                        className={styles.coverImage}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className={styles.coverBadge}>
                        <i className="bi bi-file-earmark-pdf-fill text-danger" aria-hidden="true" />
                        {resource.format || "Formato Digital"} · Acesso Imediato
                      </div>
                    </div>
                  </div>
                ) : null}

                {resource.features && resource.features.length > 0 ? (
                  <div className={resource.image ? "col-lg-7" : "col-lg-12"}>
                    <div className="row g-3">
                      {resource.features.map((feature, idx) => (
                        <div key={feature.title} className="col-12">
                          <article className={styles.featureCard}>
                            <div className={styles.featureNumber}>
                              {feature.number || String(idx + 1).padStart(2, "0")}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                          </article>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* OPTIONAL MARKDOWN BODY SECTION */}
        {resource.bodyHtml && resource.bodyHtml.trim().length > 0 ? (
          <section className={styles.contentBodySection}>
            <div className="container">
              <div
                className={styles.contentBodyCard}
                dangerouslySetInnerHTML={{ __html: resource.bodyHtml }}
              />
            </div>
          </section>
        ) : null}

        {/* TESTIMONIAL SECTION */}
        {resource.testimonial ? (
          <section className={styles.testimonialSection}>
            <div className="container">
              <div className={styles.testimonialCard}>
                <div className={styles.testimonialQuoteIcon}>
                  <i className="bi bi-quote" aria-hidden="true" />
                </div>
                <p className={styles.testimonialQuote}>"{resource.testimonial.quote}"</p>
                <p className={styles.testimonialAuthor}>— {resource.testimonial.author}</p>
              </div>
            </div>
          </section>
        ) : null}

        {/* CHURCH INFO & LOCATION SECTION */}
        <section className={styles.churchSection}>
          <div className="container">
            <div className="row g-4 align-items-stretch">
              <div className="col-lg-6">
                <div className={styles.churchInfoCard}>
                  <h3>Igreja Cristã Evangélica Jardins</h3>
                  <p className={styles.locationDetail}>
                    Somos uma comunidade cristã no Jardim Botânico em Brasília - DF, dedicada ao
                    ensino fiel das Escrituras, à comunhão sincera e ao acolhimento de pessoas e
                    famílias.
                  </p>

                  <h4 className="h6 fw-bold text-uppercase tracking-wider mb-3 text-secondary">
                    Nossos Encontros Semanais:
                  </h4>

                  <ul className={styles.scheduleList}>
                    <li className={styles.scheduleItem}>
                      <span className={styles.scheduleBadge}>Dom · 09:30</span>
                      <span>Louvor e Culto Inspirativo</span>
                    </li>
                    <li className={styles.scheduleItem}>
                      <span className={styles.scheduleBadge}>Dom · 11:00</span>
                      <span>Escola Bíblica Dominical (EBD)</span>
                    </li>
                  </ul>

                  <div className={styles.churchActions}>
                    <Link to="/visita/" className={styles.churchBtnOutline}>
                      <i className="bi bi-compass" aria-hidden="true" />
                      Planeje sua visita
                    </Link>
                    <a
                      href={site.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.churchBtnWhatsapp}
                    >
                      <i className="bi bi-whatsapp" aria-hidden="true" />
                      Fale no WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className={styles.churchInfoCard}>
                  <h3>Onde Estamos</h3>
                  <p className={styles.locationDetail}>
                    <strong>Endereço:</strong> Auditório do Colégio In-Nova (antigo COC), Condomínio
                    Estância Jardim Botânico II, SH Jardim Botânico, Brasília — DF, CEP 71686-301.
                  </p>
                  <p className={styles.locationDetail}>
                    <strong>E-mail:</strong> {site.contact.email}
                  </p>

                  <div className="mt-3">
                    <a
                      href="https://maps.google.com/?q=Igreja+Crist%C3%A3+Evang%C3%A9lica+Jardins"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.churchBtnOutline}
                    >
                      <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                      Abrir no Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className={styles.resourceFooter}>
        <div className="container">
          <p className="mb-1">
            © {new Date().getFullYear()} ICE Jardins — Igreja Cristã Evangélica Jardins. Todos os
            direitos reservados.
          </p>
          <p className="mb-0">
            <Link to="/">Início</Link> · <Link to="/recursos/">Recursos</Link> ·{" "}
            <Link to="/visita/">Visita</Link> · <Link to="/fe/">No que cremos</Link> ·{" "}
            <Link to="/posts/">Sermões</Link> · <Link to="/privacy/">Privacidade</Link> ·{" "}
            <Link to="/descadastro/">Descadastro</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
