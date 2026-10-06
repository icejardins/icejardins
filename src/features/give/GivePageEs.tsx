import { useState } from "react";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { giveContentEs } from "@/content/data/giveContentEs";
import {
  trackPixDonationConversion,
  trackReliantDonationConversion,
  trackWhatsAppConversion
} from "@/shared/utils/analytics";
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
      {isCopied ? "¡Copiado!" : "Copiar"}
    </button>
  );
}

export default function GivePageEs() {
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
      if (id === "pix-key") {
        trackPixDonationConversion("give_es_copy_pix_key");
      }
    } catch {
      // Ignore copy error
    }
  };

  return (
    <>
      <SeoHead
        title="Diezmos, Ofrendas y Donaciones | Iglesia ICE Jardins"
        description="Apoye los ministerios, la adquisición del terreno y el proyecto de construcción del templo de la Iglesia ICE Jardins en Brasília, Brasil. Donaciones deducibles de impuestos vía Reliant (Acts 29), transferencia internacional SWIFT y PIX."
        canonicalPath="/es/donar/"
      />

      <section className={styles.hero}>
        <div className="container">
          <h1>{giveContentEs.hero.title}</h1>
          <p className={styles.heroSubtitle}>{giveContentEs.hero.subtitle}</p>
          <div className={styles.verseBox}>
            <p>{giveContentEs.hero.verse}</p>
            <cite>{giveContentEs.hero.reference}</cite>
          </div>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          <div className={styles.methodsHeader}>
            <h2>Formas de Contribuir</h2>
            <p>Seleccione la opción más conveniente para su ofrenda o donación.</p>
          </div>

          <div className="row g-4">
            {/* 1. US Donations (Reliant Mission - 501(c)(3)) */}
            <div className="col-lg-6">
              <article className={`${styles.card} ${styles.usaCard}`}>
                <div className={styles.cardHeader}>
                  <h3>
                    <Icon name="flag-fill" />
                    {giveContentEs.usaDonations.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEs.usaDonations.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEs.usaDonations.description}</p>

                <div className="d-flex flex-column align-items-center my-auto py-3">
                  <a
                    href={giveContentEs.usaDonations.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.usaButton}
                    onClick={() => trackReliantDonationConversion()}
                  >
                    <Icon name="box-arrow-up-right" />
                    {giveContentEs.usaDonations.buttonLabel}
                  </a>
                  <p className={styles.usaNote}>{giveContentEs.usaDonations.note}</p>
                </div>
              </article>
            </div>

            {/* 2. International Wire Transfer (SWIFT / IBAN) */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <Icon name="globe2" />
                    {giveContentEs.international.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEs.international.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEs.international.description}</p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Nombre del Beneficiario</span>
                      <span className={styles.infoValueText}>{giveContentEs.international.recipient}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Código SWIFT / BIC</span>
                      <span className={styles.infoValue}>{giveContentEs.international.swift}</span>
                    </div>
                    <CopyButton
                      id="intl-swift"
                      text={giveContentEs.international.swift}
                      label="Copiar Código SWIFT"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>IBAN</span>
                      <span className={styles.infoValue}>{giveContentEs.international.iban}</span>
                    </div>
                    <CopyButton
                      id="intl-iban"
                      text={giveContentEs.international.iban}
                      label="Copiar IBAN"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Agencia y Cuenta</span>
                      <span className={styles.infoValue}>
                        Agencia {giveContentEs.international.agency} / Cta {giveContentEs.international.account} ({giveContentEs.international.bank})
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* 3. PIX (Brazilian Instant Transfer) */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <Icon name="qr-code-scan" />
                    {giveContentEs.pix.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEs.pix.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEs.pix.description}</p>

                <div className={styles.pixContainer}>
                  <div className={styles.qrCodeWrap}>
                    <img
                      src={giveContentEs.pix.qrCodeImage}
                      alt="Código QR PIX - ICE Jardins"
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
                    onClick={() => trackPixDonationConversion("give_es_download_qr")}
                  >
                    <Icon name="download" />
                    Descargar Imagen del Código QR
                  </a>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Clave PIX ({giveContentEs.pix.keyType})</span>
                      <span className={styles.infoValue}>{giveContentEs.pix.formattedKey}</span>
                    </div>
                    <CopyButton
                      id="pix-key"
                      text={giveContentEs.pix.rawKey}
                      label="Copiar Clave PIX"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Beneficiario</span>
                      <span className={styles.infoValueText}>{giveContentEs.pix.recipient}</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* 4. Brazilian Bank Transfer */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <Icon name="bank" />
                    {giveContentEs.bankTransfer.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEs.bankTransfer.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEs.bankTransfer.description}</p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Banco</span>
                      <span className={styles.infoValueText}>{giveContentEs.bankTransfer.bankName}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>CNPJ (RUT / Identificación Fiscal)</span>
                      <span className={styles.infoValue}>{giveContentEs.bankTransfer.cnpj}</span>
                    </div>
                    <CopyButton
                      id="bank-cnpj"
                      text={giveContentEs.bankTransfer.rawCnpj}
                      label="Copiar CNPJ"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Agencia</span>
                      <span className={styles.infoValue}>{giveContentEs.bankTransfer.agency}</span>
                    </div>
                    <CopyButton
                      id="bank-agency"
                      text={giveContentEs.bankTransfer.rawAgency}
                      label="Copiar Número de Agencia"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Cuenta</span>
                      <span className={styles.infoValue}>{giveContentEs.bankTransfer.account}</span>
                    </div>
                    <CopyButton
                      id="bank-account"
                      text={giveContentEs.bankTransfer.rawAccount}
                      label="Copiar Número de Cuenta"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Receipts and Contact */}
          <section className={styles.receiptsBlock}>
            <h3>
              <Icon name="envelope-paper-heart" />
              {giveContentEs.receipts.title}
            </h3>
            <p>{giveContentEs.receipts.description}</p>
            <div className={styles.receiptsActions}>
              <a
                href={`mailto:${giveContentEs.receipts.email}?subject=Comprobante%20de%20Donaci%C3%B3n%20-%20ICE%20Jardins`}
                className={styles.emailBtn}
              >
                <Icon name="envelope" />
                {giveContentEs.receipts.email}
              </a>
              <a
                href={giveContentEs.receipts.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsBtn}
                onClick={() => trackWhatsAppConversion("give_es_receipts")}
              >
                <Icon name="whatsapp" />
                Hablar por WhatsApp
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
