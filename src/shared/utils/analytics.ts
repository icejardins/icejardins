import { getSiteConfig } from "@/content/repositories/contentRepository";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const DEFAULT_ADS_CONVERSION_SEND_TO = "AW-672119654/J5EqCJCKyOsZEOb2vsAC";

export interface ConversionOptions {
  sendTo?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  [key: string]: unknown;
}

/**
 * Dispara o evento de conversão do Google Ads via gtag.
 */
export function trackAdsConversion(options?: ConversionOptions) {
  if (typeof window === "undefined") {
    return;
  }

  const siteConfig = getSiteConfig();
  const sendTo =
    options?.sendTo ||
    siteConfig.googleAdsConversionSendTo ||
    DEFAULT_ADS_CONVERSION_SEND_TO;

  const { sendTo: _ignored, ...restOptions } = options || {};

  const payload: Record<string, unknown> = {
    send_to: sendTo,
    ...restOptions
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", payload);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "conversion",
      ...payload
    });
  }
}
