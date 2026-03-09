'use client'

import React from 'react'
import { 
  Activity, 
  LineChart, 
  MessageSquare, 
  ShieldAlert, 
  Cpu,
  Wifi,
  Briefcase
} from 'lucide-react'

interface DashboardHeaderProps {
  agentType: string
  onAgentTypeChange: (type: string) => void
  stockData: any
  executeAnalysis: (ticker: string, specificAgentType?: string) => void
}

export function DashboardHeader({ agentType, onAgentTypeChange, stockData, executeAnalysis }: DashboardHeaderProps) {
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

      {/* Right Area: Agent Toggle (Integrated into Header) */}
      <div className="flex items-center gap-3">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shadow-inner">
          {[
            { id: 'fundamental', label: 'Warren_Mod', icon: Briefcase },
            { id: 'technical', label: 'Quant_Mod', icon: Activity }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = agentType === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onAgentTypeChange(item.id);
                  if (stockData?.symbol) {
                    executeAnalysis(stockData.symbol, item.id);
                  }
                }}
                className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] rounded-lg transition-all duration-300 flex items-center gap-2 ${
                  isActive 
                  ? 'bg-stellar text-void shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-void' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-white/10 hidden sm:block mx-1" />
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stellar/5 border border-stellar/20 text-stellar">
          <Wifi className="w-3 h-3 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest">
            Secure
          </span>
        </div>
      </div>
      
    </header>
  )
}