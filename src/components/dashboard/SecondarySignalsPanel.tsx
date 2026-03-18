import { Radar } from "lucide-react";

interface NodeState {
  state: string;
  timer: number;
  phase: string;
}

interface Props {
  nodes: Record<string, NodeState>;
  activeNode: string;
  videoActive: boolean;
}

const order = ["B", "C", "D"] as const;

function lensClass(isOn: boolean, tone: "red" | "yellow" | "green") {
  const palette = {
    red: isOn ? "bg-destructive shadow-[0_0_18px_rgba(255,68,68,0.6)]" : "bg-destructive/15",
    yellow: isOn ? "bg-warning shadow-[0_0_18px_rgba(255,214,10,0.55)]" : "bg-warning/15",
    green: isOn ? "bg-primary shadow-[0_0_18px_rgba(0,255,163,0.55)]" : "bg-primary/15",
  };
  return palette[tone];
}

export default function SecondarySignalsPanel({ nodes, activeNode, videoActive }: Props) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Radar className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm font-semibold tracking-wider text-foreground">SECONDARY JUNCTION SIGNALS</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {order.map((nodeId) => {
          const node = nodes?.[nodeId] ?? { state: "RED", timer: 0, phase: "WAITING" };
          const normalized = node.state?.toUpperCase?.() || "RED";
          const statusLabel = activeNode === nodeId ? "ACTIVE" : node.phase || "WAITING";
          const timer = videoActive ? Math.max(0, Math.ceil(node.timer || 0)) : 0;

          return (
            <div key={nodeId} className="rounded-2xl border border-border bg-muted/20 p-4 flex items-center gap-4">
              <div className="rounded-[28px] border border-border bg-background/80 px-3 py-4 flex flex-col items-center gap-3 min-w-[64px]">
                <div className={`w-8 h-8 rounded-full transition-all ${lensClass(normalized === "RED", "red")}`} />
                <div className={`w-8 h-8 rounded-full transition-all ${lensClass(normalized === "YELLOW", "yellow")}`} />
                <div className={`w-8 h-8 rounded-full transition-all ${lensClass(normalized === "GREEN", "green")}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-display text-sm tracking-[0.24em] text-muted-foreground">NODE {nodeId}</p>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mt-1">{statusLabel}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-lg ${normalized === "GREEN" ? "neon-text-green" : normalized === "YELLOW" ? "text-warning" : "text-destructive"}`}>
                      {normalized}
                    </p>
                    <p className="text-xs text-muted-foreground">{timer}s</p>
                  </div>
                </div>

                <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${normalized === "GREEN" ? "bg-primary" : normalized === "YELLOW" ? "bg-warning" : "bg-destructive"}`}
                    style={{ width: `${normalized === "RED" ? 18 : Math.min(100, Math.max(12, timer * 6))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono-code uppercase tracking-wider text-muted-foreground">
                  <span>Cycle arm</span>
                  <span>{videoActive ? timer : "--"} sec</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
