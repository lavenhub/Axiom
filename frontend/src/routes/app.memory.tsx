import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";

export const Route = createFileRoute("/app/memory")({
  head: () => ({ meta: [{ title: "City Memory · Axiom" }] }),
  component: Memory,
});

const FILTERS = ["All", "Road", "Water", "Streetlight", "Garbage", "Bridge", "Drainage"];
const SEVERITY = ["All", "High", "Medium", "Low"];

const MEMORIES: Array<{
  icon: IconName; title: string; ward: string; sim: number;
  cause: string; outcome: string; success: number; lesson: string; date: string;
}> = [
  { icon: "road", title: "Pothole cluster · MG Road", ward: "Ward 12", sim: 96, cause: "Drainage backlog", outcome: "Patched & drained", success: 92, lesson: "Pre-clear drains before monsoon", date: "Jun 2024" },
  { icon: "drop", title: "Water main rupture", ward: "Ward 8", sim: 84, cause: "Aged cast-iron joint", outcome: "Joint replacement", success: 95, lesson: "Schedule joint audits every 5 years", date: "May 2024" },
  { icon: "lamp", title: "Streetlight grid failure", ward: "Ward 5", sim: 71, cause: "Transformer overload", outcome: "Load rebalanced", success: 88, lesson: "Monitor seasonal load peaks", date: "Apr 2024" },
  { icon: "trash", title: "Garbage overflow recurring", ward: "Ward 3", sim: 80, cause: "Pickup schedule miss", outcome: "Rerouted vehicles", success: 76, lesson: "Friday pickups need 2 trucks", date: "Mar 2024" },
  { icon: "road", title: "Bridge expansion crack", ward: "Ward 9", sim: 89, cause: "Thermal cycling", outcome: "Joint resealed", success: 90, lesson: "Inspect post-heatwave", date: "Feb 2024" },
  { icon: "drop", title: "Sewer backup", ward: "Ward 6", sim: 65, cause: "Root intrusion", outcome: "Jet flushed", success: 84, lesson: "Tree-line mapping needed", date: "Jan 2024" },
];

function Memory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-3xl">City Memory</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Every resolved incident becomes a permanent, searchable memory.</p>
      </div>

      <div className="pixel-card p-4">
        <div className="flex items-center gap-2 border-[2px] border-[var(--border)] rounded-[10px] px-3 py-2 bg-white">
          <PixelIcon name="search" size={20} />
          <input className="flex-1 bg-transparent outline-none font-mono text-sm" placeholder="Search across 12,483 memories…" />
          <span className="font-pixel text-xs text-[var(--muted-foreground)]">⌘K</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f, i) => (
            <button key={f} className={`pixel-chip cursor-pointer ${i === 0 ? "!bg-[var(--primary)] !text-white" : ""}`}>{f}</button>
          ))}
          <span className="w-px bg-[var(--border-soft)] mx-2" />
          {SEVERITY.map((s) => (
            <button key={s} className="pixel-chip cursor-pointer">{s}</button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MEMORIES.map((m, i) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="pixel-card pixel-card-hover p-5"
          >
            <div className="flex items-start justify-between">
              <div className="pixel-border bg-white p-2">
                <PixelIcon name={m.icon} size={26} />
              </div>
              <span className="pixel-chip" style={{ background: "#eef0ff", borderColor: "var(--primary)", color: "var(--primary)" }}>
                {m.sim}% match
              </span>
            </div>
            <div className="font-pixel text-lg mt-3">{m.title}</div>
            <div className="font-mono text-xs text-[var(--muted-foreground)]">{m.ward} · {m.date}</div>
            <div className="mt-3 space-y-1.5 text-sm">
              <Row k="Root cause" v={m.cause} />
              <Row k="Outcome" v={m.outcome} />
              <Row k="Success rate" v={`${m.success}%`} hi />
            </div>
            <div className="mt-3 pt-3 border-t border-[var(--border-soft)] text-xs">
              <span className="font-pixel text-[var(--primary)]">Lesson:</span>{" "}
              <span className="text-[var(--muted-foreground)]">{m.lesson}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Row({ k, v, hi }: { k: string; v: string; hi?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--muted-foreground)]">{k}</span>
      <span className={hi ? "font-mono text-[var(--accent)]" : "font-mono"}>{v}</span>
    </div>
  );
}