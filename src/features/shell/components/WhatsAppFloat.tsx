import { getSiteConfig } from "@/content/repositories/contentRepository";
import { Icon } from "@/shared/components/Icon";
import { trackAdsConversion } from "@/shared/utils/analytics";
import styles from "./WhatsAppFloat.module.css";

export function WhatsAppFloat() {
  const site = getSiteConfig();
  if (!site.social.whatsapp) {
    return null;
  }

  return (
    <a
      className={styles.button}
      href={site.social.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      title="Fale conosco pelo WhatsApp"
      onClick={() => trackAdsConversion()}
    >
      <Icon name="whatsapp" className={styles.icon} />
    </a>
  );
}
