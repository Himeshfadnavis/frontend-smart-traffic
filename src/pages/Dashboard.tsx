import { useAuth } from "@/contexts/AuthContext";
import { useTrafficSimulation } from "@/services/trafficSimulation";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Radio, AlertTriangle, Volume2, VolumeX } from "lucide-react";
import LiveFeedPanel from "@/components/dashboard/LiveFeedPanel";
import TrafficStatsCards from "@/components/dashboard/TrafficStatsCards";
import SignalControlPanel from "@/components/dashboard/SignalControlPanel";
import PredictionPanel from "@/components/dashboard/PredictionPanel";
import TrafficCharts from "@/components/dashboard/TrafficCharts";
import JunctionCards from "@/components/dashboard/JunctionCards";
import SecondarySignalsPanel from "@/components/dashboard/SecondarySignalsPanel";
import PerformancePanel from "@/components/dashboard/PerformancePanel";
import LoadingScreen from "@/components/dashboard/LoadingScreen";

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedJunction, setSelectedJunction] = useState("j1");

  const { trafficData, analysis, signal, setSignal, history, junctions, metrics, backendData, apiBase } = useTrafficSimulation(videoActive);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Voice alert
  useEffect(() => {
    if (voiceEnabled && analysis.trafficState === "Heavy" && videoActive) {
      const msg = new SpeechSynthesisUtterance("Heavy congestion detected. Adjusting signals.");
      msg.rate = 0.9;
      msg.pitch = 0.8;
      speechSynthesis.speak(msg);
    }
  }, [analysis.trafficState, voiceEnabled, videoActive]);

  if (isLoading) return <LoadingScreen />;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="glass-card rounded-none border-x-0 border-t-0 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Radio className="w-6 h-6 text-primary" />
          <h1 className="font-display text-lg font-bold neon-text-green tracking-widest">TRAFFIC AI</h1>
          {videoActive && (
            <span className="flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/30 text-xs font-mono-code text-destructive animate-pulse-neon">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              {backendData.backend_ok ? "LIVE" : "BACKEND OFFLINE"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            title={voiceEnabled ? "Disable voice alerts" : "Enable voice alerts"}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <div className="text-right text-xs">
            <p className="text-foreground font-medium">{user?.name}</p>
            <p className="text-muted-foreground uppercase tracking-wider">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Emergency alert */}
      {analysis.congestionScore > 80 && videoActive && (
        <div className="mx-4 mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-3 animate-slide-up">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive font-medium">Emergency: Critical congestion detected at current junction. Signal override recommended.</p>
        </div>
      )}

      {/* Dashboard Grid */}
      <main className="p-4 grid grid-cols-12 gap-4 max-w-[1920px] mx-auto">
        {/* Live Feed - largest panel */}
        <div className="col-span-12 lg:col-span-8">
          <LiveFeedPanel videoActive={videoActive} setVideoActive={setVideoActive} apiBase={apiBase} backendOk={backendData.backend_ok} message={backendData.message} />
        </div>

        {/* Right sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <SignalControlPanel signal={signal} setSignal={setSignal} isAdmin={isAdmin} videoActive={videoActive} />
          <PredictionPanel analysis={analysis} videoActive={videoActive} />
        </div>

        {/* Stats row */}
        <div className="col-span-12">
          <TrafficStatsCards data={trafficData} videoActive={videoActive} />
        </div>

        {/* Charts */}
        <div className="col-span-12 lg:col-span-8">
          <TrafficCharts history={history} trafficData={trafficData} videoActive={videoActive} />
        </div>

        {/* Performance */}
        <div className="col-span-12 lg:col-span-4">
          <PerformancePanel metrics={metrics} videoActive={videoActive} />
        </div>

        {/* Junctions */}
        <div className="col-span-12">
          <SecondarySignalsPanel nodes={backendData.nodes} activeNode={backendData.active_node} videoActive={videoActive} />
        </div>

        <div className="col-span-12">
          <JunctionCards junctions={junctions} selectedJunction={selectedJunction} onSelect={setSelectedJunction} videoActive={videoActive} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
