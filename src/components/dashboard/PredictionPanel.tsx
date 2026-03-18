import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AnalysisData } from "@/services/trafficSimulation";

interface Props {
  analysis: AnalysisData;
  videoActive: boolean;
}

const PredictionPanel = ({ analysis, videoActive }: Props) => {
  const stateColor = analysis.trafficState === "Heavy" ? "neon-text-red" : analysis.trafficState === "Moderate" ? "neon-text-yellow" : "neon-text-green";
  const TrendIcon = analysis.trend === "increasing" ? TrendingUp : analysis.trend === "decreasing" ? TrendingDown : Minus;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-accent" />
        <h3 className="font-display text-sm font-semibold tracking-wider text-foreground">AI ANALYSIS</h3>
      </div>

      {!videoActive ? (
        <p className="text-sm text-muted-foreground">Start feed to activate AI engine</p>
      ) : (
        <div className="space-y-4">
          {/* Congestion Score */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Congestion Score</span>
              <span className={`font-display text-lg font-bold ${stateColor}`}>{analysis.congestionScore}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${analysis.congestionScore}%`,
                  background: analysis.congestionScore > 70
                    ? "hsl(var(--neon-red))"
                    : analysis.congestionScore > 40
                    ? "hsl(var(--neon-yellow))"
                    : "hsl(var(--neon-green))",
                  boxShadow: `0 0 10px ${analysis.congestionScore > 70 ? "hsl(var(--neon-red) / 0.5)" : analysis.congestionScore > 40 ? "hsl(var(--neon-yellow) / 0.5)" : "hsl(var(--neon-green) / 0.5)"}`,
                }}
              />
            </div>
          </div>

          {/* State */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Traffic State</span>
            <span className={`font-display text-sm font-semibold ${stateColor}`}>{analysis.trafficState}</span>
          </div>

          {/* Prediction */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 mb-1">
              <TrendIcon className="w-4 h-4 text-accent" />
              <span className="text-xs text-accent font-medium uppercase tracking-wider">Prediction</span>
            </div>
            <p className="text-sm text-foreground">{analysis.prediction}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;
