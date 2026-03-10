import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Bot, 
  LayoutTemplate, 
  LineChart, 
  MessageSquare, 
  Activity, 
  Globe, 
  Search 
} from 'lucide-react';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

export interface ThinkingStep {
  id: string;
  title: string;
  label: string;
  status: 'pending' | 'working' | 'done';
  icon: React.ElementType;
}

interface ThinkingProcessProps {
  steps: ThinkingStep[];
  content: string; // The markdown content from OpenRouter
}

export function ThinkingProcess({ steps, content }: ThinkingProcessProps) {
  return (
    <div className="w-full flex flex-col glass-card stellar-border rounded-3xl overflow-hidden animate-in fade-in duration-700 shadow-[0_0_40px_rgba(34,211,238,0.05)]">
      
      {/* Header Panel */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-stellar/20 blur-md rounded-full animate-pulse" />
          <Bot className="w-6 h-6 text-stellar relative z-10" />
        </div>
        <span className="font-bold tracking-wide text-slate-200 text-sm uppercase">
          Jerril Neural Core has completed initial context mapping
        </span>
      </div>

      <div className="flex flex-col lg:flex-row w-full max-h-[75vh] overflow-hidden bg-void/40">
        
        {/* LEFT COLUMN: Agent Steps Timeline */}
        <section className="relative flex-none w-full lg:w-[360px] p-6 overflow-y-auto border-r border-white/5 bg-black/20 scrollbar-hide">
          <div className="relative">
            {/* Vertical Dashed Line */}
            <div className="absolute top-4 left-[23px] bottom-8 w-px border-l-2 border-dashed border-slate-800" />
            
            <div className="flex flex-col gap-8 relative z-10">
              {steps.map((step) => {
                const Icon = step.icon;
                const isDone = step.status === 'done';
                const isWorking = step.status === 'working';
                
                return (
                  <div key={step.id} className={`group relative flex items-start gap-5 transition-all duration-500 ${step.status === 'pending' ? 'opacity-40' : 'opacity-100'}`}>
                    
                    {/* Status Node & Connector */}
                    <div className={`relative flex-none flex items-center justify-center w-[48px] h-[48px] rounded-full border-2 transition-all duration-500 bg-void
                      ${isWorking ? 'border-stellar shadow-[0_0_20px_rgba(34,211,238,0.5)] scale-110' : 
                        isDone ? 'border-emerald-500/50' : 'border-slate-800'}`}>
                      {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : 
                       isWorking ? <Loader2 className="w-5 h-5 text-stellar animate-spin" /> : 
                       <Circle className="w-5 h-5 text-slate-600" />}
                    </div>

                    {/* Step Card */}
                    <div className={`flex-1 flex flex-col gap-2.5 rounded-2xl border p-4 transition-all duration-500 backdrop-blur-md
                      ${isWorking ? 'border-stellar/40 bg-stellar/[0.03] shadow-[0_0_30px_rgba(34,211,238,0.08)]' : 
                        isDone ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-white/[0.01]'}`}>
                      
                      <span className={`font-bold text-xs tracking-wide leading-tight ${isWorking ? 'text-white' : isDone ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      
                      {/* Badge Label */}
                      <div className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest
                        ${isWorking ? 'bg-stellar/20 text-stellar' : isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-500'}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span className="truncate">{step.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Detailed Markdown Logs */}
        <section className="flex-1 p-8 overflow-y-auto scrollbar-hide bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]">
          <div className="prose prose-invert prose-sm max-w-none 
            prose-headings:text-stellar prose-headings:font-black prose-headings:tracking-tight
            prose-p:text-slate-300 prose-p:leading-relaxed 
            prose-li:text-slate-300
            prose-strong:text-white prose-strong:font-bold
            prose-blockquote:border-l-stellar prose-blockquote:bg-stellar/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-300">
            {content ? (
              <MarkdownRenderer>
                {content}
              </MarkdownRenderer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 pt-20">
                <Loader2 className="w-10 h-10 animate-spin text-stellar/30" />
                <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Awaiting neural datastream...</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}