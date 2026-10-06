import { useEffect, useRef, useState } from "react";
import { Icon } from "@/shared/components/Icon";
import terrainData from "@/content/data/terrainData.json";
import styles from "./TerrainMap.module.css";

interface TerrainMapProps {
  kmlDownloadUrl: string;
  googleEarthUrl: string;
  googleMapsUrl: string;
  lang?: "pt" | "en" | "es";
}

const MAP_TEXTS = {
  pt: {
    ssrTitle: "Fazenda Taboquinha — Gleba 01",
    ssrDesc:
      "Área de 24.368,29 m² no Jardim Botânico / DF-140. Carregando mapa interativo com imagens de satélite e coordenadas cadastrais...",
    openGoogleEarth: "Abrir no Google Earth (3D)",
    downloadKml: "Baixar KML",
    googleMaps: "Google Maps",
    satellite: "Satélite",
    street: "Ruas / Mapa",
    recenter: "Centralizar",
    recenterTitle: "Recentralizar no polígono",
    legendTitle: "Gleba 01 — ICE Jardins",
    legendText:
      "24.368 m² demarcados. Clique nos vértices amarelos (marcos M-01 a M-04) ou brancos (P-01 a P-017) para detalhes de rumo e coordenadas.",
    polygonPopup: `
      <div style="font-family: inherit; font-size: 13px; line-height: 1.5; color: #12383a;">
        <strong style="color: #145f63; font-size: 14px;">Fazenda Taboquinha — Gleba 01</strong><br/>
        <b>Proprietário:</b> Igreja Cristã Evangélica Jardins<br/>
        <b>Área:</b> 24.368,29 m² (~2,44 hectares)<br/>
        <b>Perímetro:</b> 675,37 metros<br/>
        <b>Município:</b> RA XXVII Jardim Botânico - DF
      </div>
    `
  },
  en: {
    ssrTitle: "Fazenda Taboquinha — Lot 01",
    ssrDesc:
      "24,368.29 m² (~6.02 acres) in the Jardim Botânico / DF-140 corridor. Loading interactive map with satellite imagery and cadastral coordinates...",
    openGoogleEarth: "Open in Google Earth (3D)",
    downloadKml: "Download KML",
    googleMaps: "Google Maps",
    satellite: "Satellite",
    street: "Streets / Map",
    recenter: "Recenter",
    recenterTitle: "Recenter on property boundary",
    legendTitle: "Lot 01 — ICE Jardins",
    legendText:
      "24,368 m² (~6.02 acres) demarcated. Click yellow corner markers (M-01 to M-04) or white boundary points (P-01 to P-017) for bearings and coordinate details.",
    polygonPopup: `
      <div style="font-family: inherit; font-size: 13px; line-height: 1.5; color: #12383a;">
        <strong style="color: #145f63; font-size: 14px;">Fazenda Taboquinha — Lot 01</strong><br/>
        <b>Owner:</b> Igreja Cristã Evangélica Jardins<br/>
        <b>Area:</b> 24,368.29 m² (~6.02 acres)<br/>
        <b>Perimeter:</b> 675.37 meters (2,215 ft)<br/>
        <b>Municipality:</b> RA XXVII Jardim Botânico, Brasília - DF
      </div>
    `
  },
  es: {
    ssrTitle: "Fazenda Taboquinha — Gleba 01",
    ssrDesc:
      "Área de 24.368,29 m² (~2,44 hectáreas) en el corredor Jardim Botânico / DF-140. Cargando mapa interactivo con imágenes satelitales y coordenadas catastrales...",
    openGoogleEarth: "Abrir en Google Earth (3D)",
    downloadKml: "Descargar KML",
    googleMaps: "Google Maps",
    satellite: "Satélite",
    street: "Calles / Mapa",
    recenter: "Centrar",
    recenterTitle: "Recentrar en el polígono",
    legendTitle: "Gleba 01 — ICE Jardins",
    legendText:
      "24.368 m² demarcados. Haga clic en los vértices amarillos (hitos M-01 a M-04) o blancos (P-01 a P-017) para ver detalles de rumbo y coordenadas.",
    polygonPopup: `
      <div style="font-family: inherit; font-size: 13px; line-height: 1.5; color: #12383a;">
        <strong style="color: #145f63; font-size: 14px;">Fazenda Taboquinha — Gleba 01</strong><br/>
        <b>Propietario:</b> Igreja Cristã Evangélica Jardins<br/>
        <b>Área:</b> 24.368,29 m² (~2,44 hectáreas)<br/>
        <b>Perímetro:</b> 675,37 metros<br/>
        <b>Municipio:</b> RA XXVII Jardim Botânico, Brasília - DF
      </div>
    `
  }
};

