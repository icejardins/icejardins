import { Link, NavLink, useLocation, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { getSiteConfig } from "@/content/repositories/siteConfigRepository";
import { useTheme } from "@/features/shell/components/ThemeProvider";
import { setLanguagePreference } from "@/shared/utils/language";
import type { SearchDocument } from "@/core/types/content";
import styles from "./Header.module.css";

function normalizeRoute(route: string) {
  if (!route) {
    return "/";
  }

  if (route === "/") {
    return route;
  }

  return route.endsWith("/") ? route.slice(0, -1) : route;
}

export function Header() {
  const site = getSiteConfig();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchDocs, setSearchDocs] = useState<SearchDocument[]>([]);
  const [isSearchReady, setIsSearchReady] = useState(false);
  const [hasRequestedSearch, setHasRequestedSearch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const langParam = searchParams.get("lang");
  const isSermonDetail =
    location.pathname.startsWith("/posts/") &&
    location.pathname !== "/posts/" &&
    location.pathname !== "/posts";
  const isEnglish = isSermonDetail ? langParam === "en" : location.pathname.startsWith("/en");
  const isSpanish = isSermonDetail ? langParam === "es" : location.pathname.startsWith("/es");
  const currentLang: "pt" | "en" | "es" = isSpanish ? "es" : isEnglish ? "en" : "pt";

  const menuItems = isSpanish
    ? [
        { name: "Inicio", url: "/es/" },
        { name: "Nosotros", url: "/es/#about" },
        { name: "Lo que creemos", url: "/es/fe/" },
        { name: "Proyecto del Templo", url: "/es/donar/proyecto-templo/" },
        { name: "Sermones", url: "/es/sermones/" },
        { name: "Visita", url: "/visita/" },
        { name: "Donar", url: "/es/donar/" }
      ]
    : isEnglish
    ? [
        { name: "Home", url: "/en/" },
        { name: "About", url: "/en/#about" },
        { name: "What We Believe", url: "/en/faith/" },
        { name: "Temple Project", url: "/en/give/temple-project/" },
        { name: "Sermons", url: "/en/sermons/" },
        { name: "Visit", url: "/visita/" },
        { name: "Give", url: "/en/give/" }
      ]
    : site.menu;

  const handleLanguageChange = (targetLang: "pt" | "en" | "es") => {
    setLanguagePreference(targetLang);

    // 1. Sermon List page
    if (
      location.pathname === "/posts" ||
      location.pathname === "/posts/" ||
      location.pathname.startsWith("/en/sermons") ||
      location.pathname.startsWith("/es/sermones")
    ) {
      if (targetLang === "es") {
        navigate("/es/sermones/");
      } else if (targetLang === "en") {
        navigate("/en/sermons/");
      } else {
        navigate("/posts/");
      }
      return;
    }

    // 2. Sermon Detail page
    if (isSermonDetail) {
      if (targetLang === "es") {
        navigate(`${location.pathname}?lang=es`);
      } else if (targetLang === "en") {
        navigate(`${location.pathname}?lang=en`);
      } else {
        navigate(location.pathname);
      }
      return;
    }

    if (targetLang === "es") {
      if (
        location.pathname.startsWith("/contribuir/projeto-templo") ||
        location.pathname.startsWith("/contribuir/edificacao") ||
        location.pathname.startsWith("/projetos") ||
        location.pathname.startsWith("/en/give/temple-project") ||
        location.pathname.startsWith("/en/give/building-project") ||
        location.pathname.startsWith("/en/projects")
      ) {
        navigate("/es/donar/proyecto-templo/");
      } else if (
        location.pathname.startsWith("/contribuir") ||
        location.pathname.startsWith("/doacoes") ||
        location.pathname.startsWith("/doe") ||
        location.pathname.startsWith("/en/give")
      ) {
        navigate("/es/donar/");
      } else if (
        location.pathname.startsWith("/fe") ||
        location.pathname.startsWith("/en/faith")
      ) {
        navigate("/es/fe/");
      } else {
        navigate("/es/");
      }
    } else if (targetLang === "en") {
      if (
        location.pathname.startsWith("/contribuir/projeto-templo") ||
        location.pathname.startsWith("/contribuir/edificacao") ||
        location.pathname.startsWith("/projetos") ||
        location.pathname.startsWith("/es/donar/proyecto-templo") ||
        location.pathname.startsWith("/es/donar/proyecto-edificacion") ||
        location.pathname.startsWith("/es/proyectos")
      ) {
        navigate("/en/give/temple-project/");
      } else if (
        location.pathname.startsWith("/contribuir") ||
        location.pathname.startsWith("/doacoes") ||
        location.pathname.startsWith("/doe") ||
        location.pathname.startsWith("/es/donar")
      ) {
        navigate("/en/give/");
      } else if (
        location.pathname.startsWith("/fe") ||
        location.pathname.startsWith("/es/fe")
      ) {
        navigate("/en/faith/");
      } else {
        navigate("/en/");
      }
    } else {
      if (
        location.pathname.startsWith("/en/give/temple-project") ||
        location.pathname.startsWith("/en/give/building-project") ||
        location.pathname.startsWith("/en/projects") ||
        location.pathname.startsWith("/en/projetos") ||
        location.pathname.startsWith("/es/donar/proyecto-templo") ||
        location.pathname.startsWith("/es/donar/proyecto-edificacion") ||
        location.pathname.startsWith("/es/proyectos")
      ) {
        navigate("/contribuir/projeto-templo/");
      } else if (
        location.pathname.startsWith("/en/give") ||
        location.pathname.startsWith("/es/donar")
      ) {
        navigate("/contribuir/");
      } else if (
        location.pathname.startsWith("/en/faith") ||
        location.pathname.startsWith("/es/fe")
      ) {
        navigate("/fe/");
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!hasRequestedSearch) {
      return;
    }

    async function loadSearchIndex() {
      try {
        const response = await fetch("/search-index.json");
        if (!response.ok) {
          throw new Error(`Cannot load search index: ${response.status}`);
        }

        const docs = (await response.json()) as SearchDocument[];
        setSearchDocs(docs);
      } catch {
        setSearchDocs([]);
      } finally {
        setIsSearchReady(true);
      }
    }

    loadSearchIndex();
  }, [hasRequestedSearch]);

  const handleSearchInteraction = () => {
    if (!hasRequestedSearch) {
      setHasRequestedSearch(true);
    }
  };

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return searchDocs
      .filter((doc) => {
        const haystack = `${doc.title} ${doc.description} ${doc.content}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [query, searchDocs]);

  const showSearch = query.trim().length > 0;
  const brandLogoSrc =
    theme === "light" ? "/images/logo-ice-jardins-01.webp" : "/images/logo-ice-jardins-03.webp";

  return (
    <header className={styles.wrapper} id="site-header">
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`} aria-label={isSpanish ? "Navegación principal" : isEnglish ? "Main navigation" : "Navegação principal"}>
        <div className="container-fluid px-3 px-lg-5">
          <Link className={`navbar-brand ${styles.brand}`} to={isSpanish ? "/es/" : isEnglish ? "/en/" : "/"} aria-label={isSpanish ? "Página de inicio ICE Jardins" : isEnglish ? "ICE Jardins Home page" : "Página inicial ICE Jardins"}>
            <img
              src={brandLogoSrc}
              alt="ICE Jardins"
              className={styles.brandLogo}
              width={180}
              height={77}
              loading="eager"
              fetchPriority="high"
            />
          </Link>

          <button
            type="button"
            className="navbar-toggler"
            aria-controls="navbar-content"
            aria-expanded={isOpen}
            aria-label={isSpanish ? "Abrir menú" : isEnglish ? "Open menu" : "Abrir menu"}
            onClick={() => setIsOpen((current) => !current)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbar-content">
            <ul className={`navbar-nav ms-auto ${styles.menu}`}>
              {menuItems.map((item) => (
                <li key={item.url} className="nav-item">
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      [
                        "nav-link",
                        styles.navLink,
                        isActive || normalizeRoute(location.pathname) === normalizeRoute(item.url)
                          ? styles.navLinkActive
                          : ""
                      ]
                        .filter(Boolean)
                        .join(" ")
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
              <li className="nav-item d-flex align-items-center">
                <button
                  type="button"
                  className={styles.themeButton}
                  onClick={toggleTheme}
                  aria-label={
                    theme === "dark"
                      ? isSpanish
                        ? "Tema Claro - Cambiar tema"
                        : isEnglish
                          ? "Light theme - Toggle theme"
                          : "Tema Claro - Alternar tema"
                      : isSpanish
                        ? "Tema Oscuro - Cambiar tema"
                        : isEnglish
                          ? "Dark theme - Toggle theme"
                          : "Tema Escuro - Alternar tema"
                  }
                >
                  {theme === "dark"
                    ? isSpanish
                      ? "Claro"
                      : isEnglish
                        ? "Light"
                        : "Claro"
                    : isSpanish
                      ? "Oscuro"
                      : isEnglish
                        ? "Dark"
                        : "Escuro"}
                </button>
              </li>
              <li className="nav-item d-flex align-items-center">
                <div className={styles.langSwitcher} role="group" aria-label="Language selector">
                  <button
                    type="button"
                    className={`${styles.langBtn} ${currentLang === "pt" ? styles.langBtnActive : ""}`}
                    onClick={() => handleLanguageChange("pt")}
                    aria-label="PT - Versão em Português"
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    className={`${styles.langBtn} ${currentLang === "en" ? styles.langBtnActive : ""}`}
                    onClick={() => handleLanguageChange("en")}
                    aria-label="EN - English version"
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    className={`${styles.langBtn} ${currentLang === "es" ? styles.langBtnActive : ""}`}
                    onClick={() => handleLanguageChange("es")}
                    aria-label="ES - Versión en Español"
                  >
                    ES
                  </button>
                </div>
              </li>
            </ul>
            <div className={styles.searchBox}>
              <label htmlFor="site-search" className="visually-hidden">
                {isSpanish ? "Buscar contenido" : isEnglish ? "Search content" : "Buscar conteúdo"}
              </label>
              <input
                id="site-search"
                type="search"
                className="form-control"
                placeholder={isSpanish ? "Buscar sermones y páginas" : isEnglish ? "Search sermons and pages" : "Buscar sermões e páginas"}
                value={query}
                onFocus={handleSearchInteraction}
                onPointerDown={handleSearchInteraction}
                onChange={(event) => {
                  handleSearchInteraction();
                  setQuery(event.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </nav>

      {showSearch ? (
        <section
          className={styles.searchResults}
          aria-live="polite"
          aria-label={isSpanish ? "Resultados de la búsqueda" : isEnglish ? "Search results" : "Resultados da busca"}
        >
          <div className="container py-3">
            {!isSearchReady ? (
              <p className="mb-0">
                {isSpanish ? "Cargando índice de búsqueda..." : isEnglish ? "Loading search index..." : "Carregando índice de busca..."}
              </p>
            ) : null}
            {isSearchReady && filteredResults.length === 0 ? (
              <p className="mb-0">
                {isSpanish
                  ? `No se encontraron resultados para “${query}”.`
                  : isEnglish
                    ? `No results found for “${query}”.`
                    : `Nenhum resultado encontrado para “${query}”.`}
              </p>
            ) : null}
            {filteredResults.length > 0 ? (
              <ul className={styles.searchList}>
                {filteredResults.map((result) => (
                  <li key={`${result.permalink}-${result.title}`}>
                    <Link to={result.permalink} onClick={() => setQuery("")}>
                      <strong>{result.title}</strong>
                      <span>{result.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}
    </header>
  );
}
