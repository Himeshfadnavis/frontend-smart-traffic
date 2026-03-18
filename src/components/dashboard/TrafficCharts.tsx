import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";
import type { HistoryPoint, TrafficData } from "@/services/trafficSimulation";

interface Props {
  history: HistoryPoint[];
  trafficData: TrafficData;
  videoActive: boolean;
}

const COLORS = ["hsl(200, 100%, 55%)", "hsl(270, 100%, 65%)", "hsl(50, 100%, 55%)", "hsl(0, 100%, 60%)"];

const TrafficCharts = ({ history, trafficData, videoActive }: Props) => {
  const barData = [
    { name: "Cars", value: trafficData.cars },
    { name: "Bikes", value: trafficData.bikes },
    { name: "Buses", value: trafficData.buses },
    { name: "Trucks", value: trafficData.trucks },
  ];

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-display text-sm font-semibold tracking-wider text-foreground">LIVE VIDEO ANALYTICS</h3>
      </div>

      {!videoActive ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          Start backend video feed to see real-time charts derived from detected vehicles
        </div>
      ) : (
        <>
          <p className="text-[11px] text-muted-foreground font-mono-code mb-4">
            Charts are driven by the same backend data that powers the live video feed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Vehicles Over Time</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
                  <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Line type="monotone" dataKey="total" stroke="hsl(160, 100%, 50%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cars" stroke="hsl(200, 100%, 55%)" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Vehicle Breakdown</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} />
                  <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 14%, 18%)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrafficCharts;
