import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PixelIcon } from "@/components/pixel/PixelIcon";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings · Axiom" }] }),
  component: Settings,
});

const TABS = [
  { id: "org", label: "Organization", icon: "shield" as const },
  { id: "notif", label: "Notifications", icon: "bell" as const },
  { id: "model", label: "AI Model", icon: "brain" as const },
  { id: "api", label: "API Keys", icon: "bolt" as const },
  { id: "profile", label: "Profile", icon: "user" as const },
];

function Settings() {
  const [tab, setTab] = useState("org");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-pixel text-3xl">Settings</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Configure your memory engine.</p>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-4">
        <div className="pixel-card p-3 h-fit">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-pixel text-sm ${
                tab === t.id ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--muted)]"
              }`}>
              <span className={tab === t.id ? "brightness-0 invert" : ""}><PixelIcon name={t.icon} size={18} /></span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="pixel-card p-6 space-y-5">
          <Field label="Organization name" value="Mumbai Municipal Corp" />
          <Field label="Primary contact" value="admin@axiom.city" />
          <Field label="Region" value="Mumbai · IN" />
          <div className="pixel-card-soft p-4">
            <div className="font-pixel text-sm">AI Model</div>
            <div className="font-mono text-xs text-[var(--muted-foreground)]">Axiom Memory v3 · 12,483 memories indexed</div>
          </div>
          <button className="pixel-btn pixel-btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="font-pixel text-xs uppercase tracking-widest text-[var(--muted-foreground)]">{label}</span>
      <input defaultValue={value} className="mt-1 w-full border-[2px] border-[var(--border)] rounded-md px-3 py-2 font-mono bg-white" />
    </label>
  );
}