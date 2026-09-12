"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, CircleMarker } from "leaflet";
import { STALLS, MARKET_CENTER, stallLatLng } from "@/lib/market";

interface Props {
  highlightSellers: Set<string>;
  highlightIngredients: Set<string>;
  selectedStallId: string | null;
  onSelect: (id: string | null) => void;
}

const IRIS = "#0447ff";
const SPARK = "#ff4704";
const DIM = "#a59f97";

function pinHtml(color: string, big: boolean, glow: boolean) {
  const size = big ? 18 : 11;
  return `<div style="
    width:${size}px;height:${size}px;border-radius:50%;
    background:${color};
    border:2px solid #fdfcfc;
    box-shadow:${glow ? `0 0 0 3px ${color}22, 0 1px 4px rgba(0,0,0,0.25)` : "0 1px 3px rgba(0,0,0,0.2)"};
    ${glow ? "animation: dala-pulse 1.6s ease-in-out infinite;" : ""}
  "></div>`;
}

/**
 * Leaflet + OpenStreetMap tiles with approximate curated stall coordinates.
 * Blue = registered dish sellers, orange = registered ingredient mappings.
 */
export default function MarketMap({
  highlightSellers,
  highlightIngredients,
  selectedStallId,
  onSelect,
}: Props) {
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const LRef = useRef<typeof import("leaflet") | null>(null);

  // init once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(containerRef.current, {
        center: MARKET_CENTER,
        zoom: 17,
        zoomControl: false,
        attributionControl: true,
      });
      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        className: "dala-tiles",
      }).addTo(map);

      map.on("click", () => onSelect(null));
      mapRef.current = map;

      // Run the effects with the latest selection, not the async init closure.
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawMarkers() {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const anyHighlight = highlightSellers.size > 0 || highlightIngredients.size > 0;

    STALLS.forEach((s) => {
      const isSeller = highlightSellers.has(s.id);
      const isIng = highlightIngredients.has(s.id);
      const lit = isSeller || isIng;
      const color = isSeller ? IRIS : isIng ? SPARK : DIM;
      const dimmed = anyHighlight && !lit;

      const icon = L.divIcon({
        className: "dala-pin",
        html: pinHtml(color, lit, lit),
        iconSize: lit ? [18, 18] : [11, 11],
        iconAnchor: lit ? [9, 9] : [5.5, 5.5],
      });

      const marker = L.marker(stallLatLng(s), {
        icon,
        opacity: dimmed ? 0.25 : 1,
        zIndexOffset: lit ? 1000 : 0,
      }).addTo(map);

      marker.bindTooltip(s.name, {
        direction: "top",
        offset: [0, -10],
        permanent: lit,
        className: "dala-tooltip",
        opacity: 1,
      });

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e as unknown as Event);
        onSelect(s.id);
      });

      markersRef.current[s.id] = marker;
    });
  }

  // redraw on highlight change + fit to lit pins
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    drawMarkers();

    const litIds = [...highlightSellers, ...highlightIngredients];
    if (litIds.length > 0) {
      const pts = litIds
        .map((id) => STALLS.find((s) => s.id === id))
        .filter(Boolean)
        .map((s) => stallLatLng(s!));
      map.fitBounds(L.latLngBounds(pts), { padding: [46, 46], maxZoom: 18, animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    } else {
      map.setView(MARKET_CENTER, 17, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightSellers, highlightIngredients, ready]);

  // selection ring
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    let ring: CircleMarker | null = null;
    if (selectedStallId) {
      const s = STALLS.find((st) => st.id === selectedStallId);
      if (s) {
        ring = L.circleMarker(stallLatLng(s), {
          radius: 16,
          color: "#44403b",
          weight: 1.5,
          fill: false,
          dashArray: "3 4",
        }).addTo(map);
        map.panTo(stallLatLng(s), { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches });
      }
    }
    return () => {
      ring?.remove();
    };
  }, [selectedStallId, ready]);

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full overflow-hidden rounded-[20px] border border-[var(--color-stone)]"
      style={{ background: "var(--color-warm-taupe)" }}
    />
  );
}
