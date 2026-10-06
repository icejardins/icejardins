import { Icon } from "@/shared/components/Icon";
import styles from "./SermonTranslator.module.css";

export interface SermonTranslatorProps {
  currentLang: "pt" | "en" | "es";
  isLoading: boolean;
  loadingTargetLang?: "en" | "es" | null;
  error: string | null;
  onSelectLanguage: (lang: "pt" | "en" | "es") => void;
  onRetry?: () => void;
  fallbackUrl?: string;
  suggestedLang?: "en" | "es" | null;
  onDismissSuggestion?: () => void;
}

export function SermonTranslator({
  currentLang,
  isLoading,
  loadingTargetLang,
  error,
  onSelectLanguage,
  onRetry,
  fallbackUrl,
  suggestedLang,
  onDismissSuggestion
}: SermonTranslatorProps) {
  const loadingMessage =
    loadingTargetLang === "es"
      ? "Traduciendo sermón al español... Por favor espere un momento."
      : "Translating sermon to English... Please wait a moment.";

  return (
    <section className={styles.translatorBox} aria-label="Tradução do sermão">
      <div className={styles.controlsRow}>
        <div className={styles.labelGroup}>
          <span className={styles.labelIcon} aria-hidden="true">
            <Icon name="globe2" />
          </span>
          <span>
            {currentLang === "es"
              ? "Idioma del sermón:"
              : currentLang === "en"
              ? "Sermon language:"
              : "Idioma do estudo:"}
          </span>
        </div>

        <div className={styles.buttonGroup} role="group" aria-label="Opções de idioma">
          <button
            type="button"
            className={`${styles.langBtn} ${currentLang === "pt" ? styles.langBtnActive : ""}`}
            onClick={() => onSelectLanguage("pt")}
            disabled={isLoading}
            aria-pressed={currentLang === "pt"}
          >
            <span className={styles.flag} aria-hidden="true">🇧🇷</span>
            <span>Português</span>
          </button>

          <button
            type="button"
            className={`${styles.langBtn} ${currentLang === "en" ? styles.langBtnActive : ""}`}
            onClick={() => onSelectLanguage("en")}
            disabled={isLoading}
            aria-pressed={currentLang === "en"}
          >
            <span className={styles.flag} aria-hidden="true">🇺🇸</span>
            <span>English</span>
          </button>

          <button
            type="button"
            className={`${styles.langBtn} ${currentLang === "es" ? styles.langBtnActive : ""}`}
            onClick={() => onSelectLanguage("es")}
            disabled={isLoading}
            aria-pressed={currentLang === "es"}
          >
            <span className={styles.flag} aria-hidden="true">🇪🇸</span>
            <span>Español</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loadingRow} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <span>{loadingMessage}</span>
        </div>
      )}

      {error && !isLoading && (
        <div className={styles.errorRow} role="alert">
          <span>{error}</span>
          <div className={styles.errorActions}>
            {onRetry && (
              <button type="button" onClick={onRetry} className={styles.retryBtn}>
                Tentar novamente
              </button>
            )}
            {fallbackUrl && (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                Abrir no Google Tradutor ↗
              </a>
            )}
          </div>
        </div>
      )}

      {currentLang === "pt" && suggestedLang && !isLoading && !error && (
        <div className={styles.suggestionPrompt}>
          <span>
            {suggestedLang === "es"
              ? "¿Prefieres leer este sermón en español?"
              : "Prefer to read this sermon in English?"}
          </span>
          <div style={{ display: "inline-flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => onSelectLanguage(suggestedLang)}
              className={styles.suggestionBtn}
            >
              {suggestedLang === "es" ? "Traducir a Español" : "Translate to English"}
            </button>
            {onDismissSuggestion && (
              <button
                type="button"
                onClick={onDismissSuggestion}
                className={styles.resetBtn}
                style={{ fontSize: "0.8rem" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {currentLang !== "pt" && !isLoading && !error && (
        <div className={styles.noticeRow}>
          <div className={styles.noticeText}>
            <Icon name="info-circle" />
            <span>
              {currentLang === "es"
                ? "Traducción generada bajo demanda vía IA. El audio y video originales fueron predicados en portugués."
                : "Automated AI translation generated on demand. Original sermon preached in Portuguese."}
            </span>
          </div>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => onSelectLanguage("pt")}
          >
            {currentLang === "es" ? "Restablecer a Português" : "Reset to Portuguese"}
          </button>
        </div>
      )}
    </section>
  );
}
