import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";

const siteConfig = getSiteConfig();
const measurementId = import.meta.env.VITE_GA_ID || siteConfig.googleAnalyticsId;

export function useAnalytics() {
  const { pathname, search } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined" || !measurementId) {
      return;
    }

    // Skip initial render as the initial page view is handled on load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const pagePath = `${pathname}${search}`;
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_title: document.title,
        send_to: measurementId
      });
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        page_path: pagePath,
        page_title: document.title,
        send_to: measurementId
      });
    }
  }, [pathname, search]);
}
