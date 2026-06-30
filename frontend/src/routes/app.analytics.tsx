import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Axiom" }] }),
  component: Analytics,
});

function Analytics() {
  const series = Array.from({ length: 20 }, (_, i) => 40 + Math.round(30 * Math.sin(i / 2) + 25 * Math.cos(i / 3) + i));
  const max = Math.max(...series);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-3xl">Analytics</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Health, growth and impact of the memory engine.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { l: "Repair Success", v: "92%" },
          { l: "Response Time", v: "4.8h" },
          { l: "Knowledge Growth", v: "+148/day" },
        ].map((s) => (
          <div key={s.l} className="pixel-card p-5">
            <div className="font-pixel text-xs uppercase tracking-widest text-[var(--muted-foreground)]">{s.l}</div>
            <div className="font-mono text-3xl mt-2">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 pixel-card p-5">
          <div className="font-pixel uppercase tracking-widest text-sm">Memories Created · 20 weeks</div>
          <svg viewBox="0 0 200 80" className="w-full mt-4">
            <polyline
              fill="none"
              stroke="#3b3b98"
              strokeWidth="1.6"
              points={series.map((y, i) => `${i * (200 / 19)},${80 - (y / max) * 70}`).join(" ")}
            />
            {series.map((y, i) => (
              <rect key={i} x={i * (200 / 19) - 1.2} y={80 - (y / max) * 70 - 1.2} width="2.4" height="2.4" fill="#3b3b98" />
            ))}
          </svg>
        </div>

        <div className="pixel-card p-5">
          <div className="font-pixel uppercase tracking-widest text-sm">Root Causes</div>
          <div className="mt-4 space-y-3">
            {[
              { l: "Drainage", p: 38, c: "var(--destructive)" },
              { l: "Aging assets", p: 27, c: "var(--secondary)" },
              { l: "Weather", p: 19, c: "var(--highlight)" },
              { l: "Load", p: 10, c: "var(--accent)" },
              { l: "Other", p: 6, c: "var(--primary)" },
            ].map((r) => (
              <div key={r.l}>
                <div className="flex justify-between text-sm"><span>{r.l}</span><span className="font-mono">{r.p}%</span></div>
                <div className="h-2 mt-1 border-[2px] border-[var(--border)] bg-white">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.p * 2.5}%` }} style={{ background: r.c, maxWidth: "100%" }} className="h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pixel-card p-5">
        <div className="font-pixel uppercase tracking-widest text-sm">Infrastructure Health by Ward</div>
        <div className="mt-4 grid grid-cols-15 gap-2" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
          {Array.from({ length: 15 }).map((_, i) => {
            const v = 40 + ((i * 17) % 60);
            const color = v > 75 ? "var(--accent)" : v > 55 ? "var(--highlight)" : "var(--destructive)";
            return (
              <div key={i} className="pixel-card-soft p-2 text-center">
                <div className="font-pixel text-xs">W{i + 1}</div>
                <div className="h-12 mt-1 border-[2px] border-[var(--border)] bg-white relative">
                  <div className="absolute bottom-0 left-0 right-0" style={{ height: `${v}%`, background: color }} />
                </div>
                <div className="font-mono text-[10px] mt-1">{v}%</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs">
          <PixelIcon name="check" size={16} /> <span>Higher is healthier</span>
        </div>
      </div>
    </div>
  );
}