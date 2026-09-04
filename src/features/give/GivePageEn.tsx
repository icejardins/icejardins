import { useState } from "react";
import { SeoHead } from "@/shared/components/SeoHead";
import { Icon } from "@/shared/components/Icon";
import { giveContentEn } from "@/content/data/giveContentEn";
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
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function GivePageEn() {
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
        title="Tithes, Offerings & Giving | ICE Jardins Church"
        description="Partner with the ministries, land acquisition, and church building project of ICE Jardins Church in Brasília, Brazil. Tax-deductible giving available for US donors via Reliant (Acts 29), plus international SWIFT and PIX."
        canonicalPath="/en/give/"
      />

      <section className={styles.hero}>
        <div className="container">
          <h1>{giveContentEn.hero.title}</h1>
          <p className={styles.heroSubtitle}>{giveContentEn.hero.subtitle}</p>
          <div className={styles.verseBox}>
            <p>{giveContentEn.hero.verse}</p>
            <cite>{giveContentEn.hero.reference}</cite>
          </div>
        </div>
      </section>

      <section className={styles.pageSection}>
        <div className="container">
          {/* Highlight Vision / Land & Building Project */}
          <article className={styles.projectCard}>
            <span className={styles.projectBadge}>{giveContentEn.project.badge}</span>
            <h2>{giveContentEn.project.title}</h2>
            {giveContentEn.project.paragraphs.map((text, idx) => (
              <p
                key={idx}
                className={idx === 0 ? styles.projectLead : styles.projectBody}
              >
                {text}
              </p>
            ))}
            <div className={styles.projectHighlight}>
              <strong>{giveContentEn.project.callout}</strong>
            </div>
          </article>

          <div className={styles.methodsHeader}>
            <h2>Ways to Give</h2>
            <p>Choose the option that is most convenient for your contribution.</p>
          </div>

          <div className="row g-4">
            {/* 1. US Donations (Reliant Mission - 501(c)(3)) */}
            <div className="col-lg-6">
              <article className={`${styles.card} ${styles.usaCard}`}>
                <div className={styles.cardHeader}>
                  <h3>
                    <Icon name="flag-fill" />
                    {giveContentEn.usaDonations.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEn.usaDonations.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEn.usaDonations.description}</p>

                <div className="d-flex flex-column align-items-center my-auto py-3">
                  <a
                    href={giveContentEn.usaDonations.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.usaButton}
                  >
                    <Icon name="box-arrow-up-right" />
                    {giveContentEn.usaDonations.buttonLabel}
                  </a>
                  <p className={styles.usaNote}>{giveContentEn.usaDonations.note}</p>
                </div>
              </article>
            </div>

            {/* 2. International Wire Transfer (SWIFT / IBAN) */}
            <div className="col-lg-6">
              <article className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>
                    <Icon name="globe2" />
                    {giveContentEn.international.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEn.international.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEn.international.description}</p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Beneficiary Name</span>
                      <span className={styles.infoValueText}>{giveContentEn.international.recipient}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>SWIFT / BIC Code</span>
                      <span className={styles.infoValue}>{giveContentEn.international.swift}</span>
                    </div>
                    <CopyButton
                      id="intl-swift"
                      text={giveContentEn.international.swift}
                      label="Copy SWIFT Code"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>IBAN</span>
                      <span className={styles.infoValue}>{giveContentEn.international.iban}</span>
                    </div>
                    <CopyButton
                      id="intl-iban"
                      text={giveContentEn.international.iban}
                      label="Copy IBAN"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Branch & Account</span>
                      <span className={styles.infoValue}>
                        Branch {giveContentEn.international.agency} / Acct {giveContentEn.international.account} ({giveContentEn.international.bank})
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
                    {giveContentEn.pix.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEn.pix.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEn.pix.description}</p>

                <div className={styles.pixContainer}>
                  <div className={styles.qrCodeWrap}>
                    <img
                      src={giveContentEn.pix.qrCodeImage}
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
                    Download QR Code Image
                  </a>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>PIX Key ({giveContentEn.pix.keyType})</span>
                      <span className={styles.infoValue}>{giveContentEn.pix.formattedKey}</span>
                    </div>
                    <CopyButton
                      id="pix-key"
                      text={giveContentEn.pix.rawKey}
                      label="Copy PIX Key"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Beneficiary</span>
                      <span className={styles.infoValueText}>{giveContentEn.pix.recipient}</span>
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
                    {giveContentEn.bankTransfer.title}
                  </h3>
                  <span className={styles.cardBadge}>{giveContentEn.bankTransfer.badge}</span>
                </div>
                <p className={styles.cardDescription}>{giveContentEn.bankTransfer.description}</p>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Bank</span>
                      <span className={styles.infoValueText}>{giveContentEn.bankTransfer.bankName}</span>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>CNPJ (Tax ID)</span>
                      <span className={styles.infoValue}>{giveContentEn.bankTransfer.cnpj}</span>
                    </div>
                    <CopyButton
                      id="bank-cnpj"
                      text={giveContentEn.bankTransfer.rawCnpj}
                      label="Copy CNPJ"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Branch</span>
                      <span className={styles.infoValue}>{giveContentEn.bankTransfer.agency}</span>
                    </div>
                    <CopyButton
                      id="bank-agency"
                      text={giveContentEn.bankTransfer.rawAgency}
                      label="Copy Branch Number"
                      copiedId={copiedId}
                      onCopy={handleCopy}
                    />
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Account</span>
                      <span className={styles.infoValue}>{giveContentEn.bankTransfer.account}</span>
                    </div>
                    <CopyButton
                      id="bank-account"
                      text={giveContentEn.bankTransfer.rawAccount}
                      label="Copy Account Number"
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
              {giveContentEn.receipts.title}
            </h3>
            <p>{giveContentEn.receipts.description}</p>
            <div className={styles.receiptsActions}>
              <a
                href={`mailto:${giveContentEn.receipts.email}?subject=Donation%20Receipt%20-%20ICE%20Jardins`}
                className={styles.emailBtn}
              >
                <Icon name="envelope" />
                {giveContentEn.receipts.email}
              </a>
              <a
                href={giveContentEn.receipts.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsBtn}
              >
                <Icon name="whatsapp" />
                Chat on WhatsApp
              </a>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
