import { useEffect, type PropsWithChildren } from "react";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import { ThemeProvider } from "@/features/shell/components/ThemeProvider";

function ThemeTokensSync() {
  useEffect(() => {
    const root = document.documentElement;
    const { theme } = getSiteConfig();

    root.style.setProperty("--text-color", theme.textColor);
    root.style.setProperty("--secondary-text-color", theme.secondaryTextColor);
    root.style.setProperty("--text-link-color", theme.textLinkColor);
    root.style.setProperty("--background-color", theme.backgroundColor);
    root.style.setProperty("--secondary-background-color", theme.secondaryBackgroundColor);
    root.style.setProperty("--primary-color", theme.primaryColor);
    root.style.setProperty("--secondary-color", theme.secondaryColor);
  }, []);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <ThemeTokensSync />
      {children}
    </ThemeProvider>
  );
}
