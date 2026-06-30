export function AxiomLogo({ size = 36 }: { size?: number }) {
  // Tiny pixel-art "A" cube
  const px = size / 12;
  const c = "#3b3b98";
  const c2 = "#5c6bc0";
  const c3 = "#3ddc97";
  const cells: Array<[number, number, string]> = [
    [5, 1, c], [6, 1, c],
    [4, 2, c], [5, 2, c2], [6, 2, c2], [7, 2, c],
    [3, 3, c], [4, 3, c2], [5, 3, "#fff"], [6, 3, "#fff"], [7, 3, c2], [8, 3, c],
    [3, 4, c], [4, 4, c2], [5, 4, c2], [6, 4, c2], [7, 4, c2], [8, 4, c],
    [3, 5, c], [4, 5, c], [5, 5, c], [6, 5, c], [7, 5, c], [8, 5, c],
    [3, 6, c], [4, 6, "#fff"], [5, 6, c2], [6, 6, c2], [7, 6, "#fff"], [8, 6, c],
    [3, 7, c], [4, 7, c2], [7, 7, c2], [8, 7, c],
    [3, 8, c3], [8, 8, c3],
  ];
  return (
    <svg width={size} height={size} viewBox={`0 0 12 12`} shapeRendering="crispEdges" className="pixelated">
      <rect x="0" y="0" width="12" height="12" fill="#fff" />
      {cells.map(([x, y, color], i) => (
        <rect key={i} x={x} y={y} width="1" height="1" fill={color} />
      ))}
    </svg>
  );
}

export function AxiomMark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="pixel-border p-1 bg-white">
        <AxiomLogo size={32} />
      </div>
      <div className="leading-none">
        <div className="font-pixel text-2xl tracking-wide" style={{ color: "var(--primary)" }}>AXIOM</div>
        <div className="font-mono text-[10px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          CITY · MEMORY · ENGINE
        </div>
      </div>
    </div>
  );
}