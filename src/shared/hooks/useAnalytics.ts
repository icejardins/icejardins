import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import ReactGA from "react-ga4";
import { getSiteConfig } from "@/content/repositories/contentRepository";

const siteConfig = getSiteConfig();
const measurementId = import.meta.env.VITE_GA_ID || siteConfig.googleAnalyticsId;
const googleAdsId = import.meta.env.VITE_GADS_ID || siteConfig.googleAdsId;

export function useAnalytics() {
  const { pathname, search } = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if ((!measurementId && !googleAdsId) || initialized.current) {
      return;
    }

    const initGA = () => {
      if (initialized.current) return;

      const trackers: Array<{ trackingId: string; gtagOptions?: Record<string, unknown> }> = [];
      if (measurementId) {
        trackers.push({ trackingId: measurementId, gtagOptions: { send_page_view: false } });
      }
      if (googleAdsId) {
        trackers.push({ trackingId: googleAdsId });
      }

      ReactGA.initialize(trackers);
      initialized.current = true;

      if (measurementId) {
        ReactGA.send({
          hitType: "pageview",
          page: `${pathname}${search}`,
          title: document.title
        });
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = window.requestIdleCallback(initGA, { timeout: 2500 });
      return () => window.cancelIdleCallback(handle);
    }

    const timer = setTimeout(initGA, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialized.current) {
      return;
    }

    ReactGA.send({
      hitType: "pageview",
      page: `${pathname}${search}`,
      title: document.title
    });
  }, [pathname, search]);
}
