import { useState } from "react";
import { Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { projectsContentEs } from "@/content/data/projectsContentEs";
import { TerrainMap } from "./components/TerrainMap";
import {
  trackContactConversion,
  trackPixDonationConversion,
  trackReliantDonationConversion
} from "@/shared/utils/analytics";
import styles from "./ProjectsPage.module.css";

export default function ProjectsPageEs() {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = async () => {
    try {
      const text = projectsContentEs.givingCta.pixRaw;
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
      trackPixDonationConversion("projects_es_copy_pix");
    } catch {
      // Ignore copy error
    }
  };

  const projectSchemaEs = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Futura Sede del Templo de la Iglesia ICE Jardins — Gleba 01 Fazenda Taboquinha",
    description:
      "Propiedad de 2,44 hectáreas (24.368 m²) adquirida por la Iglesia Cristiana Evangélica Jardins en Jardim Botânico / Tororó (Brasília, Brasil) para construir su sede definitiva, templo, ala infantil, áreas comunitarias y estacionamiento.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Fazenda Taboquinha Mansões Serrana, Gleba 01",
      addressLocality: "Jardim Botânico / Tororó",
      addressRegion: "DF",
      postalCode: "71686-206",
      addressCountry: "BR"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -15.86583,
      longitude: -47.78385
    }
  };

  return (
    <>
      <SeoHead
        title="Proyecto de Edificación: Sede Definitiva | Iglesia ICE Jardins"
        description="Subpágina de la Iglesia ICE Jardins dedicada al proyecto de construcción del templo y sede definitiva en Fazenda Taboquinha, Jardim Botânico, Brasília. Diagnóstico demográfico, recorrido 3D en Google Earth, estado del terreno y formas de donar."
        canonicalPath="/es/donar/proyecto-edificacion/"
        image="/images/projetos/templo-ice-jardins-conceito.webp"
        jsonLd={projectSchemaEs}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
        <div className="container">
          <ol className={styles.breadcrumbList}>
            <li>
              <Link to="/es/">Inicio</Link>
            </li>
            <li>
              <span className={styles.breadcrumbSep}>/</span>
            </li>
            <li>
              <Link to="/es/donar/">Donar</Link>
            </li>
            <li>
              <span className={styles.breadcrumbSep}>/</span>
            </li>
            <li aria-current="page" className={styles.breadcrumbCurrent}>
              Proyecto de Edificación (Fazenda Taboquinha)
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.heroBadge}>{projectsContentEs.hero.badge}</span>
          <h1 className={styles.heroTitle}>{projectsContentEs.hero.title}</h1>
          <p className={styles.heroSubtitle}>{projectsContentEs.hero.subtitle}</p>

          <div className={styles.verseBox}>
            <p>{projectsContentEs.hero.verse}</p>
            <cite>{projectsContentEs.hero.reference}</cite>
          </div>

          <div className={styles.heroVisualWrapper}>
            <img
              src={projectsContentEs.hero.image}
              srcSet="/images/projetos/templo-ice-jardins-conceito-640.webp 640w, /images/projetos/templo-ice-jardins-conceito-1040.webp 1040w, /images/projetos/templo-ice-jardins-conceito.webp 1376w"
              sizes="(max-width: 768px) 100vw, 1040px"
              alt="Perspectiva conceptual de arquitectura del futuro templo de ICE Jardins en Jardim Botânico, Brasília, Brasil"
              className={styles.heroImage}
              width={1376}
              height={768}
              loading="eager"
              fetchPriority="high"
            />
            <p className={styles.heroVisualCaption}>
              Perspectiva conceptual de arquitectura: templo integrado armónicamente con la vegetación
              nativa del Cerrado y el paisaje de Brasília.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          {/* Status and Financial Transparency: Land Being Paid Off */}
          <article className={styles.statusCard} id="land-status">
            <span className={styles.statusBadge}>
              <Icon name="clock-history" /> {projectsContentEs.terrainStatus.badge}
            </span>
            <h2>{projectsContentEs.terrainStatus.headline}</h2>
            <p className={styles.statusCallout}>{projectsContentEs.terrainStatus.callout}</p>

            <ul className={styles.statusList}>
              {projectsContentEs.terrainStatus.details.map((text, idx) => (
                <li key={idx} className={styles.statusItem}>
                  <Icon name="check-circle-fill" className={styles.statusItemIcon} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className={styles.statusActions}>
              <a href="#how-to-partner" className={styles.ctaContributeBtn}>
                <Icon name="heart-fill" /> Colaborar con el Proyecto de Edificación
              </a>
              <a
                href={projectsContentEs.givingCta.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaWhatsAppBtn}
                onClick={() => trackContactConversion("projects_es_talk_pastor")}
              >
                <Icon name="whatsapp" /> Contactar al Liderazgo
              </a>
            </div>
          </article>

          {/* Specifications and Interactive Map with Google Earth */}
          <section className={styles.specsSection} id="property-map">
            <div className={styles.sectionHeader}>
              <h2>{projectsContentEs.terrainSpecs.title}</h2>
              <p>{projectsContentEs.terrainSpecs.subtitle}</p>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Área Total</span>
                <span className={styles.specValue}>{projectsContentEs.terrainSpecs.areaM2}</span>
                <span className={styles.specDetail}>
                  {projectsContentEs.terrainSpecs.areaHectares}
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Perímetro</span>
                <span className={styles.specValue}>
                  {projectsContentEs.terrainSpecs.perimeter}
                </span>
                <span className={styles.specDetail}>
                  {projectsContentEs.terrainSpecs.verticesCount} puntos topográficos georreferenciados
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Lote / Predio</span>
                <span className={styles.specValue}>Gleba 01</span>
                <span className={styles.specDetail}>
                  {projectsContentEs.terrainSpecs.property}
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Región Administrativa</span>
                <span className={styles.specValue}>Jardim Botânico</span>
                <span className={styles.specDetail}>RA XXVII — Brasília / DF, Brasil</span>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <TerrainMap
              kmlDownloadUrl={projectsContentEs.terrainSpecs.kmlDownloadUrl}
              googleEarthUrl={projectsContentEs.terrainSpecs.googleEarthWebUrl}
              googleMapsUrl={projectsContentEs.terrainSpecs.googleMapsUrl}
              lang="es"
            />

            {/* Google Earth & KML Download Action Box */}
            <article className={styles.earthActionsCard}>
              <h3 className={styles.earthActionsTitle}>
                <Icon name="globe-americas" /> Exploración 3D en Google Earth y Descarga de KML
              </h3>
              <p className={styles.earthActionsDesc}>
                Explore la topografía 3D, elevación suave y los límites oficiales de la Gleba 01
                adquirida por ICE Jardins directamente en Google Earth o descargue el archivo topográfico oficial.
              </p>

              <div className={styles.earthButtons}>
                <a
                  href={projectsContentEs.terrainSpecs.googleEarthWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.earthBtnPrimary}
                >
                  <Icon name="box-arrow-up-right" /> Abrir Proyecto en Google Earth (3D)
                </a>
                <a
                  href={projectsContentEs.terrainSpecs.kmlDownloadUrl}
                  download="terreno-ice-jardins-fazenda-taboquinha.kml"
                  className={styles.earthBtnOutline}
                >
                  <Icon name="download" /> Descargar Archivo KML (.kml)
                </a>
                <a
                  href={projectsContentEs.terrainSpecs.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.earthBtnOutline}
                >
                  <Icon name="geo-alt" /> Ver en Google Maps
                </a>
              </div>

              <div className={styles.earthGuide}>
                <h4 className={styles.earthGuideTitle}>
                  <Icon name="info-circle" /> {projectsContentEs.googleEarthGuide.title}
                </h4>
                <ul className={styles.earthGuideList}>
                  {projectsContentEs.googleEarthGuide.desktopSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </article>
          </section>

          {/* Demographic & Housing Diagnostic */}
          <section className={styles.demographicsSection} id="demographics">
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2>{projectsContentEs.demographics.title}</h2>
                <p>{projectsContentEs.demographics.subtitle}</p>
              </div>

              {/* Metric Cards */}
              <div className={styles.metricCardsGrid}>
                {projectsContentEs.demographics.metrics.map((metric) => (
                  <article key={metric.label} className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                      <Icon name={metric.icon} />
                    </div>
                    <span className={styles.metricValue}>{metric.value}</span>
                    <h3 className={styles.metricLabel}>{metric.label}</h3>
                    <p className={styles.metricDetail}>{metric.detail}</p>
                    <span className={styles.metricSource}>{metric.source}</span>
                  </article>
                ))}
              </div>

              {/* Neighborhoods Reach Table */}
              <article className={styles.neighborhoodTableCard}>
                <h3>
                  <Icon name="compass" /> Cuenca de Alcance Regional y Barrios Circundantes
                </h3>
                <div className={styles.neighborhoodGrid}>
                  {projectsContentEs.demographics.reachNeighborhoods.map((n) => (
                    <div key={n.name} className={styles.neighborhoodItem}>
                      <h4 className={styles.neighborhoodName}>{n.name}</h4>
                      <div className={styles.neighborhoodStats}>
                        <span>{n.population}</span>
                        <span>•</span>
                        <span>{n.distanceTime}</span>
                      </div>
                      <p className={styles.neighborhoodProfile}>{n.profile}</p>
                    </div>
                  ))}
                </div>
              </article>

              {/* Strategic Insights */}
              <div className={styles.insightsGrid}>
                {projectsContentEs.demographics.strategicInsights.map((insight) => (
                  <article key={insight.title} className={styles.insightCard}>
                    <div className={styles.insightIcon}>
                      <Icon name={insight.icon} />
                    </div>
                    <div className={styles.insightContent}>
                      <h4>{insight.title}</h4>
                      <p>{insight.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Masterplan */}
          <section className={styles.masterplanSection} id="masterplan">
            <div className={styles.sectionHeader}>
              <h2>{projectsContentEs.masterplan.title}</h2>
              <p>{projectsContentEs.masterplan.subtitle}</p>
            </div>

            <div className={styles.masterplanGrid}>
              {projectsContentEs.masterplan.items.map((item) => (
                <article key={item.title} className={styles.masterplanCard}>
                  <div className={styles.masterplanIcon}>
                    <Icon name={item.icon} />
                  </div>
                  <div className={styles.masterplanContent}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Project Phases */}
          <section className={styles.phasesSection} id="phases">
            <div className={styles.sectionHeader}>
              <h2>Fases del Proyecto y Hoja de Ruta</h2>
              <p>
                Mayordomía responsable y gradual a través de hitos legales, arquitectónicos y de construcción.
              </p>
            </div>

            <div className={styles.phasesTimeline}>
              {projectsContentEs.phases.map((phase) => (
                <article
                  key={phase.id}
                  className={`${styles.phaseCard} ${
                    phase.status === "in_progress" ? styles.phaseCardActive : ""
                  }`}
                >
                  <div className={styles.phaseHeader}>
                    <div className={styles.phaseNumberTitle}>
                      <div className={styles.phaseBadgeCircle}>{phase.number}</div>
                      <div>
                        <h3>{phase.title}</h3>
                        <p className={styles.phaseSubtitle}>{phase.subtitle}</p>
                      </div>
                    </div>
                    <span
                      className={`${styles.phaseStatusBadge} ${
                        phase.status === "in_progress"
                          ? styles.statusInProgress
                          : styles.statusUpcoming
                      }`}
                    >
                      {phase.status === "in_progress" && <Icon name="arrow-repeat" />}
                      {phase.statusLabel}
                    </span>
                  </div>

                  <p className={styles.phaseDescription}>{phase.description}</p>

                  <ul className={styles.phaseHighlights}>
                    {phase.highlights.map((h, i) => (
                      <li key={i} className={styles.phaseHighlightItem}>
                        <Icon name="check2" /> {h}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {/* How to Partner & Giving */}
          <section className={styles.givingSection} id="how-to-partner">
            <h2>{projectsContentEs.givingCta.title}</h2>
            <p className={styles.givingSubtitle}>{projectsContentEs.givingCta.subtitle}</p>

            <div className={styles.givingGrid}>
              {/* US Donors via Reliant Mission / Acts 29 */}
              <div className={styles.givingCard}>
                <h3 className={styles.givingCardTitle}>
                  <Icon name="flag-fill" /> {projectsContentEs.givingCta.usaTaxDeductible}
                </h3>
                <p className={styles.givingCardDetail}>
                  {projectsContentEs.givingCta.usaDescription}
                </p>
                <a
                  href={projectsContentEs.givingCta.usaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaContributeBtn}
                  onClick={() => trackReliantDonationConversion()}
                >
                  <Icon name="box-arrow-up-right" /> {projectsContentEs.givingCta.usaButtonLabel}
                </a>
              </div>

              {/* Brazilian Donors / PIX */}
              <div className={styles.givingCard}>
                <h3 className={styles.givingCardTitle}>
                  <Icon name="qr-code-scan" /> Transferencia Bancaria Directa / PIX (Brasil)
                </h3>
                <p className={styles.givingCardDetail}>
                  <strong>Beneficiario:</strong> {projectsContentEs.givingCta.recipient}
                  <br />
                  <strong>Banco:</strong> {projectsContentEs.givingCta.bank}
                  <br />
                  <strong>Agencia:</strong> {projectsContentEs.givingCta.agency} |{" "}
                  <strong>Cuenta:</strong> {projectsContentEs.givingCta.account}
                </p>
                <div className={styles.pixBox}>
                  <span className={styles.pixKeyText}>{projectsContentEs.givingCta.pixKey}</span>
                  <button
                    type="button"
                    className={`${styles.copyPixBtn} ${copiedPix ? styles.copiedState : ""}`}
                    onClick={handleCopyPix}
                    aria-label="Copiar clave PIX"
                  >
                    <Icon name={copiedPix ? "check2" : "copy"} />
                    {copiedPix ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.givingButtons}>
              <Link to="/es/donar/" className={styles.btnFullGive}>
                <Icon name="credit-card" /> Ver Todas las Formas de Donar (SWIFT, Tarjetas y Transferencias)
              </Link>
              <a
                href={projectsContentEs.givingCta.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnTalkPastor}
                onClick={() => trackContactConversion("projects_es_giving_whatsapp")}
              >
                <Icon name="whatsapp" /> Contactar a los Pastores / Liderazgo
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
