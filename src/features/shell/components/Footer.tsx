import { Link, useLocation } from "react-router";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import { Icon } from "@/shared/components/Icon";
import { trackContactConversion, trackWhatsAppConversion } from "@/shared/utils/analytics";
import styles from "./Footer.module.css";

export function Footer() {
  const site = getSiteConfig();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const langParam = searchParams.get("lang");
  const isEnglish = location.pathname.startsWith("/en") || langParam === "en";
  const isSpanish = location.pathname.startsWith("/es") || langParam === "es";

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
                {isSpanish
                  ? "Iglesia Cristiana Evangélica en Jardim Botânico, Brasília - DF. Una comunidad bíblica dedicada a la enseñanza de la Palabra de Dios, la comunión y la adoración."
                  : isEnglish
                    ? "Evangelical Christian Church in Jardim Botânico, Brasília - DF. A biblical community dedicated to teaching God's Word, fellowship, and worship."
                    : "Igreja Cristã Evangélica no Jardim Botânico, Brasília - DF. Uma comunidade dedicada ao ensino da Bíblia, à comunhão e à adoração a Deus."}
              </p>
              <a
                href="https://wa.me/5561982624952"
                target="_blank"
                rel="noreferrer"
                className={styles.whatsAppBtn}
                onClick={() => trackWhatsAppConversion("footer_cta")}
              >
                <Icon name="whatsapp" className={styles.whatsAppIcon} />
                <span>
                  (61) 98262-4952 · {isSpanish ? "Hablar por WhatsApp" : isEnglish ? "Chat on WhatsApp" : "Falar no WhatsApp"}
                </span>
              </a>
            </div>
          </div>

          {/* Coluna 2: Horários dos Cultos */}
          <div className="col-lg-3 col-md-6">
            <h3 className={styles.colTitle}>
              {isSpanish ? "Horarios de los Cultos" : isEnglish ? "Service Times" : "Horários dos Cultos"}
            </h3>
            <ul className={styles.serviceList}>
              <li>
                <div className={styles.serviceItem}>
                  <Icon name="clock" className={styles.itemIcon} />
                  <div>
                    <strong>
                      {isSpanish ? "Culto Inspirativo" : isEnglish ? "Worship Service" : "Culto Inspirativo"}
                    </strong>
                    <span>
                      {isSpanish ? "Domingos a las 9:30" : isEnglish ? "Sundays at 9:30 AM" : "Domingos às 9h30"}
                    </span>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles.serviceItem}>
                  <Icon name="book" className={styles.itemIcon} />
                  <div>
                    <strong>
                      {isSpanish
                        ? "Escuela Dominical e Infantil"
                        : isEnglish
                          ? "Sunday School & Kids"
                          : "Escola Dominical & Infantil"}
                    </strong>
                    <span>
                      {isSpanish ? "Domingos a las 11:00" : isEnglish ? "Sundays at 11:00 AM" : "Domingos às 11h00"}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
            <Link
              to={isSpanish ? "/es/visita/" : isEnglish ? "/en/visit/" : "/visita/"}
              className={styles.visitLink}
            >
              {isSpanish ? "Planifique su visita →" : isEnglish ? "Plan your visit →" : "Planeje sua visita →"}
            </Link>
          </div>

          {/* Coluna 3: Endereço no Jardim Botânico */}
          <div className="col-lg-3 col-md-6">
            <h3 className={styles.colTitle}>
              {isSpanish ? "Dónde nos reunimos" : isEnglish ? "Where We Meet" : "No Jardim Botânico"}
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
                onClick={() => trackContactConversion("footer_maps_directions")}
              >
                <Icon name="compass" />
                {isSpanish
                  ? "Abrir en Google Maps / Waze →"
                  : isEnglish
                    ? "Open in Google Maps / Waze →"
                    : "Abrir no Google Maps / Waze →"}
              </a>
            </div>
          </div>

          {/* Coluna 4: Links Rápidos */}
          <div className="col-lg-2 col-md-6">
            <h3 className={styles.colTitle}>
              {isSpanish ? "Enlaces Rápidos" : isEnglish ? "Quick Links" : "Links Rápidos"}
            </h3>
            <ul className={styles.quickLinks}>
              <li>
                <Link to={isSpanish ? "/es/" : isEnglish ? "/en/" : "/"}>
                  {isSpanish ? "Inicio" : isEnglish ? "Home" : "Início"}
                </Link>
              </li>
              <li>
                <Link to={isSpanish ? "/es/fe/" : isEnglish ? "/en/faith/" : "/fe/"}>
                  {isSpanish ? "Lo que creemos" : isEnglish ? "What We Believe" : "No que cremos"}
                </Link>
              </li>
              <li>
                <Link to={isSpanish ? "/es/visita/" : isEnglish ? "/en/visit/" : "/visita/"}>
                  {isSpanish ? "Visita" : isEnglish ? "Visit Us" : "Visita"}
                </Link>
              </li>
              <li>
                <Link
                  to={
                    isSpanish
                      ? "/es/donar/proyecto-templo/"
                      : isEnglish
                        ? "/en/give/temple-project/"
                        : "/contribuir/projeto-templo/"
                  }
                >
                  {isSpanish ? "Proyecto del Templo" : isEnglish ? "Temple Project" : "Projeto do Templo"}
                </Link>
              </li>
              <li>
                <Link to={isSpanish ? "/es/sermones/" : isEnglish ? "/en/sermons/" : "/posts/"}>
                  {isSpanish ? "Sermones" : isEnglish ? "Sermons" : "Sermões"}
                </Link>
              </li>
              <li>
                <Link to="/recursos/">
                  {isSpanish ? "Recursos" : isEnglish ? "Resources" : "Recursos"}
                </Link>
              </li>
              <li>
                <Link to={isSpanish ? "/es/donar/" : isEnglish ? "/en/give/" : "/contribuir/"}>
                  {isSpanish ? "Donar" : isEnglish ? "Give" : "Contribua"}
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
            {isSpanish
              ? "Todos los derechos reservados."
              : isEnglish
                ? "All rights reserved."
                : "Todos os direitos reservados."}
          </p>
          <div className={styles.legalAndSocial}>
            <div className={styles.legalLinks}>
              <Link to="/privacy/">
                {isSpanish
                  ? "Política de Privacidad"
                  : isEnglish
                    ? "Privacy Policy"
                    : "Política de Privacidade"}
              </Link>
              <span>·</span>
              <Link to="/terms/">
                {isSpanish
                  ? "Términos de Servicio"
                  : isEnglish
                    ? "Terms of Service"
                    : "Termos de Serviço"}
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
                  onClick={() => trackWhatsAppConversion("footer_social")}
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
