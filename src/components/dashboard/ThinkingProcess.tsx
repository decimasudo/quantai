import { Loader2, CheckCircle2, Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ThinkingStep {
  id: string;
  label: string;
  status: 'pending' | 'working' | 'done';
}

export function ThinkingProcess({ steps }: { steps: ThinkingStep[] }) {
  return (
    <div className="border rounded-lg bg-card p-4 space-y-6">
      {/* Bagian Logika / Steps */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase">Reasoning Engine</h4>
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3 text-sm">
            {step.status === 'working' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {step.status === 'done' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {step.status === 'pending' && <Circle className="w-4 h-4 text-gray-300" />}
            
            <span className={step.status === 'working' ? "text-foreground font-medium" : "text-muted-foreground"}>
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bagian Visualisasi Chart Sementara (Skeleton) */}
      <div className="space-y-2 pt-4 border-t">
         <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Generating Market Visualization...</span>
         </div>
         <div className="flex items-end gap-2 h-24">
            <Skeleton className="w-full h-1/3 bg-primary/10" />
            <Skeleton className="w-full h-2/3 bg-primary/20" />
            <Skeleton className="w-full h-1/2 bg-primary/10" />
            <Skeleton className="w-full h-full bg-primary/30" />
            <Skeleton className="w-full h-3/4 bg-primary/20" />
         </div>
      </div>
    </div>
  );
}