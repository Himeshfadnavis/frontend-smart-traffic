import { Car, Bike, Bus, Truck, Activity } from "lucide-react";
import type { TrafficData } from "@/services/trafficSimulation";

interface Props {
  data: TrafficData;
  videoActive: boolean;
}

const stats = [
  { key: "total" as const, label: "Total Vehicles", icon: Activity, glowClass: "neon-text-green" },
  { key: "cars" as const, label: "Cars", icon: Car, glowClass: "neon-text-blue" },
  { key: "bikes" as const, label: "Bikes", icon: Bike, glowClass: "neon-text-purple" },
  { key: "buses" as const, label: "Buses", icon: Bus, glowClass: "neon-text-yellow" },
  { key: "trucks" as const, label: "Trucks", icon: Truck, glowClass: "neon-text-red" },
];

const TrafficStatsCards = ({ data, videoActive }: Props) => {
  const densityColor = data.density === "High" ? "text-destructive" : data.density === "Medium" ? "text-warning" : "text-primary";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.key} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className={`font-display text-2xl font-bold ${s.glowClass}`}>
              {videoActive ? data[s.key] : "—"}
            </p>
          </div>
        );
      })}

      {/* Density */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Density</span>
        </div>
        <p className={`font-display text-2xl font-bold ${densityColor}`}>
          {videoActive ? data.density : "—"}
        </p>
      </div>
    </div>
  );
};

export default TrafficStatsCards;
