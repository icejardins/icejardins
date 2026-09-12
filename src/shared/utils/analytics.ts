import { getSiteConfig } from "@/content/repositories/contentRepository";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __loadAnalytics?: () => void;
  }
}

// Google Ads Conversion Labels
export const ADS_CONVERSION_EBOOK = "AW-672119654/o57hCLe8nfEcEOb2vsAC";
export const ADS_CONVERSION_RELIANT = "AW-672119654/-LRrCKSqtPQcEOb2vsAC";
export const ADS_CONVERSION_WHATSAPP = "AW-672119654/dO8MCKeqtPQcEOb2vsAC";
export const ADS_CONVERSION_PAGEVIEW = "AW-672119654/J5EqCJCKyOsZEOb2vsAC";

export const DEFAULT_ADS_CONVERSION_SEND_TO = ADS_CONVERSION_EBOOK;

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

  if (typeof window.__loadAnalytics === "function") {
    window.__loadAnalytics();
  } else {
    window.dispatchEvent(new Event("load-analytics"));
  }

  const siteConfig = getSiteConfig();
  const sendTo =
    options?.sendTo ||
    siteConfig.googleAdsConversions?.ebookDownload ||
    siteConfig.googleAdsConversionSendTo ||
    DEFAULT_ADS_CONVERSION_SEND_TO;

  const { sendTo: _ignored, ...restOptions } = options || {};

  const payload: Record<string, unknown> = {
    send_to: sendTo,
    ...restOptions
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", payload);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", "conversion", payload]);
  }
}

/**
 * Rastreia conversão de download de e-book (Lead Form) no Google Ads
 */
export function trackEbookConversion(ebookTitle?: string) {
  const siteConfig = getSiteConfig();
  const sendTo = siteConfig.googleAdsConversions?.ebookDownload || ADS_CONVERSION_EBOOK;
  trackAdsConversion({
    sendTo,
    value: 1.0,
    currency: "BRL",
    resource_title: ebookTitle
  });
}

/**
 * Rastreia clique de doação internacional / EUA via Reliant no Google Ads
 */
export function trackReliantDonationConversion() {
  const siteConfig = getSiteConfig();
  const sendTo = siteConfig.googleAdsConversions?.reliantDonation || ADS_CONVERSION_RELIANT;
  trackAdsConversion({
    sendTo,
    value: 50.0,
    currency: "USD"
  });
}

/**
 * Rastreia clique de contato (WhatsApp / Recepção / E-mail) no Google Ads
 */
export function trackContactConversion(origin?: string) {
  const siteConfig = getSiteConfig();
  const sendTo = siteConfig.googleAdsConversions?.whatsAppContact || ADS_CONVERSION_WHATSAPP;
  trackAdsConversion({
    sendTo,
    value: 5.0,
    currency: "BRL",
    contact_origin: origin
  });
}

/**
 * Alias semântico para contato via WhatsApp
 */
export const trackWhatsAppConversion = trackContactConversion;
