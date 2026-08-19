import { useState, useRef, useEffect, type FormEvent } from "react";
import { Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import { trackAdsConversion } from "@/shared/utils/analytics";
import styles from "./LandingPage.module.css";

const VISITOR_TYPE_OPTIONS = [
  { value: "Visitante pela primeira vez", label: "Visitante pela primeira vez" },
  { value: "Morador do Jardim Botânico / DF", label: "Morador do Jardim Botânico / DF" },
  { value: "Procurando uma igreja / comunidade", label: "Procurando uma igreja / comunidade" },
  { value: "Membro de outra igreja", label: "Membro de outra igreja" },
  { value: "Amigo / Convidado de um membro", label: "Amigo / Convidado de um membro" },
  { value: "Outro", label: "Outro" }
] as const;

export default function LandingPage() {
  const site = getSiteConfig();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [visitorType, setVisitorType] = useState<string>(VISITOR_TYPE_OPTIONS[0].value);
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot anti-spam
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Time-check bot defense (populated client-side only to avoid SSR hydration mismatch)
  const formLoadedAtRef = useRef<number>(0);
  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

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

    // If honeypot is filled, simulate instant success
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
          visitorType: visitorType.trim(),
          phone: phone.trim(),
          website: website.trim(),
          formLoadedAt: formLoadedAtRef.current || Date.now()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Não foi possível enviar os dados. Tente novamente."
        );
      }

      // Track Google Ads Conversion on successful submission
      trackAdsConversion();
      setIsSuccess(true);
    } catch (err: any) {
      console.error("[LandingPage] Submit error:", err);
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
    setVisitorType(VISITOR_TYPE_OPTIONS[0].value);
    setPhone("");
    setWebsite("");
    formLoadedAtRef.current = Date.now();
    setIsSuccess(false);
    setErrorMessage(null);
  };

  const resourceStructuredData = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: "Quando a cabeça não para: Um guia para encontrar calma num mundo agitado",
    description:
      "Um guia prático e bíblico para lidar com a ansiedade, desacelerar a mente e encontrar descanso e paz verdadeira.",
    url: "https://icejardins.org.br/landing/",
    image: "https://icejardins.org.br/images/quando-a-cabeca-nao-para-cover.webp",
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
      url: "https://icejardins.org.br"
    }
  };

  return (
    <div className={styles.landingWrapper}>
      <SeoHead
        title={`Quando a cabeça não para — Guia Gratuito | ${site.title}`}
        description="A ansiedade pode provocar insônia e uma sensação de pensamentos descontrolados. Baixe gratuitamente este guia com exercícios práticos e reflexões sobre a verdadeira paz."
        canonicalPath="/landing/"
        image="/images/quando-a-cabeca-nao-para-cover.webp"
        jsonLd={resourceStructuredData}
        adsConversionSendTo={site.googleAdsConversionSendTo}
      />

      {/* TOP BRAND BAR */}
      <header className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            <Link to="/" className={styles.brandLink} title="Voltar para a página inicial da ICE Jardins">
              <img
                src="/images/logo-ice-jardins-01.webp"
                alt="Logo ICE Jardins"
                className={styles.churchLogo}
                width={120}
                height={52}
              />
              <span>ICE Jardins</span>
            </Link>

            <span className={styles.topBarBadge}>
              <i className="bi bi-gift-fill" aria-hidden="true" />
              Recurso Gratuito
            </span>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH FORM */}
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Left Column: Copy & Value Proposition */}
            <div className="col-lg-7">
              <div className={styles.heroContent}>
                <div className={styles.categoryPill}>
                  <span className={styles.pulseDot} />
                  Guia Especial Gratuito
                </div>

                <h1 className={styles.heroTitle}>Quando a cabeça não para.</h1>
                <p className={styles.heroSubtitle}>
                  Um guia para encontrar calma num mundo agitado
                </p>

                <p className={styles.heroLead}>
                  A ansiedade pode provocar insônia, cansaço mental e a sensação de pensamentos
                  descontrolados. Este guia traz exercícios práticos para acalmar a mente e uma
                  camada mais profunda: <em>e se a verdadeira paz já estivesse te buscando?</em>
                </p>

                <div className={styles.trustBadges}>
                  <div className={styles.trustBadgeItem}>
                    <i className="bi bi-check-circle-fill" />
                    <span>Acesso Imediato</span>
                  </div>
                  <div className={styles.trustBadgeItem}>
                    <i className="bi bi-check-circle-fill" />
                    <span>100% Gratuito</span>
                  </div>
                  <div className={styles.trustBadgeItem}>
                    <i className="bi bi-check-circle-fill" />
                    <span>Sem Spam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Capture Form Card */}
            <div className="col-lg-5">
              <div className={styles.formCard}>
                {isSuccess ? (
                  <div className={styles.successCard}>
                    <div className={styles.successIconWrap}>
                      <i className="bi bi-check-lg" />
                    </div>
                    <h2 className={styles.successTitle}>Tudo pronto!</h2>
                    <p className={styles.successText}>
                      Seu exemplar do guia <strong>"Quando a cabeça não para"</strong> está pronto.
                      Clique no botão abaixo para baixar agora mesmo em PDF:
                    </p>

                    <a
                      href="/downloads/quando-a-cabeca-nao-para.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.downloadCtaButton}
                      download="quando-a-cabeca-nao-para-ice-jardins.pdf"
                    >
                      <i className="bi bi-file-earmark-arrow-down-fill" />
                      Baixar o Guia em PDF
                    </a>

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
                        <i className="bi bi-exclamation-triangle-fill me-2" />
                        {errorMessage}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.leadForm}>
                      {/* Honeypot field */}
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
                        <label htmlFor="lead-visitor-type" className={styles.label}>
                          Quem é você? (Pessoa do visitante) *
                        </label>
                        <select
                          id="lead-visitor-type"
                          value={visitorType}
                          onChange={(e) => setVisitorType(e.target.value)}
                          className={styles.select}
                          disabled={isSubmitting}
                        >
                          {VISITOR_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
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
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Baixar o Guia Gratuito
                            <i className="bi bi-arrow-right" />
                          </>
                        )}
                      </button>

                      <p className={styles.privacyNote}>
                        <i className="bi bi-shield-lock me-1" />
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

      {/* DETAILS SECTION */}
      <section className={styles.detailsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionCategory}>O que você vai encontrar</span>
            <h2>Ferramentas práticas para o seu dia a dia</h2>
            <p>
              Criado para quem enfrenta a sobrecarga diária, a correria e a inquietação mental,
              com respostas acolhedoras e fundamentadas.
            </p>
          </div>

          <div className="row g-4 align-items-center">
            {/* Book Cover Card */}
            <div className="col-lg-5">
              <div className={styles.bookCoverCard}>
                <picture>
                  <source srcSet="/images/quando-a-cabeca-nao-para-cover.webp" type="image/webp" />
                  <img
                    src="/images/quando-a-cabeca-nao-para-cover.webp"
                    alt="Capa do Guia Quando a cabeça não para"
                    width={380}
                    height={285}
                    className={styles.coverImage}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div className={styles.coverBadge}>
                  <i className="bi bi-file-earmark-pdf-fill text-danger" />
                  Formato Digital (PDF) · Acesso Imediato
                </div>
              </div>
            </div>

            {/* 3 Pillars / Feature Cards */}
            <div className="col-lg-7">
              <div className="row g-3">
                <div className="col-12">
                  <article className={styles.featureCard}>
                    <div className={styles.featureNumber}>01</div>
                    <h3>Exercícios Práticos e Imediatos</h3>
                    <p>
                      Técnicas acessíveis para desacelerar o fluxo de pensamentos e regular a
                      respiração nos momentos de maior tensão ou insônia.
                    </p>
                  </article>
                </div>

                <div className="col-12">
                  <article className={styles.featureCard}>
                    <div className={styles.featureNumber}>02</div>
                    <h3>Linguagem Direta, Sem Jargões</h3>
                    <p>
                      Um conteúdo honesto e humanizado sobre as batalhas da mente moderna,
                      perfeito para ler no seu ritmo ou compartilhar com familiares e amigos.
                    </p>
                  </article>
                </div>

                <div className="col-12">
                  <article className={styles.featureCard}>
                    <div className={styles.featureNumber}>03</div>
                    <h3>Uma Paz Mais Profunda</h3>
                    <p>
                      Uma reflexão bíblica consoladora: a paz que excede todo o entendimento não é
                      apenas a ausência de problemas, mas o descanso na presença constante de Deus.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className={styles.testimonialSection}>
        <div className="container">
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuoteIcon}>
              <i className="bi bi-quote" />
            </div>
            <p className={styles.testimonialQuote}>
              "Eu gostei muito do que li. Estou processando."
            </p>
            <p className={styles.testimonialAuthor}>— Ana Amélia</p>
          </div>
        </div>
      </section>

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
                    <i className="bi bi-compass" />
                    Planeje sua visita
                  </Link>
                  <a
                    href="https://wa.me/5561982624952"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.churchBtnWhatsapp}
                  >
                    <i className="bi bi-whatsapp" />
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
                  <strong>E-mail:</strong> secretaria@icejardins.org.br
                </p>

                <div className="mt-3">
                  <a
                    href="https://maps.google.com/?q=Igreja+Crist%C3%A3+Evang%C3%A9lica+Jardins"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.churchBtnOutline}
                  >
                    <i className="bi bi-geo-alt-fill" />
                    Abrir no Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.landingFooter}>
        <div className="container">
          <p className="mb-1">
            © {new Date().getFullYear()} ICE Jardins — Igreja Cristã Evangélica Jardins. Todos os
            direitos reservados.
          </p>
          <p className="mb-0">
            <Link to="/">Início</Link> · <Link to="/visita/">Visita</Link> ·{" "}
            <Link to="/fe/">No que cremos</Link> · <Link to="/posts/">Sermões</Link> ·{" "}
            <Link to="/privacy/">Privacidade</Link> · <Link to="/descadastro/">Descadastro</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
