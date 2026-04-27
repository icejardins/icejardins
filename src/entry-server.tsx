import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles/main.css";
import { AppProviders } from "@/app/AppProviders";
import { AppRoutesStatic } from "@/app/AppRoutesStatic";

export async function render(url: string) {
  const helmetContext: { helmet?: any } = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AppProviders>
          <AppRoutesStatic />
        </AppProviders>
      </StaticRouter>
    </HelmetProvider>
  );

  const headTags = [
    helmetContext.helmet?.title?.toString?.() ?? "",
    helmetContext.helmet?.meta?.toString?.() ?? "",
    helmetContext.helmet?.link?.toString?.() ?? ""
  ].join("");

  return {
    appHtml,
    headTags
  };
}
