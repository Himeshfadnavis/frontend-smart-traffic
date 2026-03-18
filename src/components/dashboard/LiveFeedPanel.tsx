import { ExternalLink, MonitorPlay, Play, ShieldAlert } from "lucide-react";

interface Props {
  videoActive: boolean;
  setVideoActive: (v: boolean) => void;
  apiBase: string;
  backendOk: boolean;
  message: string;
}

const LiveFeedPanel = ({ videoActive, setVideoActive, apiBase, backendOk, message }: Props) => {
  return (
    <div className="glass-card p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MonitorPlay className="w-5 h-5 text-primary" />
          <h2 className="font-display text-sm font-semibold tracking-wider text-foreground">LIVE TRAFFIC FEED</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border ${backendOk ? "border-primary/30 text-primary bg-primary/10" : "border-destructive/30 text-destructive bg-destructive/10"}`}>
            {backendOk ? "backend online" : "backend offline"}
          </span>
          <button onClick={() => setVideoActive(!videoActive)} className="px-3 py-1 rounded text-xs font-mono-code bg-secondary/60 text-foreground border border-border hover:bg-secondary transition-colors">
            {videoActive ? "HIDE FEED" : "SHOW FEED"}
          </button>
        </div>
      </div>

      {videoActive ? (
        <div className="relative rounded-lg overflow-hidden border border-border bg-black/40">
          {backendOk ? (
            <>
              <img src={`${apiBase}/video_feed`} alt="Live traffic feed" className="w-full aspect-video object-cover" />
              <div className="absolute inset-0 scanline pointer-events-none" />
              <div className="absolute left-3 top-3 px-3 py-1 rounded-full bg-black/55 border border-primary/30 text-[11px] font-mono-code text-primary">Node A · YOLO feed</div>
            </>
          ) : (
            <div className="aspect-video flex flex-col items-center justify-center gap-3 text-center p-8">
              <ShieldAlert className="w-10 h-10 text-destructive" />
              <div>
                <p className="font-display text-lg text-foreground">Backend feed unavailable</p>
                <p className="text-sm text-muted-foreground mt-1">{message}</p>
              </div>
              <a href={`${apiBase}/api/health`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/50 text-sm hover:bg-secondary transition-colors">
                <ExternalLink className="w-4 h-4" /> Open backend health
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setVideoActive(true)} className="w-full flex items-center justify-center gap-3 p-8 rounded-lg border border-primary/30 bg-primary/10 hover:bg-primary/15 transition-colors text-primary">
            <Play className="w-6 h-6" />
            <span className="font-display tracking-wider">OPEN LIVE AI VIDEO</span>
          </button>
          <p className="text-xs text-muted-foreground font-mono-code">Feed source is served by the Python backend. Place your traffic video at backend/video.mp4 and run the backend before opening this dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default LiveFeedPanel;
