import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { api } from "@/lib/api";

export const Route = createFileRoute("/app/report")({
  head: () => ({ meta: [{ title: "Report Issue · Axiom" }] }),
  component: Report,
});

type Stage = "form" | "analyzing" | "result";

const STEPS = [
  "Analyzing media…",
  "Searching collective memory…",
  "Finding similar incidents…",
  "Reasoning about root cause…",
];

function Report() {
  const [stage, setStage] = useState<Stage>("form");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    citizenName: "",
    citizenEmail: ""
  });
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStage("analyzing");
    setStep(0);
    
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= STEPS.length) {
        clearInterval(id);
      }
    }, 900);

    try {
      const data = await api.createIssue({
        title: formData.title,
        description: formData.description
      });
      
      console.log("API Response:", data);
      
      setResult(data);
      setTimeout(() => setStage("result"), 1000);
    } catch (err) {
      console.error("Error submitting issue:", err);
      setStage("form");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-3xl">Report an Issue</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Upload media — Axiom will reason against the entire city memory.</p>
      </div>

      <AnimatePresence mode="wait">
        {stage === "form" && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <form onSubmit={handleSubmit} className="pixel-card p-8 space-y-6">
              <div className="space-y-2">
                <label className="font-pixel text-sm uppercase tracking-widest">Issue Title</label>
                <input 
                  type="text" 
                  required 
                  className="w-full pixel-card p-3"
                  placeholder="e.g., Large pothole on Main Street"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="font-pixel text-sm uppercase tracking-widest">Description</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full pixel-card p-3"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-pixel text-sm uppercase tracking-widest">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full pixel-card p-3"
                    value={formData.citizenName}
                    onChange={e => setFormData({...formData, citizenName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-sm uppercase tracking-widest">Email</label>
                  <input 
                    type="email" 
                    className="w-full pixel-card p-3"
                    value={formData.citizenEmail}
                    onChange={e => setFormData({...formData, citizenEmail: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="pixel-btn pixel-btn-primary w-full text-lg">
                <PixelIcon name="plus" size={18} className="mr-2" /> Report Issue & Analyze
              </button>
            </form>
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div key="an" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pixel-card p-10">
            <div className="flex items-center justify-center">
              <PixelNodes />
            </div>
            <div className="mt-8 max-w-md mx-auto space-y-2">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <span className={`w-3 h-3 border-[2px] border-[var(--border)] ${
                    i < step ? "bg-[var(--accent)]" : i === step ? "bg-[var(--highlight)] pulse-dot" : "bg-white"
                  }`} />
                  <span className={`font-pixel ${i <= step ? "" : "text-[var(--muted-foreground)]"}`}>{s}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {stage === "result" && result && (
          <motion.div key="res" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 pixel-card p-5">
                <div className="flex items-center gap-3">
                  <div className="pixel-border bg-white p-2"><PixelIcon name="road" size={28} /></div>
                  <div>
                    <div className="font-pixel text-2xl">{result.aiAnalysis?.category || "OTHER"} Issue</div>
                    <div className="font-mono text-xs text-[var(--muted-foreground)]">Ward 1 · {result.issue?.title || ""}</div>
                  </div>
                  <div className="ml-auto pixel-chip" style={{ background: "#ffe5e5", borderColor: "var(--destructive)", color: "var(--destructive)" }}>
                    {result.aiAnalysis?.severity?.toUpperCase() || "MEDIUM"}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                  <Stat label="Confidence" value="92%" />
                  <Stat label="Root cause" value={result.aiAnalysis?.possibleCauses?.[0] || "Unknown"} />
                  <Stat label="Est. cost" value="₹1.2L" />
                  <Stat label="Repair time" value="2 days" />
                </div>
                <div className="mt-5 pixel-card-soft p-4">
                  <div className="font-pixel text-sm uppercase text-[var(--muted-foreground)]">AI Summary</div>
                  <p className="mt-1">{result.aiAnalysis?.summary || "No summary available"}</p>
                </div>
                <div className="mt-5 pixel-card-soft p-4">
                  <div className="font-pixel text-sm uppercase text-[var(--muted-foreground)]">Suggested Repair</div>
                  <p className="mt-1">Refer to similar memories and use proven repair methods for {result.aiAnalysis?.category || "OTHER"} issues.</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {!result.repairAssigned && !result.repairCompleted && (
                    <button 
                      className="pixel-btn pixel-btn-primary" 
                      onClick={async () => {
                        try {
                          // Quick mock: Assign to the first engineer in the DB
                          const engRes = await fetch("http://localhost:3001/api/setup/engineers", { headers: { Authorization: `Bearer ${localStorage.getItem("axiom_token")}` } });
                          const engineers = await engRes.json();
                          const engineerId = engineers[0]?.id || "mock-engineer-id";
                          
                          const repair = await api.assignRepair({
                            issueId: result.issue.id,
                            engineerId,
                            description: "AI suggested repair route",
                            startDate: new Date().toISOString()
                          });
                          
                          setResult({ ...result, repairAssigned: true, repairId: repair.id });
                          alert("Repair Assigned to Engineer: " + (engineers[0]?.name || "Unknown"));
                        } catch(e: any) { alert("Error: " + e.message); }
                      }}
                    >
                      <PixelIcon name="user" size={16} className="mr-2"/> Assign Engineer
                    </button>
                  )}

                  {result.repairAssigned && !result.repairCompleted && (
                    <button 
                      className="pixel-btn !bg-[var(--accent)] !text-white !border-[var(--accent)]" 
                      onClick={async () => {
                        try {
                          const completeData = await api.completeRepair(result.repairId, {
                            outcome: "SUCCESS",
                            successScore: 88,
                            engineerNotes: "Repaired successfully based on AI recommendations.",
                            cost: 12500
                          });
                          setResult({ ...result, repairCompleted: true, memoryData: completeData.memory });
                          alert(completeData.message || "Repair completed & memory generated!");
                        } catch(e: any) { alert("Error: " + e.message); }
                      }}
                    >
                      <PixelIcon name="check" size={16} className="mr-2"/> Complete Repair (Store Memory)
                    </button>
                  )}

                  <button className="pixel-btn" onClick={() => { setStage("form"); setResult(null); }}>New Report</button>
                </div>
              </div>
              <div className="pixel-card p-5">
                <div className="font-pixel uppercase tracking-widest text-sm">Similar Memories ({result.similarMemories?.length || 0})</div>
                <ul className="mt-3 space-y-3">
                  {(result.similarMemories || []).slice(0,3).map((m: any, i: number) => (
                    <li key={i} className="pixel-card-soft p-3">
                      <div className="font-pixel text-sm">{m.title}</div>
                      <div className="font-mono text-[11px] text-[var(--muted-foreground)]">Success Score: {m.successScore}%</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pixel-card-soft p-3">
      <div className="font-pixel text-[10px] uppercase tracking-widest text-[var(--muted-foreground)]">{label}</div>
      <div className="font-mono text-xl mt-1">{value}</div>
    </div>
  );
}

function PixelNodes() {
  // 7 nodes pulsing
  return (
    <svg width="320" height="180" viewBox="0 0 320 180" shapeRendering="crispEdges">
      {[
        [60, 90], [120, 50], [120, 130], [180, 90], [240, 50], [240, 130], [290, 90]
      ].map(([x, y], i) => (
        <g key={i}>
          <motion.line x1={x} y1={y} x2={(i < 6 ? [120, 180, 180, 240, 290, 290][i] : x)} y2={(i < 6 ? [50, 90, 90, 50, 90, 90][i] : y)}
            stroke="#3b3b98" strokeWidth="2"
            animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }} />
          <motion.rect x={x - 6} y={y - 6} width="12" height="12" fill={["#3b3b98","#5c6bc0","#3ddc97","#ffd54f","#ff5c5c","#5c6bc0","#3b3b98"][i]}
            stroke="#1f1f1f" strokeWidth="2"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }} />
        </g>
      ))}
    </svg>
  );
}