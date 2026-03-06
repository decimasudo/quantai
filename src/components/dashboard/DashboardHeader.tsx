'use client'

import React from 'react'
import { 
  Activity, 
  LineChart, 
  MessageSquare, 
  ShieldAlert, 
  Cpu,
  Wifi
} from 'lucide-react'

interface DashboardHeaderProps {
  agentType: string
  onAgentTypeChange: (type: string) => void
  stockData: any
  executeAnalysis: (ticker: string, specificAgentType?: string) => void
}

const AGENTS = [
  { id: 'fundamental', label: 'Fundamental', icon: Activity },
  { id: 'technical', label: 'Technical', icon: LineChart },
  { id: 'sentiment', label: 'Sentiment', icon: MessageSquare },
  { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert },
]

export function DashboardHeader({ agentType, onAgentTypeChange }: DashboardHeaderProps) {
  return (
    <header className="flex-none h-[72px] px-6 lg:px-8 border-b border-white/5 bg-void/80 backdrop-blur-2xl flex items-center justify-between sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      
      {/* Left Area: System Status */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
            Uplink Active
          </span>
        </div>
        
        <div className="h-4 w-px bg-white/10 hidden md:block" />

        <div className="flex items-center gap-2 text-slate-400">
          <Cpu className="w-4 h-4 text-stellar" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Neural Core Routines
          </span>
        </div>
      </div>

      {/* Right Area: System Status */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
            Uplink Active
          </span>
        </div>
        
        <div className="h-4 w-px bg-white/10 hidden md:block" />

        <div className="flex items-center gap-2 text-slate-400">
          <Cpu className="w-4 h-4 text-stellar" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Neural Core Routines
          </span>
        </div>
      </div>
      
    </header>
  )
}