import { useState } from "react";
import { SeoHead } from "@/shared/components/SeoHead";
import { giveContent } from "@/content/data/giveContent";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import styles from "./GivePage.module.css";

export default function GivePage() {
  const site = getSiteConfig();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
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
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2500);
    } catch {
      // Ignore copy error
    }
  };

  return (
    <>
      <SeoHead
        title={`Contribuições e Doações | ${site.title}`}
        description="Contribua com os ministérios e com o projeto do terreno e construção do templo da Igreja Cristã Evangélica Jardins via PIX, Banco do Brasil, SWIFT ou Reliant."
        canonicalPath="/contribuir/"
      />

      <section className={styles.hero}>
        <div className="container">
          <h1>{giveContent.hero.title}</h1>
          <p className={styles.heroSubtitle}>{giveContent.hero.subtitle}</p>
          <div className={styles.verseBox}>
            <p>{giveContent.hero.verse}</p>
            <cite>{giveContent.hero.reference}</cite>
          </div>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          {/* Highlight Vision / Land & Building Project */}
          <article className={styles.projectCard}>
            <span className={styles.projectBadge}>{giveContent.project.badge}</span>
            <h2>{giveContent.project.title}</h2>
            <p className={styles.projectLead}>{giveContent.project.lead}</p>
            <p className={styles.projectBody}>{giveContent.project.body}</p>
            <blockquote className={styles.projectHighlight}>
              {giveContent.project.highlight}
            </blockquote>
          </article>

          <div className={styles.methodsHeader}>
            <h2>Formas de Contribuir</h2>
            <p>Escolha a opção mais conveniente para você realizar a sua contribuição.</p>
          </div>

          <div className="row g-4">
            {/* 1. PIX */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <i className="bi bi-qr-code-scan" aria-hidden="true" />
                    {giveContent.pix.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContent.pix.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContent.pix.description}</p>

                <div className={styles.pixContainer}>
                  <div className={styles.qrCodeWrap}>
                    <img
                      src={giveContent.pix.qrCodeImage}
                      alt="QR Code PIX - ICE Jardins"
                      className={styles.qrCodeImg}
                      width={190}
                      height={190}
                      loading="eager"
                    />
                  </div>
                  <a
                    href={giveContent.pix.qrCodeImage}
                    download="qrcode-pix-icejardins.png"
                    className={styles.downloadQrBtn}
                  >
                    <i className="bi bi-download" aria-hidden="true" />
                    Baixar imagem do QR Code
                  </a>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Chave PIX (CNPJ)</span>
                      <span className={styles.infoValue}>{giveContent.pix.formattedKey}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.copyButton} ${
                        copiedId === "pix-key" ? styles.copiedState : ""
                      }`}
                      onClick={() => handleCopy(giveContent.pix.rawKey, "pix-key")}
                      aria-label="Copiar chave PIX"
                    >
                      <i
                        className={`bi ${
                          copiedId === "pix-key" ? "bi-check2-circle" : "bi-copy"
                        }`}
                        aria-hidden="true"
                      />
                      {copiedId === "pix-key" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Favorecido</span>
                      <span className={styles.infoValueText}>{giveContent.pix.recipient}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Instituição</span>
                      <span className={styles.infoValueText}>{giveContent.pix.bank}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* 2. Transferência Banco do Brasil */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <i className="bi bi-bank" aria-hidden="true" />
                    {giveContent.bankTransfer.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContent.bankTransfer.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContent.bankTransfer.description}</p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Banco</span>
                      <span className={styles.infoValueText}>{giveContent.bankTransfer.bankName}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Favorecido</span>
                      <span className={styles.infoValueText}>{giveContent.bankTransfer.recipient}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>CNPJ</span>
                      <span className={styles.infoValue}>{giveContent.bankTransfer.cnpj}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.copyButton} ${
                        copiedId === "bb-cnpj" ? styles.copiedState : ""
                      }`}
                      onClick={() => handleCopy(giveContent.bankTransfer.rawCnpj, "bb-cnpj")}
                      aria-label="Copiar CNPJ"
                    >
                      <i
                        className={`bi ${
                          copiedId === "bb-cnpj" ? "bi-check2-circle" : "bi-copy"
                        }`}
                        aria-hidden="true"
                      />
                      {copiedId === "bb-cnpj" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Agência</span>
                      <span className={styles.infoValue}>{giveContent.bankTransfer.agency}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.copyButton} ${
                        copiedId === "bb-agency" ? styles.copiedState : ""
                      }`}
                      onClick={() => handleCopy(giveContent.bankTransfer.agency, "bb-agency")}
                      aria-label="Copiar Agência"
                    >
                      <i
                        className={`bi ${
                          copiedId === "bb-agency" ? "bi-check2-circle" : "bi-copy"
                        }`}
                        aria-hidden="true"
                      />
                      {copiedId === "bb-agency" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Conta Corrente</span>
                      <span className={styles.infoValue}>{giveContent.bankTransfer.account}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.copyButton} ${
                        copiedId === "bb-account" ? styles.copiedState : ""
                      }`}
                      onClick={() => handleCopy(giveContent.bankTransfer.account, "bb-account")}
                      aria-label="Copiar Conta"
                    >
                      <i
                        className={`bi ${
                          copiedId === "bb-account" ? "bi-check2-circle" : "bi-copy"
                        }`}
                        aria-hidden="true"
                      />
                      {copiedId === "bb-account" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              </article>
            </div>

            {/* 3. Transferência Internacional (SWIFT / IBAN) */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <i className="bi bi-globe2" aria-hidden="true" />
                    {giveContent.international.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContent.international.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContent.international.description}</p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Nome / Beneficiário</span>
                      <span className={styles.infoValueText}>{giveContent.international.recipient}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Código SWIFT / BIC</span>
                      <span className={styles.infoValue}>{giveContent.international.swift}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.copyButton} ${
                        copiedId === "intl-swift" ? styles.copiedState : ""
                      }`}
                      onClick={() => handleCopy(giveContent.international.swift, "intl-swift")}
                      aria-label="Copiar SWIFT"
                    >
                      <i
                        className={`bi ${
                          copiedId === "intl-swift" ? "bi-check2-circle" : "bi-copy"
                        }`}
                        aria-hidden="true"
                      />
                      {copiedId === "intl-swift" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>IBAN</span>
                      <span className={styles.infoValue}>{giveContent.international.iban}</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.copyButton} ${
                        copiedId === "intl-iban" ? styles.copiedState : ""
                      }`}
                      onClick={() => handleCopy(giveContent.international.iban, "intl-iban")}
                      aria-label="Copiar IBAN"
                    >
                      <i
                        className={`bi ${
                          copiedId === "intl-iban" ? "bi-check2-circle" : "bi-copy"
                        }`}
                        aria-hidden="true"
                      />
                      {copiedId === "intl-iban" ? "Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Agência & Conta</span>
                      <span className={styles.infoValue}>
                        Ag. {giveContent.international.agency} / CC {giveContent.international.account}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* 4. Doações dos Estados Unidos (Reliant) */}
            <div className="col-lg-6">
              <article className={`${styles.card} ${styles.usaCard}`}>
                <div className={styles.cardHeader}>
                  <h3>
                    <i className="bi bi-flag-fill" aria-hidden="true" />
                    {giveContent.usaDonations.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContent.usaDonations.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContent.usaDonations.description}</p>

                <div className="d-flex flex-column align-items-center my-auto py-3">
                  <a
                    href={giveContent.usaDonations.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.usaButton}
                  >
                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                    {giveContent.usaDonations.buttonLabel}
                  </a>
                  <p className={styles.usaNote}>{giveContent.usaDonations.note}</p>
                </div>
              </article>
            </div>
          </div>

          {/* Receipts and Contact */}
          <section className={styles.receiptsBlock}>
            <h3>
              <i className="bi bi-envelope-paper-heart" aria-hidden="true" />
              {giveContent.receipts.title}
            </h3>
            <p>{giveContent.receipts.description}</p>
            <div className={styles.receiptsActions}>
              <a
                href={`mailto:${giveContent.receipts.email}?subject=Comprovante%20de%20Contribuicao`}
                className={styles.emailBtn}
              >
                <i className="bi bi-envelope" aria-hidden="true" />
                {giveContent.receipts.email}
              </a>
              <a
                href={giveContent.receipts.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsBtn}
              >
                <i className="bi bi-whatsapp" aria-hidden="true" />
                Falar pelo WhatsApp
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
