import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";
import { PixelMap } from "@/components/app/PixelMap";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard · Axiom" }] }),
  component: Dashboard,
});

function CountUp({ to, prefix = "", suffix = "" }: { to: number; prefix?: string; suffix?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const dur = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span>{prefix}{n.toLocaleString()}{suffix}</span>;
}

type StatCard = { icon: IconName; label: string; value: number; suffix?: string; sub: string; tint: string };
const STATS: StatCard[] = [
  { icon: "brain", label: "Total Memories", value: 12483, sub: "+148 today", tint: "#eef0ff" },
  { icon: "shield", label: "AI Confidence", value: 94, suffix: "%", sub: "High accuracy", tint: "#e6f0ff" },
  { icon: "check", label: "Prediction Accuracy", value: 91, suffix: "%", sub: "+2% this week", tint: "#e8fbef" },
  { icon: "heart", label: "Infrastructure Health", value: 82, suffix: "%", sub: "Good condition", tint: "#fff2dc" },
];

const RECENT = [
  { icon: "road" as const, title: "Road Damage", loc: "MG Road, Ward 12", time: "2 min ago", level: "HIGH", color: "var(--destructive)" },
  { icon: "drop" as const, title: "Water Leakage", loc: "Park Street, Ward 8", time: "15 min ago", level: "MEDIUM", color: "var(--highlight)" },
  { icon: "lamp" as const, title: "Streetlight Outage", loc: "Central Ave, Ward 5", time: "32 min ago", level: "LOW", color: "var(--accent)" },
  { icon: "trash" as const, title: "Garbage Overflow", loc: "Main Market, Ward 3", time: "1 hr ago", level: "MEDIUM", color: "var(--highlight)" },
];

const CATEGORIES = [
  { name: "Road Damage", pct: 42, color: "var(--destructive)" },
  { name: "Water Leakage", pct: 28, color: "var(--secondary)" },
  { name: "Streetlight Outage", pct: 15, color: "var(--accent)" },
  { name: "Garbage Overflow", pct: 10, color: "var(--highlight)" },
  { name: "Others", pct: 5, color: "var(--primary)" },
];

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await api.getAnalyticsDashboard();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    
    // Auto refresh every 5 seconds for the demo
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center font-pixel text-xl animate-pulse">Loading City Data...</div>;
  }

  if (!stats) return <div className="p-8 text-center text-[var(--destructive)]">Error loading dashboard</div>;

  const displayStats = [
    { icon: "brain" as IconName, label: "Total Memories", value: stats.totalMemories, sub: "+1 today", tint: "#eef0ff" },
    { icon: "shield" as IconName, label: "AI Confidence", value: stats.predictionAccuracy || 0, suffix: "%", sub: "Based on memories", tint: "#e6f0ff" },
    { icon: "check" as IconName, label: "Prediction Accuracy", value: stats.predictionAccuracy || 0, suffix: "%", sub: "Improving with data", tint: "#e8fbef" },
    { icon: "heart" as IconName, label: "Infrastructure Health", value: stats.infrastructureHealth || 100, suffix: "%", sub: "Active condition", tint: "#fff2dc" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {displayStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="pixel-card pixel-card-hover p-5"
            style={{ background: s.tint }}
          >
            <div className="flex items-start justify-between">
              <div className="font-pixel text-[11px] uppercase tracking-widest text-[var(--muted-foreground)]">
                {s.label}
              </div>
              <div className="pixel-border p-1.5 bg-white">
                <PixelIcon name={s.icon} size={22} />
              </div>
            </div>
            <div className="font-mono text-4xl mt-3 text-[var(--foreground)]">
              <CountUp to={s.value} suffix={s.suffix ?? ""} />
            </div>
            <div className="font-pixel text-xs mt-1 text-[var(--muted-foreground)]">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Map */}
        <div className="xl:col-span-2 pixel-card p-5">
          <Header title="City Overview Map" />
          <div className="mt-4">
            <PixelMap />
          </div>
        </div>

        {/* Recent memories */}
        <div className="pixel-card p-5">
          <Header title="Recent Memories" />
          <ul className="mt-4 divide-y divide-[var(--border-soft)]">
            {!stats.recentMemories?.length ? (
               <li className="py-4 text-center font-mono text-sm text-[var(--muted-foreground)]">
                 No memories recorded yet.<br/>Complete a repair to see memories here.
               </li>
            ) : stats.recentMemories.map((r: any) => (
              <li key={r.id} className="py-3 flex items-center gap-3">
                <div className="pixel-border p-1.5 bg-white">
                  <PixelIcon name="memory" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-pixel text-sm truncate">{r.title}</div>
                  <div className="font-mono text-xs text-[var(--muted-foreground)] truncate">{r.ward?.name}</div>
                </div>
                <div className="text-right">
                  <span className="pixel-chip mt-1 text-[10px]" style={{ background: "#fff", borderColor: "var(--accent)", color: "var(--accent)" }}>{r.successScore} SCORE</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* AI Insights */}
        <div className="xl:col-span-2 pixel-card p-5">
          <Header title="AI Insights" />
          {stats.totalMemories === 0 ? (
            <div className="mt-4 pixel-card-soft p-8 text-center text-[var(--muted-foreground)] font-mono text-sm">
              AI Insights will generate once enough repairs have been completed and memories stored.
            </div>
          ) : (
            <>
              <div className="mt-4 pixel-card-soft p-4 flex gap-4" style={{ background: "#eef4ff" }}>
                <div className="pixel-border p-2 bg-white h-fit">
                  <PixelIcon name="robot" size={32} />
                </div>
                <div className="flex-1">
                  <div className="font-pixel">Axiom has recorded {stats.totalMemories} memories across the city.</div>
                  <div className="font-mono text-sm mt-1 text-[var(--muted-foreground)]">
                    Success rate of completed repairs is {stats.repairSuccessRate}%.
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="pixel-btn pixel-btn-primary !py-1.5 !text-xs">Open Predictions</button>
                    <button className="pixel-btn !py-1.5 !text-xs">Dismiss</button>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="font-pixel text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-3">Memory Growth · 14 days</div>
                <div className="flex items-end gap-2 h-32">
                  {Array.from({ length: 14 }).map((_, i) => {
                    // Small mock visualization for the bars
                    const h = stats.totalMemories > 0 ? 30 + ((i * 53) % 70) : 0;
                    return (
                      <div key={i} className="flex-1 bg-[var(--primary)] border-[2px] border-[var(--border)]"
                           style={{ height: `${h}%`, opacity: stats.totalMemories > 0 ? 1 : 0.1 }} />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Categories */}
        <div className="pixel-card p-5">
          <Header title="Issues by Category" />
          <div className="mt-4 space-y-3">
            {!stats.issuesByCategory?.length ? (
              <div className="text-center font-mono text-sm text-[var(--muted-foreground)] py-4">No issues reported yet.</div>
            ) : stats.issuesByCategory.map((c: any) => (
              <div key={c.category}>
                <div className="flex justify-between text-sm">
                  <span>{c.category}</span>
                  <span className="font-mono">{c.count}</span>
                </div>
                <div className="mt-1 h-3 border-[2px] border-[var(--border)] bg-white">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, c.count * 20)}%` }}
                    transition={{ duration: 0.8 }}
                    style={{ background: "var(--primary)", maxWidth: "100%" }}
                    className="h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="font-pixel uppercase tracking-widest text-sm">{title}</div>
      <div className="flex gap-1">
        <button className="w-7 h-7 border-[2px] border-[var(--border)] bg-white font-pixel text-xs">↻</button>
        <button className="w-7 h-7 border-[2px] border-[var(--border)] bg-white font-pixel text-xs">⤢</button>
      </div>
    </div>
  );
}