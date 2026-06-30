import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AxiomMark } from "@/components/pixel/Logo";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Axiom — Cities Should Never Forget" },
      { name: "description", content: "Axiom transforms every civic issue into permanent institutional knowledge — an AI memory engine for cities." },
      { property: "og:title", content: "Axiom — City Memory Engine" },
      { property: "og:description", content: "Cities should never forget. The AI memory engine for modern municipalities." },
    ],
  }),
  component: Landing,
});

const NAV_LINKS = [
  { label: "Technology", href: "#technology" },
  { label: "Memory", href: "#memory" },
  { label: "Knowledge", href: "#knowledge" },
  { label: "About", href: "#about" },
  { label: "Login", href: "#login" },
];

const TIMELINE = [
  { label: "Report", icon: "report" as const },
  { label: "Reason", icon: "brain" as const },
  { label: "Learn", icon: "memory" as const },
  { label: "Predict", icon: "predict" as const },
  { label: "Improve", icon: "check" as const },
];

function Landing() {
  return (
    <div className="min-h-screen bg-white text-[var(--foreground)]">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b-[3px] border-[var(--border)]">
        <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/"><AxiomMark /></Link>
          <div className="hidden md:flex items-center gap-7 font-pixel text-[15px]">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-[var(--primary)] transition">{l.label}</a>
            ))}
          </div>
          <Link to="/app" className="pixel-btn pixel-btn-primary">
            Open Dashboard
            <span>→</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="relative w-full px-6 pt-20 pb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 pixel-chip mb-6"
            style={{ background: "#eef0ff", borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full pulse-dot" />
            INSTITUTIONAL MEMORY · ONLINE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-pixel text-5xl md:text-7xl leading-[1.05] max-w-4xl"
          >
            Cities Should
            <br />
            <span className="text-[var(--primary)]">Never Forget.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]"
          >
            Every road, pipeline, bridge and streetlight carries a history.
            Axiom transforms every civic issue into permanent institutional knowledge —
            so your city never solves the same problem twice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-4"
          >
            <Link to="/app" className="pixel-btn pixel-btn-primary text-base">
              <PixelIcon name="memory" size={18} /> Explore Memory
            </Link>
            <a href="#demo" className="pixel-btn text-base">
              <PixelIcon name="bolt" size={18} /> Watch Demo
            </a>
          </motion.div>

          {/* Stat strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl"
          >
            {[
              { k: "12,483", l: "Memories Stored" },
              { k: "94%", l: "AI Confidence" },
              { k: "91%", l: "Prediction Accuracy" },
              { k: "82%", l: "Infrastructure Health" },
            ].map((s) => (
              <div key={s.l} className="pixel-card pixel-card-hover p-4">
                <div className="font-mono text-2xl text-[var(--primary)]">{s.k}</div>
                <div className="font-pixel text-[11px] uppercase tracking-wider mt-1 text-[var(--muted-foreground)]">{s.l}</div>
              </div>
            ))}
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-20 w-full max-w-5xl"
          >
            <div className="font-pixel text-xs uppercase tracking-widest text-[var(--muted-foreground)] mb-4">
              The Memory Loop
            </div>
            <div className="pixel-card p-6 w-full">
              <div className="flex items-center justify-center flex-wrap gap-y-6">
                {TIMELINE.map((t, i) => (
                  <div key={t.label} className="flex items-center gap-3">
                    <div className="pixel-border bg-white p-3">
                      <PixelIcon name={t.icon} size={28} />
                    </div>
                    <div className="font-pixel text-lg">{t.label}</div>
                    {i < TIMELINE.length - 1 && (
                      <div className="hidden md:flex items-center gap-1 mx-3 text-[var(--primary)]">
                        <span className="w-1.5 h-1.5 bg-[var(--primary)]" />
                        <span className="w-1.5 h-1.5 bg-[var(--primary)]" />
                        <span className="w-1.5 h-1.5 bg-[var(--primary)]" />
                        <span className="font-pixel text-lg">→</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <Section id="technology" eyebrow="01 · Foundation" title="How Memory Works">
        <p>
          Axiom ingests every civic report — text, image, audio, sensor stream —
          and indexes it into a permanent, queryable memory layer.
          Each incident is fingerprinted, geo-anchored, and connected to its causes,
          repairs, and outcomes.
        </p>
        <FeatureGrid items={[
          { icon: "report", title: "Multimodal Intake", body: "Photos, video, audio, text & IoT — captured into a single timeline." },
          { icon: "brain", title: "Reasoning Layer", body: "Axiom reasons across history to find the real root cause." },
          { icon: "memory", title: "Permanent Memory", body: "Every resolved incident becomes searchable institutional knowledge." },
        ]} />
      </Section>

      <Section id="memory" eyebrow="02 · Intelligence" title="Collective Intelligence">
        <p>
          One ward's pothole story informs another ward's drainage plan.
          Axiom links incidents across boroughs, contractors and decades —
          turning isolated repairs into shared lessons.
        </p>
        <FeatureGrid items={[
          { icon: "graph", title: "Linked Incidents", body: "Similar failures cluster into evidence chains automatically." },
          { icon: "shield", title: "Trusted Sources", body: "Every memory carries provenance: who, when, where, why." },
          { icon: "check", title: "Proven Repairs", body: "Recommend only fixes with measured historical success." },
        ]} />
      </Section>

      <Section id="knowledge" eyebrow="03 · Graph" title="Knowledge Graph">
        <p>
          Roads, pipelines, citizens, engineers, weather and budgets become
          living nodes in a city-scale graph — explorable, queryable, learnable.
        </p>
        <FeatureGrid items={[
          { icon: "road", title: "Infrastructure Nodes", body: "Every asset is a node with state, history and dependencies." },
          { icon: "drop", title: "Cause Edges", body: "Edges encode causation — not just correlation." },
          { icon: "lamp", title: "Live Telemetry", body: "Sensors update the graph in real-time." },
        ]} />
      </Section>

      <Section id="about" eyebrow="04 · Foresight" title="Prediction Engine">
        <p>
          With years of memory at its core, Axiom forecasts where the next failure
          will occur — and proposes the repair that has historically worked best.
        </p>
        <FeatureGrid items={[
          { icon: "predict", title: "Risk Forecasts", body: "Pothole, pipeline and outage probabilities, 7–90 days out." },
          { icon: "chart", title: "Confidence Scoring", body: "Every prediction carries an honest confidence interval." },
          { icon: "bolt", title: "Pre-emptive Action", body: "Trigger work orders before citizens ever file a complaint." },
        ]} />
      </Section>

      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="pixel-card p-10 md:p-14 text-center">
          <div className="font-pixel text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
            Begin the Memory
          </div>
          <h2 className="font-pixel text-4xl md:text-5xl mt-3">
            Your city is already learning.
            <br />
            <span className="text-[var(--primary)]">Start remembering.</span>
          </h2>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <Link to="/app" className="pixel-btn pixel-btn-primary">Open Dashboard</Link>
            <a href="#demo" className="pixel-btn">Schedule Briefing</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-[var(--border)]">
        <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AxiomMark />
          </div>
          <div className="font-mono text-xs text-[var(--muted-foreground)]">
            Building smarter cities through collective memory · © {new Date().getFullYear()} Axiom
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="w-full px-6 py-20 border-t border-[var(--border-soft)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center w-full"
      >
        <div className="font-pixel text-xs uppercase tracking-widest text-[var(--primary)]">{eyebrow}</div>
        <h2 className="font-pixel text-4xl md:text-5xl mt-3 max-w-3xl mx-auto">{title}</h2>
        <div className="mt-4 max-w-2xl mx-auto text-[var(--muted-foreground)] text-lg">{children}</div>
      </motion.div>
    </section>
  );
}

function FeatureGrid({ items }: { items: { icon: any; title: string; body: string }[] }) {
  return (
    <div className="mt-10 grid md:grid-cols-3 gap-5 w-full max-w-6xl mx-auto">
      {items.map((it, i) => (
        <motion.div
          key={it.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="pixel-card pixel-card-hover p-6 flex flex-col items-center text-center"
        >
          <div className="pixel-border bg-white p-2.5 w-fit">
            <PixelIcon name={it.icon} size={28} />
          </div>
          <div className="font-pixel text-lg mt-4">{it.title}</div>
          <div className="text-sm text-[var(--muted-foreground)] mt-2">{it.body}</div>
        </motion.div>
      ))}
    </div>
  );
}
