import type { SignalState } from "@/services/trafficSimulation";
import { TrafficCone } from "lucide-react";

interface Props {
  signal: SignalState;
  setSignal: React.Dispatch<React.SetStateAction<SignalState>>;
  isAdmin: boolean;
  videoActive: boolean;
}

const SignalControlPanel = ({ signal, setSignal, isAdmin, videoActive }: Props) => {
  const lights: Array<{ color: "red" | "yellow" | "green"; hsl: string }> = [
    { color: "red", hsl: "var(--neon-red)" },
    { color: "yellow", hsl: "var(--neon-yellow)" },
    { color: "green", hsl: "var(--neon-green)" },
  ];

  const handleOverride = (color: "red" | "yellow" | "green") => {
    setSignal((prev) => ({ ...prev, active: color, timer: 30 }));
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrafficCone className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm font-semibold tracking-wider text-foreground">SIGNAL CONTROL</h3>
      </div>

      {/* Traffic light */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-muted/50 border border-border">
          {lights.map((l) => (
            <div
              key={l.color}
              className="w-10 h-10 rounded-full transition-all duration-500"
              style={{
                background: signal.active === l.color && videoActive
                  ? `hsl(${l.hsl})`
                  : "hsl(var(--muted))",
                boxShadow: signal.active === l.color && videoActive
                  ? `0 0 20px hsl(${l.hsl} / 0.6), 0 0 40px hsl(${l.hsl} / 0.3)`
                  : "none",
              }}
            />
          ))}
        </div>

        <div className="flex-1 space-y-2">
          <div className="text-center">
            <p className="font-display text-4xl font-bold neon-text-green">
              {videoActive ? signal.timer : "—"}
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
              {videoActive ? `${signal.active.toUpperCase()} PHASE` : "INACTIVE"}
            </p>
          </div>

          <div className="text-xs text-muted-foreground font-mono-code space-y-0.5">
            <p>Green: {signal.greenDuration}s</p>
            <p>Yellow: {signal.yellowDuration}s</p>
            <p>Red: {signal.redDuration}s</p>
          </div>
        </div>
      </div>

      {/* Admin override */}
      {isAdmin && videoActive && (
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Local Override Preview</p><p className="text-[10px] text-muted-foreground mb-2">Buttons preview the UI locally only. Live timing stays synced to backend video analytics.</p>
          <div className="flex gap-2">
            {lights.map((l) => (
              <button
                key={l.color}
                onClick={() => handleOverride(l.color)}
                className="flex-1 py-2 rounded-lg text-xs font-display font-semibold uppercase tracking-wider border border-border hover:opacity-80 transition-all"
                style={{
                  color: `hsl(${l.hsl})`,
                  borderColor: `hsl(${l.hsl} / 0.3)`,
                  background: `hsl(${l.hsl} / 0.1)`,
                }}
              >
                {l.color}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalControlPanel;
