"use client";

import { STALLS, Stall } from "@/lib/market";

interface Props {
  highlightSellers: Set<string>;
  highlightIngredients: Set<string>;
  selectedStallId: string | null;
  onSelect: (id: string | null) => void;
}

/**
 * Schematic map of 신포국제시장: main covered arcade (west↔east), one cross
 * alley, entrances at both ends. viewBox is the same 0–100 × 0–60 space the
 * stall coordinates live in.
 */
export default function MarketMap({
  highlightSellers,
  highlightIngredients,
  selectedStallId,
  onSelect,
}: Props) {
  const anyHighlight = highlightSellers.size > 0 || highlightIngredients.size > 0;

  return (
    <svg
      viewBox="-2 -4 104 70"
      className="w-full select-none"
      role="img"
      aria-label="신포국제시장 지도"
      onClick={() => onSelect(null)}
    >
      {/* market floor */}
      <rect x="0" y="4" width="100" height="52" rx="3" fill="var(--card)" stroke="var(--line)" strokeWidth="0.6" />

      {/* main arcade */}
      <rect x="3" y="22" width="94" height="12" rx="2" fill="#f5f1ea" />
      {/* cross alley */}
      <rect x="53" y="8" width="10" height="40" rx="2" fill="#f5f1ea" />

      {/* arcade walk direction hints */}
      <text x="26" y="29.6" textAnchor="middle" fontSize="2.6" fill="var(--muted)" letterSpacing="0.6">
        본길 (중앙 아케이드)
      </text>

      {/* entrances */}
      <g fontSize="2.6" fill="var(--muted)" fontWeight="600">
        <text x="1" y="20" textAnchor="start">◀ 서문 (신포사거리)</text>
        <text x="99" y="20" textAnchor="end">동문 (답동성당쪽) ▶</text>
      </g>

      {/* stalls */}
      {STALLS.map((s) => (
        <StallPin
          key={s.id}
          stall={s}
          isSeller={highlightSellers.has(s.id)}
          isIngredient={highlightIngredients.has(s.id)}
          dimmed={anyHighlight && !highlightSellers.has(s.id) && !highlightIngredients.has(s.id)}
          selected={selectedStallId === s.id}
          onSelect={onSelect}
        />
      ))}
    </svg>
  );
}

function StallPin({
  stall,
  isSeller,
  isIngredient,
  dimmed,
  selected,
  onSelect,
}: {
  stall: Stall;
  isSeller: boolean;
  isIngredient: boolean;
  dimmed: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const color = isSeller
    ? "var(--accent)"
    : isIngredient
      ? "var(--green)"
      : stall.kind === "food"
        ? "#c8beb2"
        : "#b9c2bb";
  const r = isSeller || isIngredient ? 2.6 : 1.8;

  return (
    <g
      opacity={dimmed ? 0.25 : 1}
      style={{ cursor: "pointer", transition: "opacity 0.25s" }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(stall.id);
      }}
    >
      {(isSeller || isIngredient) && (
        <circle className="pulse-ring" cx={stall.x} cy={stall.y} r={r} fill="none" stroke={color} strokeWidth="0.5" />
      )}
      <circle
        className={isSeller || isIngredient ? "pin-pop" : undefined}
        cx={stall.x}
        cy={stall.y}
        r={r}
        fill={color}
        stroke={selected ? "var(--fg)" : "#ffffff"}
        strokeWidth={selected ? 0.9 : 0.6}
      />
      {(isSeller || isIngredient || selected) && (
        <text
          x={stall.x}
          y={stall.y - r - 1.4}
          textAnchor="middle"
          fontSize="2.7"
          fontWeight="700"
          fill="var(--fg)"
          stroke="var(--bg)"
          strokeWidth="0.55"
          paintOrder="stroke"
        >
          {stall.name}
        </text>
      )}
    </g>
  );
}
