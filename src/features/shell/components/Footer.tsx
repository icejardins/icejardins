import { Link, useLocation } from "react-router";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import { Icon } from "@/shared/components/Icon";
import { trackAdsConversion } from "@/shared/utils/analytics";
import styles from "./Footer.module.css";

export function Footer() {
  const site = getSiteConfig();
  const location = useLocation();

  const isEnglish = location.pathname.startsWith("/en");

  return (
    <footer className={styles.footer}>
      <div className="container py-5">
        <div className="row g-4">
          {/* Coluna 1: Identidade da Igreja e WhatsApp */}
          <div className="col-lg-4 col-md-6">
            <div className={styles.brandCol}>
              <div className={styles.brandLogo}>
                <img
                  src="/images/logo-ice-jardins-01.webp"
                  alt="ICE Jardins"
                  width={48}
                  height={20}
                />
                <span className={styles.brandName}>ICE Jardins</span>
              </div>
              <p className={styles.brandDesc}>
                {isEnglish
                  ? "Evangelical Christian Church in Jardim Botânico, Brasília - DF. A biblical community dedicated to teaching God's Word, fellowship, and worship."
                  : "Igreja Cristã Evangélica no Jardim Botânico, Brasília - DF. Uma comunidade dedicada ao ensino da Bíblia, à comunhão e à adoração a Deus."}
              </p>
              <a
                href="https://wa.me/5561982624952"
                target="_blank"
                rel="noreferrer"
                className={styles.whatsAppBtn}
                onClick={() => trackAdsConversion()}
              >
                <Icon name="whatsapp" className={styles.whatsAppIcon} />
                <span>(61) 98262-4952 · {isEnglish ? "Chat on WhatsApp" : "Falar no WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* Coluna 2: Horários dos Cultos */}
          <div className="col-lg-3 col-md-6">
            <h3 className={styles.colTitle}>
              {isEnglish ? "Service Times" : "Horários dos Cultos"}
            </h3>
            <ul className={styles.serviceList}>
              <li>
                <div className={styles.serviceItem}>
                  <Icon name="clock" className={styles.itemIcon} />
                  <div>
                    <strong>{isEnglish ? "Worship Service" : "Culto Inspirativo"}</strong>
                    <span>{isEnglish ? "Sundays at 9:30 AM" : "Domingos às 9h30"}</span>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles.serviceItem}>
                  <Icon name="book" className={styles.itemIcon} />
                  <div>
                    <strong>
                      {isEnglish ? "Sunday School & Kids" : "Escola Dominical & Infantil"}
                    </strong>
                    <span>{isEnglish ? "Sundays at 11:00 AM" : "Domingos às 11h00"}</span>
                  </div>
                </div>
              </li>
            </ul>
            <Link to="/visita/" className={styles.visitLink}>
              {isEnglish ? "Plan your visit →" : "Planeje sua visita →"}
            </Link>
          </div>

          {/* Coluna 3: Endereço no Jardim Botânico */}
          <div className="col-lg-3 col-md-6">
            <h3 className={styles.colTitle}>
              {isEnglish ? "Where We Meet" : "No Jardim Botânico"}
            </h3>
            <div className={styles.locationInfo}>
              <div className={styles.locationItem}>
                <Icon name="geo-alt" className={styles.itemIcon} />
                <div>
                  <strong>Auditório do Colégio In-Nova</strong>
                  <p className={styles.addressText}>
                    (antigo COC Jardim Botânico)
                    <br />
                    Condomínio Estância Jardim Botânico II
                    <br />
                    Brasília — DF, CEP 71686-301
                  </p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/ddMo7kUUDr6fHYyX9"
                target="_blank"
                rel="noreferrer"
                className={styles.mapLink}
              >
                <Icon name="compass" />
                {isEnglish ? "Open in Google Maps / Waze →" : "Abrir no Google Maps / Waze →"}
              </a>
            </div>
          </div>

          {/* Coluna 4: Links Rápidos */}
          <div className="col-lg-2 col-md-6">
            <h3 className={styles.colTitle}>
              {isEnglish ? "Quick Links" : "Links Rápidos"}
            </h3>
            <ul className={styles.quickLinks}>
              <li>
                <Link to={isEnglish ? "/en/" : "/"}>
                  {isEnglish ? "Home" : "Início"}
                </Link>
              </li>
              <li>
                <Link to={isEnglish ? "/en/faith/" : "/fe/"}>
                  {isEnglish ? "What We Believe" : "No que cremos"}
                </Link>
              </li>
              <li>
                <Link to="/visita/">
                  {isEnglish ? "Visit Us" : "Visita"}
                </Link>
              </li>
              <li>
                <Link to="/posts/">
                  {isEnglish ? "Sermons" : "Sermões"}
                </Link>
              </li>
              <li>
                <Link to="/recursos/">
                  {isEnglish ? "Resources" : "Recursos"}
                </Link>
              </li>
              <li>
                <Link to={isEnglish ? "/en/give/" : "/contribuir/"}>
                  {isEnglish ? "Give" : "Contribua"}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra Inferior */}
      <div className={styles.bottomBar}>
        <div className="container py-3 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {site.title}.{" "}
            {isEnglish ? "All rights reserved." : "Todos os direitos reservados."}
          </p>
          <div className={styles.legalAndSocial}>
            <div className={styles.legalLinks}>
              <Link to="/privacy/">
                {isEnglish ? "Privacy Policy" : "Política de Privacidade"}
              </Link>
              <span>·</span>
              <Link to="/terms/">
                {isEnglish ? "Terms of Service" : "Termos de Serviço"}
              </Link>
            </div>
            <div className={styles.socialLinks}>
              {site.social.instagram ? (
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIcon}
                  aria-label="Instagram"
                >
                  <Icon name="instagram" />
                </a>
              ) : null}
              {site.social.facebook ? (
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIcon}
                  aria-label="Facebook"
                >
                  <Icon name="facebook" />
                </a>
              ) : null}
              {site.social.whatsapp ? (
                <a
                  href={site.social.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.socialIcon}
                  onClick={() => trackAdsConversion()}
                  aria-label="WhatsApp"
                >
                  <Icon name="whatsapp" />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