function formatVertexPopup(vertex: (typeof terrainData.vertices)[0], lang: "pt" | "en" | "es") {
  const isMainCorner = vertex.name.startsWith("M-");
  const title =
    lang === "en"
      ? isMainCorner
        ? `Corner Marker ${vertex.name}`
        : `Boundary Point ${vertex.name}`
      : lang === "es"
        ? isMainCorner
          ? `Hito ${vertex.name}`
          : `Punto ${vertex.name}`
        : isMainCorner
          ? `Marco ${vertex.name}`
          : `Ponto ${vertex.name}`;

  let descriptionHtml = vertex.rawDescription;
  if (lang === "en") {
    descriptionHtml = descriptionHtml
      .replace(/<b>Vértice:<\/b>/g, "<b>Vertex:</b>")
      .replace(/<b>Para:<\/b>/g, "<b>To:</b>")
      .replace(/<b>Azimute:<\/b>/g, "<b>Azimuth:</b>")
      .replace(/<b>Distância:<\/b>/g, "<b>Distance:</b>")
      .replace(/<b>Este \(UTM\):<\/b>/g, "<b>Easting (UTM):</b>")
      .replace(/<b>Norte \(UTM\):<\/b>/g, "<b>Northing (UTM):</b>")
      .replace(/<b>Latitude:<\/b>/g, "<b>Latitude:</b>")
      .replace(/<b>Longitude:<\/b>/g, "<b>Longitude:</b>");
  } else if (lang === "es") {
    descriptionHtml = descriptionHtml
      .replace(/<b>Vértice:<\/b>/g, "<b>Vértice:</b>")
      .replace(/<b>Para:<\/b>/g, "<b>Hacia:</b>")
      .replace(/<b>Azimute:<\/b>/g, "<b>Azimut:</b>")
      .replace(/<b>Distância:<\/b>/g, "<b>Distancia:</b>")
      .replace(/<b>Este \(UTM\):<\/b>/g, "<b>Este (UTM):</b>")
      .replace(/<b>Norte \(UTM\):<\/b>/g, "<b>Norte (UTM):</b>")
      .replace(/<b>Latitude:<\/b>/g, "<b>Latitud:</b>")
      .replace(/<b>Longitude:<\/b>/g, "<b>Longitud:</b>");
  }

  return `
    <div style="font-family: inherit; font-size: 12px; line-height: 1.4; color: #12383a; max-width: 240px;">
      <strong style="color: ${isMainCorner ? "#b78103" : "#145f63"}; font-size: 13px;">${title}</strong><br/>
      ${descriptionHtml}
    </div>
  `;
}

