import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export const Route = createFileRoute("/app/graph")({
  head: () => ({ meta: [{ title: "Knowledge Graph · Axiom" }] }),
  component: Graph,
});

type Node = { id: string; label: string; x: number; y: number; color: string };

const NODES: Node[] = [
  { id: "roads", label: "Roads", x: 50, y: 50, color: "#3b3b98" },
  { id: "pipes", label: "Pipelines", x: 20, y: 25, color: "#5c6bc0" },
  { id: "lamps", label: "Streetlights", x: 80, y: 25, color: "#ffd54f" },
  { id: "garbage", label: "Garbage", x: 80, y: 75, color: "#3ddc97" },
  { id: "weather", label: "Weather", x: 20, y: 75, color: "#5c6bc0" },
  { id: "engineers", label: "Engineers", x: 50, y: 12, color: "#3ddc97" },
  { id: "repairs", label: "Repairs", x: 50, y: 88, color: "#ff5c5c" },
  { id: "budgets", label: "Budgets", x: 10, y: 50, color: "#ffd54f" },
  { id: "citizens", label: "Citizens", x: 90, y: 50, color: "#5c6bc0" },
];

const EDGES: Array<[string, string]> = [
  ["roads", "pipes"], ["roads", "lamps"], ["roads", "garbage"], ["roads", "weather"],
  ["roads", "engineers"], ["roads", "repairs"], ["roads", "budgets"], ["roads", "citizens"],
  ["pipes", "weather"], ["lamps", "engineers"], ["garbage", "citizens"], ["repairs", "budgets"],
];

function Graph() {
  const [active, setActive] = useState<string>("roads");
  const a = NODES.find((n) => n.id === active)!;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-3xl">Knowledge Graph</h1>
        <p className="text-[var(--muted-foreground)] mt-1">A live, queryable map of every entity your city remembers.</p>
      </div>

      <div className="grid xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3 pixel-card p-5">
          <div className="relative w-full aspect-[16/10] grid-bg overflow-hidden">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {EDGES.map(([a, b], i) => {
                const na = NODES.find((n) => n.id === a)!;
                const nb = NODES.find((n) => n.id === b)!;
                const live = a === active || b === active;
                return (
                  <motion.line
                    key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={live ? "#3b3b98" : "#1f1f1f"} strokeOpacity={live ? 1 : 0.25}
                    strokeWidth={live ? 0.5 : 0.25}
                    animate={live ? { strokeDasharray: ["0 4", "4 0"] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                );
              })}
              {NODES.map((n) => {
                const isActive = n.id === active;
                return (
                  <g key={n.id} onClick={() => setActive(n.id)} className="cursor-pointer">
                    <rect x={n.x - 3} y={n.y - 3} width={6} height={6}
                          fill={n.color} stroke="#1f1f1f" strokeWidth="0.5"
                          style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
                    {isActive && (
                      <rect x={n.x - 4.5} y={n.y - 4.5} width={9} height={9} fill="none" stroke={n.color} strokeWidth="0.4" strokeDasharray="1 1" />
                    )}
                    <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize="2.4" fontFamily="Pixelify Sans" fill="#111">{n.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="pixel-card p-5">
          <div className="flex items-center gap-2">
            <div className="pixel-border bg-white p-1.5" style={{ background: a.color }}><div className="w-4 h-4" /></div>
            <div className="font-pixel text-xl">{a.label}</div>
          </div>
          <div className="font-mono text-xs text-[var(--muted-foreground)] mt-1">{NODES.length} entities · {EDGES.length} edges</div>
          <div className="mt-4 text-sm">
            <div className="font-pixel uppercase tracking-widest text-[10px] text-[var(--muted-foreground)]">Connected memories</div>
            <ul className="mt-2 space-y-2">
              {["Pothole · MG Rd 2024", "Drain failure · Ward 14", "Resurfacing · Ward 7"].map((t) => (
                <li key={t} className="pixel-card-soft p-2 text-sm">{t}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <button className="pixel-btn pixel-btn-primary w-full">
              <PixelIcon name="memory" size={16} /> Open Memories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}