import { useState } from "react";
import { Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { projectsContentEn } from "@/content/data/projectsContentEn";
import { TerrainMap } from "./components/TerrainMap";
import {
  trackContactConversion,
  trackPixDonationConversion,
  trackReliantDonationConversion
} from "@/shared/utils/analytics";
import styles from "./ProjectsPage.module.css";

export default function ProjectsPageEn() {
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = async () => {
    try {
      const text = projectsContentEn.givingCta.pixRaw;
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
      trackPixDonationConversion("projects_en_copy_pix");
    } catch {
      // Ignore copy error
    }
  };

  const projectSchemaEn = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Future Church Campus of ICE Jardins Church — Gleba 01 Fazenda Taboquinha",
    description:
      "A 6-acre (24,368 m²) property purchased by ICE Jardins Church in Jardim Botânico / Tororó (Brasília, Brazil) to build its permanent church campus, children's ministry wing, community spaces, and parking.",
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
        title="Temple Project: Permanent Campus | ICE Jardins Church"
        description="Giving subpage of ICE Jardins Church dedicated to the permanent church campus and temple project at Fazenda Taboquinha, Jardim Botânico, Brasília. Demographics, 3D Google Earth tour, land status, and giving options."
        canonicalPath="/en/give/temple-project/"
        image="/images/projetos/templo-ice-jardins-conceito.webp"
        jsonLd={projectSchemaEn}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumbNav}>
        <div className="container">
          <ol className={styles.breadcrumbList}>
            <li>
              <Link to="/en/">Home</Link>
            </li>
            <li>
              <span className={styles.breadcrumbSep}>/</span>
            </li>
            <li>
              <Link to="/en/give/">Give</Link>
            </li>
            <li>
              <span className={styles.breadcrumbSep}>/</span>
            </li>
            <li aria-current="page" className={styles.breadcrumbCurrent}>
              Temple Project (Fazenda Taboquinha)
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.heroBadge}>{projectsContentEn.hero.badge}</span>
          <h1 className={styles.heroTitle}>{projectsContentEn.hero.title}</h1>
          <p className={styles.heroSubtitle}>{projectsContentEn.hero.subtitle}</p>

          <div className={styles.verseBox}>
            <p>{projectsContentEn.hero.verse}</p>
            <cite>{projectsContentEn.hero.reference}</cite>
          </div>

          <div className={styles.heroVisualWrapper}>
            <img
              src={projectsContentEn.hero.image}
              srcSet="/images/projetos/templo-ice-jardins-conceito-640.webp 640w, /images/projetos/templo-ice-jardins-conceito-1040.webp 1040w, /images/projetos/templo-ice-jardins-conceito.webp 1376w"
              sizes="(max-width: 768px) 100vw, 1040px"
              alt="Architectural concept rendering of the future temple of ICE Jardins in Jardim Botânico, Brasília, Brazil"
              className={styles.heroImage}
              width={1376}
              height={768}
              loading="eager"
              fetchPriority="high"
            />
            <p className={styles.heroVisualCaption}>
              Architectural concept rendering: temple harmoniously integrated with native Cerrado
              vegetation and landscape in Brasília.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          {/* Status and Financial Transparency: Land Being Paid Off */}
          <article className={styles.statusCard} id="land-status">
            <span className={styles.statusBadge}>
              <Icon name="clock-history" /> {projectsContentEn.terrainStatus.badge}
            </span>
            <h2>{projectsContentEn.terrainStatus.headline}</h2>
            <p className={styles.statusCallout}>{projectsContentEn.terrainStatus.callout}</p>

            <ul className={styles.statusList}>
              {projectsContentEn.terrainStatus.details.map((text, idx) => (
                <li key={idx} className={styles.statusItem}>
                  <Icon name="check-circle-fill" className={styles.statusItemIcon} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className={styles.statusActions}>
              <a href="#how-to-partner" className={styles.ctaContributeBtn}>
                <Icon name="heart-fill" /> Partner with the Temple Project
              </a>
              <a
                href={projectsContentEn.givingCta.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaWhatsAppBtn}
                onClick={() => trackContactConversion("projects_en_talk_pastor")}
              >
                <Icon name="whatsapp" /> Contact Leadership
              </a>
            </div>
          </article>

          {/* Specifications and Interactive Map with Google Earth */}
          <section className={styles.specsSection} id="property-map">
            <div className={styles.sectionHeader}>
              <h2>{projectsContentEn.terrainSpecs.title}</h2>
              <p>{projectsContentEn.terrainSpecs.subtitle}</p>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Total Area</span>
                <span className={styles.specValue}>{projectsContentEn.terrainSpecs.areaM2}</span>
                <span className={styles.specDetail}>
                  {projectsContentEn.terrainSpecs.areaHectares}
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Perimeter</span>
                <span className={styles.specValue}>
                  {projectsContentEn.terrainSpecs.perimeter}
                </span>
                <span className={styles.specDetail}>
                  {projectsContentEn.terrainSpecs.verticesCount} georeferenced survey points
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Property Lot</span>
                <span className={styles.specValue}>Gleba 01</span>
                <span className={styles.specDetail}>
                  {projectsContentEn.terrainSpecs.property}
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Administrative Region</span>
                <span className={styles.specValue}>Jardim Botânico</span>
                <span className={styles.specDetail}>RA XXVII — Brasília / DF, Brazil</span>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <TerrainMap
              kmlDownloadUrl={projectsContentEn.terrainSpecs.kmlDownloadUrl}
              googleEarthUrl={projectsContentEn.terrainSpecs.googleEarthWebUrl}
              googleMapsUrl={projectsContentEn.terrainSpecs.googleMapsUrl}
              lang="en"
            />

            {/* Google Earth & KML Download Action Box */}
            <article className={styles.earthActionsCard}>
              <h3 className={styles.earthActionsTitle}>
                <Icon name="globe-americas" /> Google Earth 3D Exploration & KML Download
              </h3>
              <p className={styles.earthActionsDesc}>
                Explore the 3D topography, gentle elevation, and official surveyed boundaries of Gleba
                01 acquired by ICE Jardins directly in Google Earth or download the official survey file.
              </p>

              <div className={styles.earthButtons}>
                <a
                  href={projectsContentEn.terrainSpecs.googleEarthWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.earthBtnPrimary}
                >
                  <Icon name="box-arrow-up-right" /> Open Project in Google Earth (3D)
                </a>
                <a
                  href={projectsContentEn.terrainSpecs.kmlDownloadUrl}
                  download="terreno-ice-jardins-fazenda-taboquinha.kml"
                  className={styles.earthBtnOutline}
                >
                  <Icon name="download" /> Download KML File (.kml)
                </a>
                <a
                  href={projectsContentEn.terrainSpecs.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.earthBtnOutline}
                >
                  <Icon name="geo-alt" /> View in Google Maps
                </a>
              </div>

              <div className={styles.earthGuide}>
                <h4 className={styles.earthGuideTitle}>
                  <Icon name="info-circle" /> {projectsContentEn.googleEarthGuide.title}
                </h4>
                <ul className={styles.earthGuideList}>
                  {projectsContentEn.googleEarthGuide.desktopSteps.map((step, idx) => (
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
                <h2>{projectsContentEn.demographics.title}</h2>
                <p>{projectsContentEn.demographics.subtitle}</p>
              </div>

              {/* Metric Cards */}
              <div className={styles.metricCardsGrid}>
                {projectsContentEn.demographics.metrics.map((metric) => (
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
                  <Icon name="compass" /> Regional Outreach Basin & Surrounding Neighborhoods
                </h3>
                <div className={styles.neighborhoodGrid}>
                  {projectsContentEn.demographics.reachNeighborhoods.map((n) => (
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
                {projectsContentEn.demographics.strategicInsights.map((insight) => (
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
              <h2>{projectsContentEn.masterplan.title}</h2>
              <p>{projectsContentEn.masterplan.subtitle}</p>
            </div>

            <div className={styles.masterplanGrid}>
              {projectsContentEn.masterplan.items.map((item) => (
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
              <h2>Project Phases & Roadmap</h2>
              <p>
                Responsible, phased stewardship across legal, architectural, and construction
                milestones.
              </p>
            </div>

            <div className={styles.phasesTimeline}>
              {projectsContentEn.phases.map((phase) => (
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
            <h2>{projectsContentEn.givingCta.title}</h2>
            <p className={styles.givingSubtitle}>{projectsContentEn.givingCta.subtitle}</p>

            <div className={styles.givingGrid}>
              {/* US Donors via Reliant Mission / Acts 29 */}
              <div className={styles.givingCard}>
                <h3 className={styles.givingCardTitle}>
                  <Icon name="flag-fill" /> {projectsContentEn.givingCta.usaTaxDeductible}
                </h3>
                <p className={styles.givingCardDetail}>
                  {projectsContentEn.givingCta.usaDescription}
                </p>
                <a
                  href={projectsContentEn.givingCta.usaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaContributeBtn}
                  onClick={() => trackReliantDonationConversion()}
                >
                  <Icon name="box-arrow-up-right" /> {projectsContentEn.givingCta.usaButtonLabel}
                </a>
              </div>

              {/* Brazilian Donors / PIX */}
              <div className={styles.givingCard}>
                <h3 className={styles.givingCardTitle}>
                  <Icon name="qr-code-scan" /> Direct Bank Transfer / PIX (Brazil)
                </h3>
                <p className={styles.givingCardDetail}>
                  <strong>Beneficiary:</strong> {projectsContentEn.givingCta.recipient}
                  <br />
                  <strong>Bank:</strong> {projectsContentEn.givingCta.bank}
                  <br />
                  <strong>Agency:</strong> {projectsContentEn.givingCta.agency} |{" "}
                  <strong>Account:</strong> {projectsContentEn.givingCta.account}
                </p>
                <div className={styles.pixBox}>
                  <span className={styles.pixKeyText}>{projectsContentEn.givingCta.pixKey}</span>
                  <button
                    type="button"
                    className={`${styles.copyPixBtn} ${copiedPix ? styles.copiedState : ""}`}
                    onClick={handleCopyPix}
                    aria-label="Copy PIX key"
                  >
                    <Icon name={copiedPix ? "check2" : "copy"} />
                    {copiedPix ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.givingButtons}>
              <Link to="/en/give/" className={styles.btnFullGive}>
                <Icon name="credit-card" /> View All Giving Options (SWIFT, Cards & Wire)
              </Link>
              <a
                href={projectsContentEn.givingCta.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnTalkPastor}
                onClick={() => trackContactConversion("projects_en_giving_whatsapp")}
              >
                <Icon name="whatsapp" /> Contact Pastors / Leadership
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
