import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { shouldRedirectToEnglish } from "@/shared/utils/language";

export function useLanguageAutoDetect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const pathname = location.pathname.replace(/\/+$/, "") || "/";

    // Only auto-redirect root and contribute routes if user should see English
    if (shouldRedirectToEnglish()) {
      if (pathname === "/") {
        navigate("/en/", { replace: true });
      } else if (pathname === "/contribuir" || pathname === "/contribua" || pathname === "/doacoes" || pathname === "/doe") {
        navigate("/en/give/", { replace: true });
      }
    }
  }, [location.pathname, navigate]);
}
