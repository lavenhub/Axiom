import { useId } from "react";

type IconName =
  | "brain" | "shield" | "check" | "heart" | "road" | "drop"
  | "lamp" | "trash" | "robot" | "graph" | "chat" | "chart"
  | "settings" | "home" | "plus" | "search" | "bell" | "bolt"
  | "memory" | "predict" | "report" | "user";

// Each icon is an 8x8 pixel grid; provide rows of color codes.
// Letters map to colors:
const PALETTE: Record<string, string> = {
  ".": "transparent",
  "1": "#3b3b98", // primary
  "2": "#5c6bc0", // secondary
  "3": "#3ddc97", // accent
  "4": "#ff5c5c", // danger
  "5": "#ffd54f", // highlight
  "0": "#111111", // dark
  "w": "#ffffff",
  "g": "#8a8aa3",
};

const ICONS: Record<IconName, string[]> = {
  home: [
    "...11...",
    "..1221..",
    ".122221.",
    "12222221",
    "01222210",
    "01w22w10",
    "01w22w10",
    "00000000",
  ],
  report: [
    "..4444..",
    ".444444.",
    "44w44w44",
    "44444444",
    "444ww444",
    "44w44w44",
    ".444444.",
    "..4444..",
  ],
  memory: [
    "00000000",
    "0333333 0".replace(" ", ""),
    "03ww33w0",
    "03w333w0",
    "03w333w0",
    "03ww33w0",
    "03333330",
    "00000000",
  ],
  graph: [
    "..1...1.",
    ".121.121",
    "1.1.1.1.",
    ".1.1.1..",
    "..131...",
    ".1.1.1..",
    "1.1.1.1.",
    ".1...1..",
  ],
  chat: [
    "01111110",
    "1wwwwww1",
    "1w0w0ww1",
    "1wwwwww1",
    "1wwwwww1",
    "01111110",
    "..11....",
    ".11.....",
  ],
  predict: [
    "00000000",
    "0wwwww50",
    "0wwww550",
    "0www5wW0".replace("W", "w"),
    "0ww5www0",
    "0w5wwww0",
    "05wwwww0",
    "00000000",
  ],
  chart: [
    "00000000",
    "0wwwww 0".replace(" ", "w"),
    "0w11ww30",
    "0w11w330",
    "0w11w330",
    "0w11233 0".replace(" ", "0"),
    "0wwwwww0",
    "00000000",
  ],
  settings: [
    "...gg...",
    ".g.gg.g.",
    "ggg22ggg",
    "g2222222",
    "g22ww22g",
    "ggg22ggg",
    ".g.gg.g.",
    "...gg...",
  ],
  brain: [
    "..1111..",
    ".122221.",
    "12ww2ww1",
    "1222w221",
    "12w2w221",
    "12ww2221",
    ".122221.",
    "..1111..",
  ],
  shield: [
    "..2222..",
    ".222222.",
    "22ww2222",
    "222ww222",
    "2222ww22",
    "22222ww2",
    ".222222.",
    "..2222..",
  ],
  check: [
    "..3333..",
    ".333333.",
    "33ww3333",
    "333ww333",
    "33w3w333",
    "3333w333",
    ".333333.",
    "..3333..",
  ],
  heart: [
    ".44..44.",
    "44444444",
    "44w4w444",
    "44444444",
    ".444444.",
    "..4444..",
    "...44...",
    "........",
  ],
  road: [
    "00000000",
    "0g0gg0g0",
    "0g0gg0g0",
    "0gw55wg0",
    "0gw55wg0",
    "0g0gg0g0",
    "0g0gg0g0",
    "00000000",
  ],
  drop: [
    "...22...",
    "..2222..",
    ".222222.",
    "22wwww22",
    "22wwww22",
    "2222ww22",
    ".222222.",
    "..2222..",
  ],
  lamp: [
    "..5555..",
    ".555555.",
    "55w55555",
    "55555555",
    ".555555.",
    "..5555..",
    "...55...",
    "...00...",
  ],
  trash: [
    "..0000..",
    ".000000.",
    "00000000",
    ".gggggg.",
    ".g0gg0g.",
    ".g0gg0g.",
    ".gggggg.",
    "..gggg..",
  ],
  robot: [
    "..0000..",
    ".010010.",
    "01111110",
    "01w11w10",
    "0111w110",
    "01wwww10",
    "01100110",
    "01.00.10",
  ],
  plus: [
    "...00...",
    "...00...",
    "...00...",
    "00000000",
    "00000000",
    "...00...",
    "...00...",
    "...00...",
  ],
  search: [
    ".0000...",
    "0wwww0..",
    "0www00..",
    "0wwww0..",
    ".0000...",
    "....0000",
    "....0000",
    "........",
  ],
  bell: [
    "...00...",
    "..0000..",
    ".055550.",
    ".055550.",
    ".055550.",
    "00000000",
    "...00...",
    "....0...",
  ],
  bolt: [
    "....55..",
    "...555..",
    "..5550..",
    ".55555..",
    "00555...",
    "..555...",
    "..550...",
    "..50....",
  ],
  user: [
    "..0000..",
    ".0wwww0.",
    "0w0ww0w0",
    "0wwwwww0",
    ".0wwww0.",
    "..0000..",
    ".000000.",
    "00000000",
  ],
};

export function PixelIcon({ name, size = 24 }: { name: IconName; size?: number }) {
  const id = useId();
  const grid = ICONS[name];
  if (!grid) return null;
  const rows = grid.map((r) => r.padEnd(8, ".").slice(0, 8));
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      className="pixelated shrink-0"
      aria-hidden
      role="img"
      data-icon-id={id}
    >
      {rows.map((row, y) =>
        row.split("").map((ch, x) => {
          const fill = PALETTE[ch];
          if (!fill || fill === "transparent") return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />;
        }),
      )}
    </svg>
  );
}

export type { IconName };