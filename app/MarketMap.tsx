"use client";

import { STALLS, Stall } from "@/lib/market";

interface Props {
  highlightSellers: Set<string>;
  highlightIngredients: Set<string>;
  selectedStallId: string | null;
  onSelect: (id: string | null) => void;
}

/** deterministic pseudo-random for the ambient particle field */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const TRI_COLORS = ["#8052ff", "#ffb829", "#15846e", "#d946ef", "#3b82f6"];

function AmbientTriangles() {
  const tris = Array.from({ length: 46 }, (_, i) => {
    const x = rand(i) * 100;
    const y = rand(i + 100) * 60;
    const s = 0.7 + rand(i + 200) * 1.1;
    const rot = rand(i + 300) * 360;
    const color = TRI_COLORS[Math.floor(rand(i + 400) * TRI_COLORS.length)];
    const op = 0.15 + rand(i + 500) * 0.4;
    return { x, y, s, rot, color, op, slow: i % 3 === 0 };
  });
  return (
    <g pointerEvents="none">
      {tris.map((t, i) => (
        <path
          key={i}
          className={t.slow ? "tri-drift-slow" : "tri-drift"}
          d={`M ${t.x} ${t.y - t.s} L ${t.x + t.s * 0.87} ${t.y + t.s * 0.5} L ${t.x - t.s * 0.87} ${t.y + t.s * 0.5} Z`}
          fill="none"
          stroke={t.color}
          strokeWidth="0.22"
          opacity={t.op}
          transform={`rotate(${t.rot} ${t.x} ${t.y})`}
          style={{ animationDelay: `${(i % 7) * -1.3}s` }}
        />
      ))}
    </g>
  );
}

/**
 * Schematic map of 신포국제시장 as a constellation on the void: the arcade is
 * drawn with faint strokes only — no panels, no fills. Stalls are point-lights.
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
      <AmbientTriangles />

      {/* arcade paths — ghost strokes on the void */}
      <g fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.35" strokeDasharray="1.4 1.1">
        <rect x="3" y="22" width="94" height="12" rx="2" />
        <rect x="53" y="8" width="10" height="40" rx="2" />
      </g>

      <text x="26" y="29.9" textAnchor="middle" fontSize="2.5" fill="var(--color-ash-gray)" letterSpacing="0.6" fontWeight="200">
        본길 · 중앙 아케이드
      </text>

      {/* entrances */}
      <g fontSize="2.4" fill="var(--color-ash-gray)" fontWeight="600" letterSpacing="0.3">
        <text x="1" y="20" textAnchor="start">◀ 서문</text>
        <text x="99" y="20" textAnchor="end">동문 ▶</text>
      </g>

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
    ? "var(--color-electric-iris)"
    : isIngredient
      ? "var(--color-saffron-spark)"
      : "rgba(255,255,255,0.35)";
  const r = isSeller || isIngredient ? 2.4 : 1.4;

  return (
    <g
      opacity={dimmed ? 0.18 : 1}
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
        fill={isSeller || isIngredient ? color : "none"}
        stroke={selected ? "var(--color-bone-white)" : color}
        strokeWidth={selected ? 0.8 : 0.45}
      />
      {(isSeller || isIngredient || selected) && (
        <text
          x={stall.x > 78 ? 100 : stall.x < 8 ? 0 : stall.x}
          y={stall.y - r - 1.4}
          textAnchor={stall.x > 78 ? "end" : stall.x < 8 ? "start" : "middle"}
          fontSize="2.7"
          fontWeight="400"
          fill="var(--color-bone-white)"
          stroke="var(--color-void)"
          strokeWidth="0.6"
          paintOrder="stroke"
        >
          {stall.name}
        </text>
      )}
    </g>
  );
}
