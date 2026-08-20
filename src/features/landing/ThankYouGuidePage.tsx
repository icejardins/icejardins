import { Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import styles from "./ThankYouGuidePage.module.css";

export default function ThankYouGuidePage() {
  const site = getSiteConfig();

  return (
    <div className={styles.pageWrapper}>
      <SeoHead
        title={`Seu Guia Está Pronto para Download | ${site.title}`}
        description="Acesse e baixe o seu exemplar gratuito do guia 'Quando a cabeça não para: Um guia para encontrar calma num mundo agitado'."
        canonicalPath="/obrigado-guia/"
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
              <i className="bi bi-check-circle-fill" aria-hidden="true" />
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
            <i className="bi bi-check-lg" />
            Solicitação Confirmada
          </div>

          <h1 className={styles.heroTitle}>Seu guia gratuito está pronto!</h1>
          <p className={styles.heroSubtitle}>
            Ficamos muito felizes pelo seu contato. Clique no botão abaixo para baixar o arquivo PDF
            no seu celular, tablet ou computador.
          </p>

          <div className={styles.mainDownloadBox}>
            <a
              href="/downloads/quando-a-cabeca-nao-para.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.downloadButton}
              download="quando-a-cabeca-nao-para-ice-jardins.pdf"
            >
              <i className="bi bi-file-earmark-arrow-down-fill" />
              Baixar o Guia em PDF
            </a>
            <p className={styles.downloadMeta}>
              Formato: PDF Digital · Tamanho: 1.8 MB · 100% Gratuito
            </p>
          </div>
        </div>
      </section>

      {/* NEXT STEPS & RESOURCE OVERVIEW */}
      <section className={styles.contentSection}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className={styles.coverCard}>
                <picture>
                  <source srcSet="/images/quando-a-cabeca-nao-para-cover.webp" type="image/webp" />
                  <img
                    src="/images/quando-a-cabeca-nao-para-cover.webp"
                    alt="Capa do Guia Quando a cabeça não para"
                    width={320}
                    height={240}
                    className={styles.coverImage}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            </div>

            <div className="col-lg-7">
              <div className={styles.stepsCard}>
                <h2>Como aproveitar melhor este material:</h2>
                <ul className={styles.stepList}>
                  <li className={styles.stepItem}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepText}>
                      <h3>Salve o arquivo no seu leitor favorito</h3>
                      <p>
                        Baixe o PDF e mantenha em um local de fácil acesso no seu smartphone ou leitor de livros digitais.
                      </p>
                    </div>
                  </li>

                  <li className={styles.stepItem}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepText}>
                      <h3>Pratique os exercícios de respiração</h3>
                      <p>
                        Aplique as ferramentas práticas sugeridas para desacelerar o ritmo cardíaco e acalmar a mente nos momentos de ansiedade.
                      </p>
                    </div>
                  </li>

                  <li className={styles.stepItem}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepText}>
                      <h3>Compartilhe com quem precisa</h3>
                      <p>
                        Este guia é 100% livre e gratuito. Sinta-se à vontade para enviar para amigos, familiares e pessoas próximas.
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
              Nossa comunidade no Jardim Botânico está de portas abertas para receber você e sua família.
              Venha participar de um momento de comunhão, ensino bíblico e adoração.
            </p>

            <div className={styles.scheduleGrid}>
              <div className={styles.scheduleItem}>
                <i className="bi bi-clock-fill me-2 text-primary" />
                Domingo · 09:30 — Louvor e Culto Inspirativo
              </div>
              <div className={styles.scheduleItem}>
                <i className="bi bi-clock-fill me-2 text-primary" />
                Domingo · 11:00 — Escola Bíblica Dominical (EBD)
              </div>
            </div>

            <div className={styles.actionButtons}>
              <Link to="/visita/" className={styles.btnPrimary}>
                <i className="bi bi-compass" />
                Planejar minha visita
              </Link>
              <a
                href="https://wa.me/5561982624952"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnWhatsapp}
              >
                <i className="bi bi-whatsapp" />
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
            <Link to="/">Início</Link> · <Link to="/visita/">Visita</Link> ·{" "}
            <Link to="/fe/">No que cremos</Link> · <Link to="/posts/">Sermões</Link> ·{" "}
            <Link to="/privacy/">Privacidade</Link>
          </p>

          <p className={styles.footerUnsubscribe}>
            Você recebeu nosso contato porque solicitou este guia em nosso site. Se não deseja mais receber nossos e-mails,{" "}
            <Link to="/descadastro/">clique aqui para cancelar</Link>.
          </p>
        </div>
      </footer>
    </div>
  );
}
