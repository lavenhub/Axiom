import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { api } from "@/lib/api";

export const Route = createFileRoute("/app/ask")({
  head: () => ({ meta: [{ title: "Ask Axiom · Axiom" }] }),
  component: Ask,
});

const EXAMPLES = [
  "Why do potholes keep appearing?",
  "Show recurring drainage failures.",
  "Find similar streetlight issues.",
  "Which repairs are most effective?",
];

function Ask() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function ask(text: string) {
    setQ(text);
    setSubmitted(text);
    setLoading(true);
    try {
      const data = await api.askAxiom(text);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mt-4">
        <div className="font-pixel text-xs uppercase tracking-widest text-[var(--primary)]">Ask Axiom</div>
        <h1 className="font-pixel text-4xl mt-2">What does the city remember?</h1>
      </div>

      <div className="mt-8 pixel-card p-3 flex items-center gap-2">
        <PixelIcon name="chat" size={22} />
        <input
          value={q} onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && q.trim() && !loading && ask(q.trim())}
          placeholder="Ask anything about your city…"
          className="flex-1 bg-transparent outline-none px-2 py-2 font-mono"
          disabled={loading}
        />
        <button onClick={() => q.trim() && !loading && ask(q.trim())} disabled={loading} className="pixel-btn pixel-btn-primary !py-2">
          {loading ? "Thinking..." : "Ask →"}
        </button>
      </div>

      {!submitted && (
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => ask(ex)} disabled={loading} className="pixel-card pixel-card-hover p-4 text-left">
              <div className="font-pixel text-sm">"{ex}"</div>
              <div className="font-mono text-xs text-[var(--muted-foreground)] mt-1">Try this prompt</div>
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {submitted && result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-4">
            <Block delay={0} label="Answer" icon="brain">
              {result.answer}
            </Block>
            <Block delay={0.2} label="Confidence" icon="chart">
              {(result.confidence * 100).toFixed(0)}% confidence in this answer.
            </Block>
            <Block delay={0.4} label="Recommendations" icon="bolt" highlight>
              {result.recommendations.map((r: string, i: number) => (
                <div key={i} className="mb-2">• {r}</div>
              ))}
            </Block>
            {result.sources && result.sources.length > 0 && (
              <Block delay={0.6} label="Sources" icon="memory">
                {result.sources.length} related memories found.
              </Block>
            )}
          </motion.div>
        )}
        {submitted && loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 pixel-card p-8 text-center">
            <div className="font-pixel text-xl">Axiom is thinking...</div>
            <div className="mt-2 font-mono text-xs text-[var(--muted-foreground)]">Searching through city memory</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Block({ label, icon, children, delay = 0, highlight }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`pixel-card p-5 ${highlight ? "!bg-[#eef0ff]" : ""}`}
    >
      <div className="flex items-center gap-2">
        <PixelIcon name={icon} size={20} />
        <div className="font-pixel uppercase tracking-widest text-xs text-[var(--muted-foreground)]">{label}</div>
      </div>
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}