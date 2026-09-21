import { useState } from "react";
import { Link } from "react-router";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { projectsContent } from "@/content/data/projectsContent";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { TerrainMap } from "./components/TerrainMap";
import { trackContactConversion } from "@/shared/utils/analytics";
import styles from "./ProjectsPage.module.css";

export default function ProjectsPage() {
  const site = getSiteConfig();
  const [copiedPix, setCopiedPix] = useState(false);

  const handleCopyPix = async () => {
    try {
      const text = projectsContent.givingCta.pixRaw;
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
    } catch {
      // Ignore copy error
    }
  };

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: "Futuro Templo da Igreja Cristã Evangélica Jardins - Gleba 01 Fazenda Taboquinha",
    description:
      "Terreno de 24.368 m² adquirido pela ICE Jardins no Jardim Botânico / Tororó (DF) para edificação de seu templo sede, pavilhão de ministério infantil, espaço comunitário e estacionamento.",
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
        title={`Projeto de Edificação do Novo Templo | ${site.title}`}
        description="Subpágina de contribuições da ICE Jardins dedicada ao projeto do terreno e construção do templo na Fazenda Taboquinha (Gleba 01), Jardim Botânico - DF. Dados habitacionais, potencial de alcance, 3D no Google Earth e PIX."
        canonicalPath="/contribuir/edificacao/"
        image="/images/projetos/templo-ice-jardins-conceito.webp"
        jsonLd={projectSchema}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Navegação estrutural" className={styles.breadcrumbNav}>
        <div className="container">
          <ol className={styles.breadcrumbList}>
            <li>
              <Link to="/">Início</Link>
            </li>
            <li>
              <span className={styles.breadcrumbSep}>/</span>
            </li>
            <li>
              <Link to="/contribuir/">Contribua</Link>
            </li>
            <li>
              <span className={styles.breadcrumbSep}>/</span>
            </li>
            <li aria-current="page" className={styles.breadcrumbCurrent}>
              Edificação do Templo (Fazenda Taboquinha)
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.heroBadge}>{projectsContent.hero.badge}</span>
          <h1 className={styles.heroTitle}>{projectsContent.hero.title}</h1>
          <p className={styles.heroSubtitle}>{projectsContent.hero.subtitle}</p>

          <div className={styles.verseBox}>
            <p>{projectsContent.hero.verse}</p>
            <cite>{projectsContent.hero.reference}</cite>
          </div>

          <div className={styles.heroVisualWrapper}>
            <img
              src={projectsContent.hero.image}
              srcSet="/images/projetos/templo-ice-jardins-conceito-640.webp 640w, /images/projetos/templo-ice-jardins-conceito-1040.webp 1040w, /images/projetos/templo-ice-jardins-conceito.webp 1376w"
              sizes="(max-width: 768px) 100vw, 1040px"
              alt="Concepção artística do futuro templo da ICE Jardins no Jardim Botânico, Brasília - DF"
              className={styles.heroImage}
              width={1376}
              height={768}
              loading="eager"
              fetchPriority="high"
            />
            <p className={styles.heroVisualCaption}>
              Concepção arquitetônica conceitual: templo integrado à paisagem e vegetação nativa do
              Cerrado de Brasília.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          {/* Status Real e Transparência: Terreno Sendo Pago */}
          <article className={styles.statusCard} id="status-terreno">
            <span className={styles.statusBadge}>
              <Icon name="clock-history" /> {projectsContent.terrainStatus.badge}
            </span>
            <h2>{projectsContent.terrainStatus.headline}</h2>
            <p className={styles.statusCallout}>{projectsContent.terrainStatus.callout}</p>

            <ul className={styles.statusList}>
              {projectsContent.terrainStatus.details.map((text, idx) => (
                <li key={idx} className={styles.statusItem}>
                  <Icon name="check-circle-fill" className={styles.statusItemIcon} />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <div className={styles.statusActions}>
              <a href="#como-contribuir" className={styles.ctaContributeBtn}>
                <Icon name="heart-fill" /> Contribuir com a Quitação e Construção
              </a>
              <a
                href={projectsContent.givingCta.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaWhatsAppBtn}
                onClick={() => trackContactConversion("projects_talk_pastor")}
              >
                <Icon name="whatsapp" /> Falar com a Liderança
              </a>
            </div>
          </article>

          {/* Ficha Técnica e Mapa Interativo do Terreno com Google Earth */}
          <section className={styles.specsSection} id="mapa-terreno">
            <div className={styles.sectionHeader}>
              <h2>{projectsContent.terrainSpecs.title}</h2>
              <p>{projectsContent.terrainSpecs.subtitle}</p>
            </div>

            <div className={styles.specsGrid}>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Área Total</span>
                <span className={styles.specValue}>{projectsContent.terrainSpecs.areaM2}</span>
                <span className={styles.specDetail}>
                  Equivalente a {projectsContent.terrainSpecs.areaHectares}
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Perímetro</span>
                <span className={styles.specValue}>{projectsContent.terrainSpecs.perimeter}</span>
                <span className={styles.specDetail}>
                  {projectsContent.terrainSpecs.verticesCount} vértices georreferenciados
                </span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Localização</span>
                <span className={styles.specValue}>Gleba 01</span>
                <span className={styles.specDetail}>{projectsContent.terrainSpecs.property}</span>
              </div>
              <div className={styles.specCard}>
                <span className={styles.specLabel}>Região Administrativa</span>
                <span className={styles.specValue}>Jardim Botânico</span>
                <span className={styles.specDetail}>RA XXVII — Brasília / DF</span>
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <TerrainMap
              kmlDownloadUrl={projectsContent.terrainSpecs.kmlDownloadUrl}
              googleEarthUrl={projectsContent.terrainSpecs.googleEarthWebUrl}
              googleMapsUrl={projectsContent.terrainSpecs.googleMapsUrl}
              lang="pt"
            />

            {/* Earth Visualizer & Download Card */}
            <article className={styles.earthActionsCard}>
              <h3 className={styles.earthActionsTitle}>
                <Icon name="globe-americas" /> Visualização no Google Earth e Download do KML
              </h3>
              <p className={styles.earthActionsDesc}>
                Explore o relevo em 3D, a topografia suave e os limites da Gleba 01 adquirida pela
                igreja diretamente no Google Earth ou baixe o arquivo de levantamento topográfico
                cadastral.
              </p>

              <div className={styles.earthButtons}>
                <a
                  href={projectsContent.terrainSpecs.googleEarthWebUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.earthBtnPrimary}
                >
                  <Icon name="box-arrow-up-right" /> Abrir Projeto no Google Earth (3D)
                </a>
                <a
                  href={projectsContent.terrainSpecs.kmlDownloadUrl}
                  download="terreno-ice-jardins-fazenda-taboquinha.kml"
                  className={styles.earthBtnOutline}
                >
                  <Icon name="download" /> Baixar Arquivo KML (.kml)
                </a>
                <a
                  href={projectsContent.terrainSpecs.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.earthBtnOutline}
                >
                  <Icon name="geo-alt" /> Ver no Google Maps
                </a>
              </div>

              <div className={styles.earthGuide}>
                <h4 className={styles.earthGuideTitle}>
                  <Icon name="info-circle" /> {projectsContent.googleEarthGuide.title}
                </h4>
                <ul className={styles.earthGuideList}>
                  {projectsContent.googleEarthGuide.desktopSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </article>
          </section>

          {/* Diagnóstico Habitacional e Potencial de Alcance */}
          <section className={styles.demographicsSection} id="potencial-alcance">
            <div className="container">
              <div className={styles.sectionHeader}>
                <h2>{projectsContent.demographics.title}</h2>
                <p>{projectsContent.demographics.subtitle}</p>
              </div>

              {/* Metric Cards */}
              <div className={styles.metricCardsGrid}>
                {projectsContent.demographics.metrics.map((metric) => (
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
                  <Icon name="compass" /> Bacia de Influência e Comunidades Vizinhas
                </h3>
                <div className={styles.neighborhoodGrid}>
                  {projectsContent.demographics.reachNeighborhoods.map((n) => (
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
                {projectsContent.demographics.strategicInsights.map((insight) => (
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

          {/* Masterplan: O Que Teremos no Complexo */}
          <section className={styles.masterplanSection} id="masterplan">
            <div className={styles.sectionHeader}>
              <h2>{projectsContent.masterplan.title}</h2>
              <p>{projectsContent.masterplan.subtitle}</p>
            </div>

            <div className={styles.masterplanGrid}>
              {projectsContent.masterplan.items.map((item) => (
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

          {/* Fases do Projeto */}
          <section className={styles.phasesSection} id="fases">
            <div className={styles.sectionHeader}>
              <h2>Etapas e Cronograma do Projeto</h2>
              <p>
                Planejamento financeiro, urbanístico e construtivo com passos graduais e
                responsáveis.
              </p>
            </div>

            <div className={styles.phasesTimeline}>
              {projectsContent.phases.map((phase) => (
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

          {/* Seção de Contribuição e Chamado */}
          <section className={styles.givingSection} id="como-contribuir">
            <h2>{projectsContent.givingCta.title}</h2>
            <p className={styles.givingSubtitle}>{projectsContent.givingCta.subtitle}</p>

            <div className={styles.givingGrid}>
              {/* PIX */}
              <div className={styles.givingCard}>
                <h3 className={styles.givingCardTitle}>
                  <Icon name="qr-code-scan" /> Chave PIX (CNPJ)
                </h3>
                <p className={styles.givingCardDetail}>
                  Faça sua contribuição direta e instantânea com qualquer valor para o fundo do
                  terreno e construção.
                </p>
                <div className={styles.pixBox}>
                  <span className={styles.pixKeyText}>{projectsContent.givingCta.pixKey}</span>
                  <button
                    type="button"
                    className={`${styles.copyPixBtn} ${copiedPix ? styles.copiedState : ""}`}
                    onClick={handleCopyPix}
                    aria-label="Copiar chave PIX do projeto"
                  >
                    <Icon name={copiedPix ? "check2" : "copy"} />
                    {copiedPix ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Banco do Brasil */}
              <div className={styles.givingCard}>
                <h3 className={styles.givingCardTitle}>
                  <Icon name="bank" /> Banco do Brasil
                </h3>
                <p className={styles.givingCardDetail}>
                  <strong>Favorecido:</strong> {projectsContent.givingCta.recipient}
                  <br />
                  <strong>Banco:</strong> {projectsContent.givingCta.bank}
                  <br />
                  <strong>Agência:</strong> {projectsContent.givingCta.agency} |{" "}
                  <strong>Conta:</strong> {projectsContent.givingCta.account}
                  <br />
                  <strong>CNPJ:</strong> {projectsContent.givingCta.pixKey}
                </p>
              </div>
            </div>

            <div className={styles.givingButtons}>
              <Link to="/contribuir/" className={styles.btnFullGive}>
                <Icon name="credit-card" /> Ver Todas as Formas de Doação (TED, Exterior e Cartão)
              </Link>
              <a
                href={projectsContent.givingCta.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnTalkPastor}
                onClick={() => trackContactConversion("projects_giving_whatsapp")}
              >
                <Icon name="whatsapp" /> Falar com a Pastoral / Tesouraria
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
