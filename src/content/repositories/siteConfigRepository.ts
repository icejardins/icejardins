import type { SiteConfig } from "@/core/types/content";
import siteConfigJson from "@/content/generated/site-config.json";

const siteConfig = siteConfigJson as SiteConfig;

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}
