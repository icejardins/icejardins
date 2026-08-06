import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import ReactGA from "react-ga4";
import { getSiteConfig } from "@/content/repositories/contentRepository";

const siteConfig = getSiteConfig();
const measurementId = import.meta.env.VITE_GA_ID || siteConfig.googleAnalyticsId;

export function useAnalytics() {
  const { pathname, search } = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    if (!measurementId || initialized.current) {
      return;
    }

    const initGA = () => {
      if (initialized.current) return;
      ReactGA.initialize(measurementId, {
        gtagOptions: { send_page_view: false }
      });
      initialized.current = true;

      ReactGA.send({
        hitType: "pageview",
        page: `${pathname}${search}`,
        title: document.title
      });
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
