import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { shouldRedirectToEnglish, shouldRedirectToSpanish } from "@/shared/utils/language";

export function useLanguageAutoDetect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const pathname = location.pathname.replace(/\/+$/, "") || "/";

    if (shouldRedirectToSpanish()) {
      if (pathname === "/") {
        navigate("/es/", { replace: true });
      } else if (pathname === "/contribuir" || pathname === "/contribua" || pathname === "/doacoes" || pathname === "/doe") {
        navigate("/es/donar/", { replace: true });
      } else if (pathname === "/fe") {
        navigate("/es/fe/", { replace: true });
      }
    } else if (shouldRedirectToEnglish()) {
      if (pathname === "/") {
        navigate("/en/", { replace: true });
      } else if (pathname === "/contribuir" || pathname === "/contribua" || pathname === "/doacoes" || pathname === "/doe") {
        navigate("/en/give/", { replace: true });
      } else if (pathname === "/fe") {
        navigate("/en/faith/", { replace: true });
      }
    }
  }, [location.pathname, navigate]);
}
