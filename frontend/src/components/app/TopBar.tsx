import { PixelIcon } from "@/components/pixel/PixelIcon";

export function TopBar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b-[3px] border-[var(--border)]">
      <div className="flex items-center gap-4 px-6 py-3">
        {title && (
          <div className="font-pixel text-xl mr-2">{title}</div>
        )}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-2 pixel-card-soft px-3 py-2 border-[2px]! border-[var(--border)]!">
            <PixelIcon name="search" size={18} />
            <input
              placeholder="Search memories, locations, issues…"
              className="bg-transparent outline-none flex-1 text-sm font-mono placeholder:text-[var(--muted-foreground)]"
            />
            <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[var(--border)] rounded">⌘K</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="font-mono text-xs text-[var(--muted-foreground)] hidden md:block">
            <span className="text-[var(--foreground)]">28°C</span> · Mumbai · {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <button className="relative pixel-btn !p-2">
            <PixelIcon name="bell" size={18} />
            <span className="absolute -top-1 -right-1 bg-[var(--destructive)] text-white text-[10px] font-pixel w-4 h-4 rounded-full flex items-center justify-center border border-[var(--border)]">3</span>
          </button>
          <div className="flex items-center gap-2 pixel-card-soft px-2 py-1.5 border-[2px]! border-[var(--border)]!">
            <PixelIcon name="user" size={24} />
            <div className="leading-tight pr-1">
              <div className="font-pixel text-sm">Municipal Admin</div>
              <div className="font-mono text-[10px] text-[var(--muted-foreground)]">admin@axiom.city</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}