export function TerrainMap({
  kmlDownloadUrl,
  googleEarthUrl,
  googleMapsUrl,
  lang = "pt"
}: TerrainMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const layersRef = useRef<{ satellite: any; street: any }>({ satellite: null, street: null });
  const polygonRef = useRef<any>(null);

  const [isClient, setIsClient] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [activeLayer, setActiveLayer] = useState<"satellite" | "street">("satellite");

  const t = MAP_TEXTS[lang] || MAP_TEXTS.pt;
  const isEn = lang === "en";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lazy-load map when approaching viewport
  useEffect(() => {
    if (!isClient || !containerRef.current || isInView) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isClient, isInView]);

  useEffect(() => {
    if (!isClient || !isInView || !mapRef.current) {
      return;
    }

    let isMounted = true;

    async function initLeaflet() {
      try {
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        if (!isMounted || !mapRef.current) {
          return;
        }

        // Clean up any existing map instance
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }

        const center: [number, number] = [terrainData.center[0], terrainData.center[1]];
        const map = L.map(mapRef.current, {
          center,
          zoom: 16,
          zoomControl: true,
          scrollWheelZoom: false
        });

        // Satellite Tile Layer (Esri World Imagery)
        const satelliteLayer = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            maxZoom: 19,
            attribution: "Esri World Imagery"
          }
        );

        // Street Map Layer (OpenStreetMap)
        const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap"
        });

        layersRef.current = { satellite: satelliteLayer, street: streetLayer };
        satelliteLayer.addTo(map);

        // Draw the boundary polygon of Gleba 01
        const polygonCoords = terrainData.polygon as [number, number][];
        const polygon = L.polygon(polygonCoords, {
          color: "#00e5ff",
          weight: 3.5,
          opacity: 0.95,
          fillColor: "#145f63",
          fillOpacity: 0.35,
          dashArray: "2, 4"
        }).addTo(map);

        polygonRef.current = polygon;
        polygon.bindPopup(t.polygonPopup);

        // Add markers for primary corners (M-01 to M-04) and boundary points
        terrainData.vertices.forEach((vertex) => {
          const isMainCorner = vertex.name.startsWith("M-");

          const circleMarker = L.circleMarker([vertex.lat, vertex.lng], {
            radius: isMainCorner ? 7 : 4.5,
            fillColor: isMainCorner ? "#ffcc00" : "#ffffff",
            color: isMainCorner ? "#0b3032" : "#145f63",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(map);

          circleMarker.bindPopup(formatVertexPopup(vertex, lang));
        });

        // Fit map bounds to encompass the full polygon with padding
        const fitPolygon = () => {
          if (!map || !polygon) return;
          map.invalidateSize();
          map.fitBounds(polygon.getBounds(), { padding: [35, 35] });
        };

        fitPolygon();

        // Invalidate size on subsequent layout frames so all surrounding tiles load
        const timer1 = setTimeout(fitPolygon, 100);
        const timer2 = setTimeout(fitPolygon, 350);
        const timer3 = setTimeout(fitPolygon, 800);

        const handleWindowResize = () => {
          if (leafletMapRef.current) {
            leafletMapRef.current.invalidateSize();
          }
        };
        window.addEventListener("resize", handleWindowResize);

        leafletMapRef.current = map;

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
          window.removeEventListener("resize", handleWindowResize);
        };
      } catch (err) {
        console.error("Failed to initialize Leaflet map:", err);
      }
    }

    let cleanupTimers: (() => void) | undefined;
    initLeaflet().then((cleanup) => {
      cleanupTimers = cleanup;
    });

    return () => {
      isMounted = false;
      if (cleanupTimers) {
        cleanupTimers();
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isClient, isInView, lang, t.polygonPopup, isEn]);

  const toggleLayer = (type: "satellite" | "street") => {
    if (!leafletMapRef.current || !layersRef.current) {
      return;
    }

    const map = leafletMapRef.current;
    if (type === "satellite") {
      map.removeLayer(layersRef.current.street);
      layersRef.current.satellite.addTo(map);
      setActiveLayer("satellite");
    } else {
      map.removeLayer(layersRef.current.satellite);
      layersRef.current.street.addTo(map);
      setActiveLayer("street");
    }
  };

  const handleRecenter = () => {
    if (leafletMapRef.current && polygonRef.current) {
      leafletMapRef.current.fitBounds(polygonRef.current.getBounds(), { padding: [35, 35] });
    }
  };

  return (
    <div ref={containerRef} className={styles.mapWrapper}>
      {!isInView ? (
        <div className={styles.ssrPlaceholder}>
          <h3 className={styles.ssrHeading}>
            <Icon name="geo-alt-fill" /> {t.ssrTitle}
          </h3>
          <p>{t.ssrDesc}</p>
          <div className={styles.quickActionGroup}>
            <a
              href={googleEarthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.quickBtn}
            >
              <Icon name="globe-americas" /> {t.openGoogleEarth}
            </a>
            <a href={kmlDownloadUrl} download className={styles.quickBtn}>
              <Icon name="download" /> {t.downloadKml}
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.quickBtn}
            >
              <Icon name="pin-map" /> {t.googleMaps}
            </a>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.mapToolbar}>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeLayer === "satellite" ? styles.activeToolBtn : ""}`}
              onClick={() => toggleLayer("satellite")}
            >
              <Icon name="camera-fill" /> {t.satellite}
            </button>
            <button
              type="button"
              className={`${styles.toolBtn} ${activeLayer === "street" ? styles.activeToolBtn : ""}`}
              onClick={() => toggleLayer("street")}
            >
              <Icon name="map" /> {t.street}
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleRecenter}
              title={t.recenterTitle}
            >
              <Icon name="arrows-angle-contract" /> {t.recenter}
            </button>
          </div>

          <div ref={mapRef} className={styles.mapContainer} />

          <div className={styles.mapLegend}>
            <div className={styles.legendTitle}>
              <span className={styles.legendDot} />
              <span>{t.legendTitle}</span>
            </div>
            <p className={styles.legendText}>{t.legendText}</p>
          </div>
        </>
      )}
    </div>
  );
}
