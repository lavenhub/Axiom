import { Link, useRouterState } from "@tanstack/react-router";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";
import { AxiomMark } from "@/components/pixel/Logo";

type NavItem = { to: string; label: string; icon: IconName };

const NAV: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: "home" },
  { to: "/app/report", label: "Report Issue", icon: "report" },
  { to: "/app/memory", label: "City Memory", icon: "memory" },
  { to: "/app/graph", label: "Knowledge Graph", icon: "graph" },
  { to: "/app/ask", label: "Ask Axiom", icon: "chat" },
  { to: "/app/predictions", label: "Predictions", icon: "predict" },
  { to: "/app/analytics", label: "Analytics", icon: "chart" },
  { to: "/app/settings", label: "Settings", icon: "settings" },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="w-64 shrink-0 border-r-[3px] border-[var(--border)] bg-white flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b-[3px] border-[var(--border)]">
        <Link to="/">
          <AxiomMark />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {NAV.map((item) => {
          const active = item.to === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-[10px] border-[2px] font-pixel text-[15px] transition-all ${
                active
                  ? "bg-[var(--primary)] text-white border-[var(--border)] shadow-[3px_3px_0_0_var(--border)]"
                  : "border-transparent hover:border-[var(--border)] hover:bg-[var(--muted)]"
              }`}
            >
              <span className={`shrink-0 ${active ? "brightness-0 invert" : ""}`}>
                <PixelIcon name={item.icon} size={22} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-3 pixel-card-soft">
        <div className="flex items-center gap-2">
          <PixelIcon name="brain" size={28} />
          <div className="font-pixel text-sm">AXIOM AI STATUS</div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] pulse-dot" />
          <span>All systems operational</span>
        </div>
        <div className="font-mono text-[11px] mt-1.5 text-[var(--muted-foreground)]">
          Memory Engine: <span className="text-[var(--accent)] font-pixel">Active</span>
        </div>
      </div>
    </aside>
  );
}