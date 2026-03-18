import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

const steps = [
  "Initializing AI Traffic Engine…",
  "Loading YOLOv8 detection model…",
  "Connecting to junction sensors…",
  "Calibrating signal controllers…",
  "System ready.",
];

const LoadingScreen = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < steps.length - 1) {
      const timer = setTimeout(() => setStep((s) => s + 1), 600);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 neon-glow-green flex items-center justify-center animate-pulse-neon">
          <Radio className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold neon-text-green tracking-widest">TRAFFIC AI</h1>

        <div className="w-80 space-y-2">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 transition-opacity duration-500 ${i <= step ? "opacity-100" : "opacity-0"}`}>
              <span className={`w-2 h-2 rounded-full ${i < step ? "bg-primary" : i === step ? "bg-primary animate-pulse-neon" : "bg-muted"}`} />
              <span className="text-sm font-mono-code text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-80 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
              background: "hsl(var(--primary))",
              boxShadow: "0 0 10px hsl(var(--primary) / 0.5)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
