import { useState } from "react";
import { motion } from "framer-motion";

type Pin = { x: number; y: number; level: "high" | "med" | "low"; title: string; ward: string };

const PINS: Pin[] = [
  { x: 18, y: 30, level: "med", title: "Pothole Cluster", ward: "Ward 4" },
  { x: 32, y: 22, level: "high", title: "Road Damage", ward: "Ward 12" },
  { x: 48, y: 28, level: "med", title: "Water Leakage", ward: "Ward 8" },
  { x: 62, y: 36, level: "low", title: "Streetlight Outage", ward: "Ward 5" },
  { x: 70, y: 24, level: "med", title: "Drain Blockage", ward: "Ward 2" },
  { x: 78, y: 50, level: "med", title: "Garbage Overflow", ward: "Ward 3" },
  { x: 28, y: 56, level: "high", title: "Bridge Crack", ward: "Ward 9" },
  { x: 42, y: 64, level: "med", title: "Sewer Backup", ward: "Ward 6" },
  { x: 58, y: 58, level: "low", title: "Sign Damage", ward: "Ward 11" },
  { x: 84, y: 70, level: "med", title: "Pipeline Drop", ward: "Ward 7" },
];

const COLOR = {
  high: "var(--destructive)",
  med: "var(--highlight)",
  low: "var(--accent)",
};

export function PixelMap() {
  const [active, setActive] = useState<number | null>(1);
  return (
    <div className="relative w-full aspect-[16/10] pixel-border overflow-hidden bg-[#eef0e8]">
      {/* base */}
      <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full" preserveAspectRatio="none" shapeRendering="crispEdges">
        {/* land blocks */}
        <rect width="100" height="60" fill="#eef0e8" />
        {/* parks */}
        <rect x="6" y="4" width="14" height="10" fill="#cfe6c4" />
        <rect x="74" y="6" width="16" height="12" fill="#cfe6c4" />
        <rect x="10" y="42" width="18" height="14" fill="#cfe6c4" />
        {/* river */}
        <path d="M0,38 Q20,28 40,34 T80,30 L100,28 L100,42 Q80,46 60,42 T20,46 L0,52 Z" fill="#bcd6e8" />
        {/* roads */}
        {[12, 28, 44, 60, 76].map((y, i) => (
          <rect key={i} x="0" y={y} width="100" height="0.6" fill="#1f1f1f" opacity="0.35" />
        ))}
        {[12, 30, 50, 68, 86].map((x, i) => (
          <rect key={i} x={x} y="0" width="0.6" height="60" fill="#1f1f1f" opacity="0.35" />
        ))}
        {/* buildings */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (i * 11) % 96 + 2;
          const y = (i * 7) % 56 + 2;
          const w = 2 + (i % 3);
          const h = 2 + ((i + 1) % 3);
          const c = ["#dad9e8", "#e6e1d4", "#d6d1c4"][i % 3];
          return <rect key={i} x={x} y={y} width={w} height={h} fill={c} />;
        })}
      </svg>

      {/* grid overlay */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      {/* pins */}
      {PINS.map((p, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <motion.div
            whileHover={{ y: -3 }}
            className="relative"
          >
            <svg width="22" height="28" viewBox="0 0 11 14" shapeRendering="crispEdges" className="pixelated">
              <rect x="3" y="0" width="5" height="1" fill="#1f1f1f" />
              <rect x="2" y="1" width="7" height="1" fill="#1f1f1f" />
              <rect x="1" y="2" width="9" height="5" fill="#1f1f1f" />
              <rect x="2" y="2" width="7" height="4" fill={COLOR[p.level]} />
              <rect x="4" y="3" width="3" height="2" fill="#fff" />
              <rect x="2" y="7" width="7" height="1" fill="#1f1f1f" />
              <rect x="3" y="8" width="5" height="1" fill="#1f1f1f" />
              <rect x="4" y="9" width="3" height="1" fill="#1f1f1f" />
              <rect x="5" y="10" width="1" height="3" fill="#1f1f1f" />
            </svg>
            {active === i && (
              <span className="absolute inset-0 rounded-full ring-4 ring-[var(--primary)]/30 pulse-dot" />
            )}
          </motion.div>
        </button>
      ))}

      {/* zoom controls */}
      <div className="absolute top-3 left-3 flex flex-col">
        <button className="w-8 h-8 bg-white border-[2px] border-[var(--border)] font-pixel">+</button>
        <button className="w-8 h-8 bg-white border-[2px] border-t-0 border-[var(--border)] font-pixel">−</button>
      </div>
      <div className="absolute top-3 right-3 w-9 h-9 bg-white border-[2px] border-[var(--border)] flex items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 8 8" shapeRendering="crispEdges">
          <rect x="1" y="2" width="6" height="1" fill="#1f1f1f" />
          <rect x="1" y="4" width="6" height="1" fill="#1f1f1f" />
          <rect x="1" y="6" width="6" height="1" fill="#1f1f1f" />
        </svg>
      </div>

      {/* floating detail card */}
      {active !== null && (
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 pixel-card p-4 w-[280px] bg-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-pixel text-[var(--destructive)]">{PINS[active].title}</div>
              <div className="font-mono text-xs text-[var(--muted-foreground)]">
                {PINS[active].ward}
              </div>
            </div>
            <button onClick={() => setActive(null)} className="font-pixel text-sm">×</button>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 pixel-chip" style={{ background: "#ffe5e5", borderColor: "var(--destructive)", color: "var(--destructive)" }}>
            HIGH PRIORITY
          </div>
          <div className="mt-3 text-xs text-[var(--muted-foreground)] font-mono">
            Similar cases found: <span className="text-[var(--foreground)]">23</span>
          </div>
          <button className="mt-3 text-xs font-pixel text-[var(--primary)] hover:underline">Click to view details →</button>
        </motion.div>
      )}
    </div>
  );
}