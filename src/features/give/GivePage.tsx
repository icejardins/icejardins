import { useState } from "react";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { giveContent } from "@/content/data/giveContent";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import styles from "./GivePage.module.css";

function CopyButton({
  id,
  text,
  label,
  copiedId,
  onCopy
}: {
  id: string;
  text: string;
  label: string;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}) {
  const isCopied = copiedId === id;
  return (
    <button
      type="button"
      className={`${styles.copyButton} ${isCopied ? styles.copiedState : ""}`}
      onClick={() => onCopy(text, id)}
      aria-label={label}
    >
      <Icon name={isCopied ? "check2-circle" : "copy"} />
      {isCopied ? "Copiado!" : "Copiar"}
    </button>
  );
}

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
            {giveContent.project.paragraphs.map((text, idx) => (
              <p
                key={idx}
                className={idx === 0 ? styles.projectLead : styles.projectBody}
              >
                {text}
              </p>
            ))}
            <div className={styles.projectHighlight}>
              <strong>{giveContent.project.callout}</strong>
            </div>
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
                    <Icon name="qr-code-scan" />
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
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <a
                    href="/images/doacoes/qrcode-pix.png"
                    download="qrcode-pix-icejardins.png"
                    className={styles.downloadQrBtn}
                  >
                    <Icon name="download" />
                    Baixar imagem do QR Code
                  </a>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Chave PIX (CNPJ)</span>
                      <span className={styles.infoValue}>{giveContent.pix.formattedKey}</span>
                    </div>
                    <CopyButton
                      id="pix-key"
                      text={giveContent.pix.rawKey}
                      label="Copiar chave PIX"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
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
                    <Icon name="bank" />
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
                    <CopyButton
                      id="bb-cnpj"
                      text={giveContent.bankTransfer.rawCnpj}
                      label="Copiar CNPJ"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Agência</span>
                      <span className={styles.infoValue}>{giveContent.bankTransfer.agency}</span>
                    </div>
                    <CopyButton
                      id="bb-agency"
                      text={giveContent.bankTransfer.agency}
                      label="Copiar Agência"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Conta Corrente</span>
                      <span className={styles.infoValue}>{giveContent.bankTransfer.account}</span>
                    </div>
                    <CopyButton
                      id="bb-account"
                      text={giveContent.bankTransfer.account}
                      label="Copiar Conta"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>
                </div>
              </article>
            </div>

            {/* 3. Transferência Internacional (SWIFT / IBAN) */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <Icon name="globe2" />
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
                    <CopyButton
                      id="intl-swift"
                      text={giveContent.international.swift}
                      label="Copiar SWIFT"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>IBAN</span>
                      <span className={styles.infoValue}>{giveContent.international.iban}</span>
                    </div>
                    <CopyButton
                      id="intl-iban"
                      text={giveContent.international.iban}
                      label="Copiar IBAN"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
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
                    <Icon name="flag-fill" />
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
                    <Icon name="box-arrow-up-right" />
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
              <Icon name="envelope-paper-heart" />
              {giveContent.receipts.title}
            </h3>
            <p>{giveContent.receipts.description}</p>
            <div className={styles.receiptsActions}>
              <a
                href={`mailto:${giveContent.receipts.email}?subject=Comprovante%20de%20Contribuicao`}
                className={styles.emailBtn}
              >
                <Icon name="envelope" />
                {giveContent.receipts.email}
              </a>
              <a
                href={giveContent.receipts.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsBtn}
              >
                <Icon name="whatsapp" />
                Falar pelo WhatsApp
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
