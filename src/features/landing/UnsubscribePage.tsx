import { useSearchParams, Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import styles from "./UnsubscribePage.module.css";

export default function UnsubscribePage() {
  const site = getSiteConfig();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className={styles.pageWrapper}>
      <SeoHead
        title={`Cancelamento de Inscrição | ${site.title}`}
        description="Confirmação de descadastro de e-mails informativos da ICE Jardins."
        canonicalPath="/descadastro/"
        noindex={true}
      />

      <header className={styles.topBar}>
        <div className="container">
          <div className={styles.topBarInner}>
            <Link
              to="/"
              className={styles.brandLink}
              title="Página Inicial"
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

      <main id="main-content" className={styles.contentContainer}>
        <div className={styles.unsubscribeCard}>
          <div className={styles.iconWrap}>
            <i className="bi bi-envelope-x-fill" />
          </div>

          <h1 className={styles.title}>Inscrição Cancelada</h1>

          <p className={styles.description}>
            Você foi descadastrado com sucesso de nossas comunicações e não receberá mais nossos e-mails.
            {email && (
              <>
                <br />
                <span className={styles.emailHighlight}>{email}</span>
              </>
            )}
          </p>

          <Link to="/" className={styles.btnBack}>
            <i className="bi bi-house-door-fill" />
            Voltar para o site principal
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p className="mb-0">
            © {new Date().getFullYear()} ICE Jardins — Igreja Cristã Evangélica Jardins.
          </p>
        </div>
      </footer>
    </div>
  );
}
