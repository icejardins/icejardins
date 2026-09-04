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

  const isEnglish = location.pathname.startsWith("/en");

  const menuItems = isEnglish
    ? [
        { name: "Home", url: "/en/" },
        { name: "About", url: "/en/#about" },
        { name: "What We Believe", url: "/en/faith/" },
        { name: "Visit", url: "/visita/" },
        { name: "Give", url: "/en/give/" }
      ]
    : site.menu;

  const handleLanguageChange = (targetLang: "pt" | "en") => {
    setLanguagePreference(targetLang);
    if (targetLang === "en") {
      if (location.pathname.startsWith("/contribuir") || location.pathname.startsWith("/doacoes") || location.pathname.startsWith("/doe")) {
        navigate("/en/give/");
      } else if (location.pathname.startsWith("/fe")) {
        navigate("/en/faith/");
      } else {
        navigate("/en/");
      }
    } else {
      if (location.pathname.startsWith("/en/give")) {
        navigate("/contribuir/");
      } else if (location.pathname.startsWith("/en/faith")) {
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
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`} aria-label={isEnglish ? "Main navigation" : "Navegação principal"}>
        <div className="container-fluid px-3 px-lg-5">
          <Link className={`navbar-brand ${styles.brand}`} to={isEnglish ? "/en/" : "/"} aria-label="Página inicial ICE Jardins">
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
            aria-label={isEnglish ? "Open menu" : "Abrir menu"}
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
                  aria-label={`Alternar tema. Tema atual: ${theme}`}
                >
                  {theme === "dark" ? "Claro" : "Escuro"}
                </button>
              </li>
              <li className="nav-item d-flex align-items-center">
                <div className={styles.langSwitcher} role="group" aria-label="Language selector">
                  <button
                    type="button"
                    className={`${styles.langBtn} ${!isEnglish ? styles.langBtnActive : ""}`}
                    onClick={() => handleLanguageChange("pt")}
                    aria-label="Versão em Português"
                  >
                    PT
                  </button>
                  <button
                    type="button"
                    className={`${styles.langBtn} ${isEnglish ? styles.langBtnActive : ""}`}
                    onClick={() => handleLanguageChange("en")}
                    aria-label="English version"
                  >
                    EN
                  </button>
                </div>
              </li>
            </ul>
            <div className={styles.searchBox}>
              <label htmlFor="site-search" className="visually-hidden">
                Buscar conteúdo
              </label>
              <input
                id="site-search"
                type="search"
                className="form-control"
                placeholder="Buscar sermões e páginas"
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
        <section className={styles.searchResults} aria-live="polite" aria-label="Resultados da busca">
          <div className="container py-3">
            {!isSearchReady ? <p className="mb-0">Carregando índice de busca...</p> : null}
            {isSearchReady && filteredResults.length === 0 ? (
              <p className="mb-0">Nenhum resultado encontrado para “{query}”.</p>
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
