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

    ReactGA.initialize(measurementId, {
      gtagOptions: { send_page_view: false }
    });
    initialized.current = true;
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
