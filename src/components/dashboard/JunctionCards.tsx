import { MapPin } from "lucide-react";
import type { JunctionData } from "@/services/trafficSimulation";

interface Props {
  junctions: JunctionData[];
  selectedJunction: string;
  onSelect: (id: string) => void;
  videoActive: boolean;
}

const statusStyles = {
  green: { bg: "bg-primary/10", border: "neon-border-green", dot: "bg-primary" },
  yellow: { bg: "bg-warning/10", border: "border-warning/40", dot: "bg-warning" },
  red: { bg: "bg-destructive/10", border: "border-destructive/40", dot: "bg-destructive" },
};

const JunctionCards = ({ junctions, selectedJunction, onSelect, videoActive }: Props) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm font-semibold tracking-wider text-foreground">MULTI-JUNCTION MONITOR</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {junctions.map((j) => {
          const s = statusStyles[j.status];
          const isSelected = j.id === selectedJunction;
          return (
            <button
              key={j.id}
              onClick={() => onSelect(j.id)}
              className={`p-4 rounded-lg border text-left transition-all ${s.bg} ${s.border} ${isSelected ? "ring-2 ring-primary/30" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground">{j.name}</span>
                <span className={`w-3 h-3 rounded-full ${s.dot} ${videoActive ? "animate-pulse-neon" : ""}`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-bold text-foreground">
                  {videoActive ? j.vehicleCount : "—"}
                </span>
                <span className="text-xs text-muted-foreground">{videoActive ? j.density : "—"}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JunctionCards;
