import { Gauge, Clock, Zap } from "lucide-react";
import type { PerformanceMetrics } from "@/services/trafficSimulation";

interface Props {
  metrics: PerformanceMetrics;
  videoActive: boolean;
}

const PerformancePanel = ({ metrics, videoActive }: Props) => {
  const items = [
    { label: "Avg Wait Reduction", value: metrics.avgWaitReduction, unit: "%", icon: Clock, glow: "neon-text-green" },
    { label: "Flow Improvement", value: metrics.flowImprovement, unit: "%", icon: Zap, glow: "neon-text-blue" },
    { label: "Signal Efficiency", value: metrics.signalEfficiency, unit: "%", icon: Gauge, glow: "neon-text-yellow" },
  ];

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm font-semibold tracking-wider text-foreground">PERFORMANCE</h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <span className={`font-display text-lg font-bold ${item.glow}`}>
                  {videoActive ? `${item.value.toFixed(1)}${item.unit}` : "—"}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: videoActive ? `${item.value}%` : "0%",
                    background: "hsl(var(--primary))",
                    boxShadow: "0 0 8px hsl(var(--primary) / 0.4)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformancePanel;
