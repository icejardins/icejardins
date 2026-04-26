import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/main.css";
import { AppProviders } from "@/app/AppProviders";
import { AppRoutes } from "@/app/AppRoutes";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento root não encontrado.");
}

const app = (
  <HelmetProvider>
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </BrowserRouter>
  </HelmetProvider>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
