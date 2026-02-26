'use client'

import { Briefcase, Activity } from 'lucide-react'

interface DashboardHeaderProps {
  agentType: string
  onAgentTypeChange: (type: string) => void
  stockData: any
  executeAnalysis: (ticker: string, agentType?: string) => void
}

export function DashboardHeader({ agentType, onAgentTypeChange, stockData, executeAnalysis }: DashboardHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-20">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Terminal V1.5</h1>
      </div>

      <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
        {['fundamental', 'technical'].map((type) => (
          <button
            key={type}
            onClick={() => {
              onAgentTypeChange(type);
              // If we already have data, re-analyze automatically with new agent type
              if (stockData?.symbol) {
                executeAnalysis(stockData.symbol, type);
              }
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
              agentType === type ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {type === 'fundamental' ? <Briefcase className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
            <span className="capitalize">{type === 'fundamental' ? 'Warren Agent' : 'Quant Agent'}</span>
          </button>
        ))}
      </div>
    </header>
  )
}