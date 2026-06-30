import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";

export const Route = createFileRoute("/app/predictions")({
  head: () => ({ meta: [{ title: "Predictions · Axiom" }] }),
  component: Predictions,
});

const CARDS: Array<{ icon: IconName; title: string; pct: number; sub: string; color: string }> = [
  { icon: "road", title: "Road Failure Risk", pct: 73, sub: "Ward 7, 12, 15", color: "var(--destructive)" },
  { icon: "drop", title: "Pipeline Burst Probability", pct: 41, sub: "Ward 4 main line", color: "var(--secondary)" },
  { icon: "lamp", title: "Streetlight Failure Forecast", pct: 28, sub: "Central grid", color: "var(--highlight)" },
  { icon: "trash", title: "Garbage Overflow Prediction", pct: 56, sub: "Markets, weekends", color: "var(--accent)" },
];

const WINDOWS = ["Today", "7 Days", "30 Days", "90 Days"];

function Predictions() {
  const [w, setW] = useState(1);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-3xl">Predictions</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Forecasts grounded in years of resolved memory.</p>
      </div>

      <div className="pixel-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="font-pixel uppercase tracking-widest text-sm">Forecast Window</div>
          <div className="flex gap-2">
            {WINDOWS.map((label, i) => (
              <button key={label}
                onClick={() => setW(i)}
                className={`pixel-btn !py-1.5 !text-xs ${i === w ? "pixel-btn-primary" : ""}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <input type="range" min={0} max={3} value={w} onChange={(e) => setW(+e.target.value)} className="w-full accent-[var(--primary)]" />
          <div className="flex justify-between font-mono text-xs mt-2 text-[var(--muted-foreground)]">
            {WINDOWS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {CARDS.map((c, i) => {
          const adjusted = Math.max(5, Math.min(99, Math.round(c.pct * (0.6 + w * 0.18))));
          return (
            <motion.div key={c.title} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="pixel-card pixel-card-hover p-5">
              <div className="flex items-center justify-between">
                <div className="pixel-border bg-white p-1.5"><PixelIcon name={c.icon} size={22}/></div>
                <span className="pixel-chip" style={{ borderColor: c.color, color: c.color }}>{WINDOWS[w]}</span>
              </div>
              <div className="font-pixel mt-3">{c.title}</div>
              <div className="font-mono text-4xl mt-2" style={{ color: c.color }}>{adjusted}%</div>
              <div className="font-mono text-xs text-[var(--muted-foreground)] mt-1">{c.sub}</div>
              <div className="mt-3 h-2 border-[2px] border-[var(--border)] bg-white">
                <motion.div animate={{ width: `${adjusted}%` }} transition={{ duration: 0.6 }} className="h-full" style={{ background: c.color }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pixel-card p-5">
        <div className="font-pixel uppercase tracking-widest text-sm">Risk Heatmap · {WINDOWS[w]}</div>
        <div className="mt-4 grid grid-cols-16 gap-1" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
          {Array.from({ length: 24 * 8 }).map((_, i) => {
            const intensity = ((i * (w + 1)) % 9) / 8;
            const color = intensity > 0.66 ? "var(--destructive)" : intensity > 0.33 ? "var(--highlight)" : "var(--accent)";
            return <div key={i} className="aspect-square border border-[var(--border)]" style={{ background: color, opacity: 0.2 + intensity * 0.8 }} />;
          })}
        </div>
      </div>
    </div>
  );
}