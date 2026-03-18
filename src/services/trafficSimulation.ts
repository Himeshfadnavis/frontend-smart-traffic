import { useEffect, useMemo, useRef, useState } from "react";

export interface TrafficData { total: number; cars: number; bikes: number; buses: number; trucks: number; density: "Low" | "Medium" | "High"; }
export interface AnalysisData { congestionScore: number; trafficState: "Smooth" | "Moderate" | "Heavy"; prediction: string; trend: "increasing" | "decreasing" | "stable"; }
export interface SignalState { active: "red" | "yellow" | "green"; timer: number; greenDuration: number; yellowDuration: number; redDuration: number; }
export interface JunctionData { id: string; name: string; status: "green" | "yellow" | "red"; vehicleCount: number; density: "Low" | "Medium" | "High"; }
export interface PerformanceMetrics { avgWaitReduction: number; flowImprovement: number; signalEfficiency: number; }
export interface HistoryPoint { time: string; total: number; cars: number; bikes: number; buses: number; trucks: number; }

interface BackendData {
  vehicles_in_lane: number; signal_state: string; locked_green_time: number; red_wait_timer: number; emergency_detected: boolean; green_wave_active: boolean; calculated_time: number; system_mode: string; active_node: string; phase: string;
  nodes: Record<string, { state: string; timer: number; phase: string }>;
  vehicle_counts: Record<string, number>; vehicle_speeds: Record<string, number>; weighted_load: number; avg_estimated_speed: number; fps: number; backend_ok: boolean; message: string;
}

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";
const EMPTY_BACKEND: BackendData = { vehicles_in_lane: 0, signal_state: "RED", locked_green_time: 0, red_wait_timer: 0, emergency_detected: false, green_wave_active: false, calculated_time: 12, system_mode: "ADAPTIVE", active_node: "A", phase: "GREEN", nodes: { A: { state: "GREEN", timer: 12, phase: "AI_PRIMARY" }, B: { state: "RED", timer: 0, phase: "WAITING" }, C: { state: "RED", timer: 0, phase: "WAITING" }, D: { state: "RED", timer: 0, phase: "WAITING" } }, vehicle_counts: { car: 0, motorcycle: 0, truck: 0, bus: 0, rickshaw: 0, ambulance: 0 }, vehicle_speeds: { car: 0, motorcycle: 0, truck: 0, bus: 0, rickshaw: 0, ambulance: 0 }, weighted_load: 0, avg_estimated_speed: 0, fps: 0, backend_ok: false, message: "backend unavailable" };

function densityFromTotal(total: number): TrafficData["density"] { if (total >= 10) return "High"; if (total >= 5) return "Medium"; return "Low"; }

export function useTrafficSimulation(isActive: boolean) {
  const [backendData, setBackendData] = useState<BackendData>(EMPTY_BACKEND);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [signalOverride, setSignalOverride] = useState<SignalState | null>(null);
  const prevTotalRef = useRef(0);

  useEffect(() => {
    if (!isActive) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/traffic_data`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: BackendData = await res.json();
        if (cancelled) return;
        setBackendData(json);
        const now = new Date();
        setHistory((prev) => [
          ...prev.slice(-29),
          { time: now.toLocaleTimeString(), total: json.vehicles_in_lane ?? 0, cars: json.vehicle_counts?.car ?? 0, bikes: json.vehicle_counts?.motorcycle ?? 0, buses: json.vehicle_counts?.bus ?? 0, trucks: json.vehicle_counts?.truck ?? 0 },
        ]);
      } catch {
        if (!cancelled) setBackendData((prev) => ({ ...prev, backend_ok: false, message: "backend unavailable" }));
      }
    };
    poll();
    const interval = setInterval(poll, 1000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isActive]);

  const trafficData = useMemo<TrafficData>(() => {
    const total = backendData.vehicles_in_lane ?? 0;
    return { total, cars: backendData.vehicle_counts?.car ?? 0, bikes: backendData.vehicle_counts?.motorcycle ?? 0, buses: backendData.vehicle_counts?.bus ?? 0, trucks: backendData.vehicle_counts?.truck ?? 0, density: densityFromTotal(total) };
  }, [backendData]);

  const analysis = useMemo<AnalysisData>(() => {
    const score = Math.min(100, Math.round((backendData.weighted_load ?? 0) * 8 + (backendData.vehicles_in_lane ?? 0) * 2));
    const trend: AnalysisData["trend"] = trafficData.total > prevTotalRef.current + 1 ? "increasing" : trafficData.total < prevTotalRef.current - 1 ? "decreasing" : "stable";
    prevTotalRef.current = trafficData.total;
    const state: AnalysisData["trafficState"] = score > 65 ? "Heavy" : score > 30 ? "Moderate" : "Smooth";
    return {
      congestionScore: score,
      trafficState: state,
      trend,
      prediction: backendData.emergency_detected ? "Emergency priority active. Main lane green time extended." : trend === "increasing" ? `Traffic rising. Recommended green window ${backendData.calculated_time}s.` : trend === "decreasing" ? "Traffic easing. Queue expected to clear shortly." : "Traffic stable. Monitoring next cycle for timing update.",
    };
  }, [backendData, trafficData.total]);

  const derivedSignal = useMemo<SignalState>(() => ({
    active: (backendData.signal_state?.toLowerCase() || "red") as SignalState["active"],
    timer: Math.round((backendData.locked_green_time || backendData.red_wait_timer || 0) * 10) / 10,
    greenDuration: Math.round((backendData.calculated_time || 12) * 10) / 10,
    yellowDuration: 3,
    redDuration: 12,
  }), [backendData]);

  const junctions = useMemo<JunctionData[]>(() => {
    const nodeNames = { A: "Node A — Main Junction", B: "Node B — East Arm", C: "Node C — South Arm", D: "Node D — West Arm" } as const;
    return (["A", "B", "C", "D"] as const).map((id, index) => {
      const node = backendData.nodes?.[id] ?? { state: "RED", timer: 0, phase: "WAITING" };
      const estCount = id === "A" ? trafficData.total : Math.max(0, Math.round((backendData.weighted_load || 0) / 2) - index);
      return { id: id.toLowerCase(), name: nodeNames[id], status: (node.state?.toLowerCase() || "red") as JunctionData["status"], vehicleCount: estCount, density: densityFromTotal(estCount) };
    });
  }, [backendData, trafficData]);

  const metrics = useMemo<PerformanceMetrics>(() => ({
    avgWaitReduction: Math.max(8, Math.min(45, 12 + (backendData.calculated_time || 0) * 0.9)),
    flowImprovement: Math.max(5, Math.min(40, 10 + (backendData.avg_estimated_speed || 0) * 0.8)),
    signalEfficiency: Math.max(60, Math.min(99, 72 + (backendData.fps || 0) + (backendData.green_wave_active ? 8 : 0))),
  }), [backendData]);

  return { trafficData, analysis, signal: signalOverride ?? derivedSignal, setSignal: setSignalOverride, history, junctions, metrics, backendData, apiBase: API_BASE };
}
