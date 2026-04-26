import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getSiteConfig } from "@/content/repositories/contentRepository";
import { useTheme } from "@/features/shell/components/ThemeProvider";
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
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
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
  }, []);

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
    theme === "light" ? "/images/logo-ice-jardins-01.png" : "/images/logo-ice-jardins-03.png";

  return (
    <header className={styles.wrapper} id="site-header">
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`} aria-label="Navegação principal">
        <div className="container-fluid px-3 px-lg-5">
          <Link className={`navbar-brand ${styles.brand}`} to="/" aria-label="Página inicial ICE Jardins">
            <img
              src={brandLogoSrc}
              alt="ICE Jardins"
              className={styles.brandLogo}
              loading="eager"
            />
          </Link>

          <button
            type="button"
            className="navbar-toggler"
            aria-controls="navbar-content"
            aria-expanded={isOpen}
            aria-label="Abrir menu"
            onClick={() => setIsOpen((current) => !current)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbar-content">
            <ul className={`navbar-nav ms-auto ${styles.menu}`}>
              {site.menu.map((item) => (
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
                onChange={(event) => setQuery(event.target.value)}
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
