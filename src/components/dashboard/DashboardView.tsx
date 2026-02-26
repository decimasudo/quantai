'use client'

import { useState, useEffect } from 'react'
import { 
  Bot, Activity, BrainCircuit, Sparkles, LineChart, FileText, 
  BarChart3, CheckCircle2, CircleDashed, TerminalSquare, Building2, MessageSquareText, Loader2, Network
} from 'lucide-react'
import { QuantCard } from '@/components/dashboard/QuantCard'
import { PriceChart } from '@/components/dashboard/PriceChart'
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer'

interface DashboardViewProps {
  stockData: any
  analysis: string
  watchlist: any[]
  toggleWatchlist: () => void
  loading: boolean
  error: string
}

// Data Struktur Langkah Agen (Meniru Konsep Multi-Agent ValueCell)
const THINKING_STEPS = [
  { id: 'plan', title: 'Building Analysis Strategy', label: 'Task Planning', icon: TerminalSquare },
  { id: 'fund', title: 'Target Entity & Context', label: 'Fundamental Analysis', icon: Building2 },
  { id: 'sent', title: 'Global Market Sentiment', label: 'Sentiment Analysis', icon: MessageSquareText },
  { id: 'tech', title: 'Price Action & Support', label: 'Technical Analysis', icon: LineChart },
]

export function DashboardView({ stockData, analysis, watchlist, toggleWatchlist, loading, error }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'insight' | 'financials'>('insight')
  const [thinkingStep, setThinkingStep] = useState(0)

  // Timer untuk menjalankan animasi Agent
  useEffect(() => {
    if (loading) {
      setThinkingStep(0)
      const interval = setInterval(() => {
        setThinkingStep(prev => {
          if (prev < THINKING_STEPS.length - 1) return prev + 1
          clearInterval(interval)
          return prev
        })
      }, 2500) // Diperlambat sedikit agar user bisa membaca konten
      return () => clearInterval(interval)
    }
  }, [loading])

  // Helper untuk merender KONTEN NYATA di dalam kartu agen (Menggantikan Image ValueCell)
  const renderStepGraphic = (idx: number, isActive: boolean, isCompleted: boolean) => {
    // Jika belum aktif, jangan tampilkan konten
    if (!isActive && !isCompleted) {
       return <div className="text-[10px] text-zinc-300 font-medium uppercase tracking-widest">Waiting in Queue...</div>
    }

    if (idx === 0) return (
      <div className="w-full h-full p-2.5 bg-zinc-900 rounded-lg flex flex-col gap-1 font-mono text-[8px] text-emerald-400 overflow-hidden text-left leading-tight">
        <p className="text-zinc-400">&gt; Lumo_Orchestrator v2.0</p>
        <p>&gt; Target detected.</p>
        <p>&gt; Initializing parallel sub-agents...</p>
        <p className="text-orange-400">&gt; Allocating context window: 128k</p>
      </div>
    );

    if (idx === 1) return (
      <div className="w-full h-full p-2 bg-white rounded-lg flex flex-col justify-between border border-zinc-100 shadow-sm text-left">
         <div className="flex justify-between items-center border-b border-zinc-100 pb-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase">Q3 Earnings</span>
            <span className="text-[9px] text-emerald-600 font-black">Beat +12%</span>
         </div>
         <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <div>
               <p className="text-[7px] text-zinc-400 uppercase">Revenue YoY</p>
               <p className="text-[10px] font-black text-zinc-800">+24.5%</p>
            </div>
            <div>
               <p className="text-[7px] text-zinc-400 uppercase">Net Margin</p>
               <p className="text-[10px] font-black text-zinc-800">18.2%</p>
            </div>
         </div>
      </div>
    );

    if (idx === 2) return (
      <div className="w-full h-full p-2 bg-white rounded-lg flex flex-col justify-center border border-zinc-100 shadow-sm">
         <div className="flex justify-between text-[9px] font-black text-zinc-700 mb-1">
            <span>Bullish</span>
            <span className="text-emerald-500">72%</span>
         </div>
         <div className="w-full bg-zinc-100 rounded-full h-2 mb-2 overflow-hidden flex">
            <div className="bg-emerald-500 h-full w-[72%]" />
            <div className="bg-red-400 h-full w-[28%]" />
         </div>
         <p className="text-[7px] text-zinc-400 uppercase font-medium truncate">Scanned 1,240 news articles in 3s.</p>
      </div>
    );

    if (idx === 3) return (
      <div className="w-full h-full p-2 bg-zinc-900 rounded-lg flex flex-col justify-between shadow-inner">
         <div className="flex items-center justify-between text-[8px] text-zinc-400 font-mono">
            <span>RSI (14): <span className="text-orange-400">68.4</span></span>
            <span>MACD: <span className="text-emerald-400">Cross</span></span>
         </div>
         <div className="flex items-end gap-[2px] h-6 mt-1">
            {[30, 45, 40, 60, 55, 80, 75, 90].map((h, i) => (
               <div key={i} className={`w-full rounded-sm ${i > 4 ? 'bg-emerald-500' : 'bg-red-400'}`} style={{ height: `${h}%` }} />
            ))}
         </div>
      </div>
    );
  }

  // --- STATE 1: IDLE / WELCOME SCREEN ---
  if (!stockData && !loading && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-700">
        <div className="relative mb-8 group cursor-default">
          <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="w-24 h-24 bg-white border border-zinc-100 rounded-3xl flex items-center justify-center shadow-xl relative z-10">
            <Bot className="w-12 h-12 text-zinc-900" />
          </div>
        </div>
        <h2 className="text-4xl font-black tracking-tighter text-zinc-900 mb-4">
          Lumo <span className="text-orange-600">Workspace</span>
        </h2>
        <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest max-w-md leading-relaxed">
          AI-Powered Financial Research Terminal.<br/>
          Select a market hot spot below or enter a prompt.
        </p>
      </div>
    )
  }

  // --- STATE 2: ERROR ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in slide-in-from-bottom-5">
        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Activity className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 mb-2">Analysis Failed</h2>
        <p className="text-zinc-500 max-w-md mx-auto mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors">
          Reset Workspace
        </button>
      </div>
    )
  }

  // --- STATE 3: THINKING PROCESS (11:12 VALUECELL HTML) ---
  if (loading) {
    return (
      <div className="flex gap-4 h-full p-6 bg-zinc-50/50 animate-in fade-in duration-500">
        
        {/* Kolom Kiri: Vertical Timeline */}
        <section className="relative flex max-h-[90dvh] w-[280px] flex-col overflow-y-auto scrollbar-hide">
          <div className="relative px-3 py-2">
            {/* Garis putus-putus vertikal ala ValueCell */}
            <div className="absolute top-0 right-[22px] bottom-3 w-px border-zinc-300 border-r-2 border-dashed z-0"></div>

            <div className="flex flex-col gap-6">
              {THINKING_STEPS.map((step, idx) => {
                const isCompleted = idx < thinkingStep;
                const isActive = idx === thinkingStep;
                
                return (
                  <div key={idx} className={`group relative flex items-center gap-6 transition-all duration-500 ${idx > thinkingStep ? 'opacity-40' : 'opacity-100'}`}>
                    
                    {/* Kartu Agen Utama */}
                    <div className={`flex flex-1 cursor-default flex-col gap-2.5 overflow-hidden rounded-xl border p-3 ring-1 transition-all duration-300 bg-white z-10 
                      ${isActive ? 'border-orange-500 shadow-lg shadow-orange-500/20 ring-orange-500/20' : 
                        isCompleted ? 'border-emerald-500 ring-emerald-500/20 shadow-sm' : 'border-zinc-200 ring-zinc-200/20'}`}
                    >
                      {/* Header Kartu */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                          {isCompleted ? <CheckCircle2 className="size-4 shrink-0 text-emerald-500" /> : 
                           isActive ? <Loader2 className="size-4 shrink-0 text-orange-500 animate-spin" /> : 
                           <CircleDashed className="size-4 shrink-0 text-zinc-300" />}
                          <span className={`truncate font-bold text-[11px] leading-4 ${isActive ? 'text-zinc-900' : isCompleted ? 'text-emerald-700' : 'text-zinc-500'}`}>{step.title}</span>
                        </div>
                      </div>

                      {/* Mockup UI Berisi Konten Nyata (Bukan Sekadar Animasi Bar) */}
                      <div className="flex h-[72px] w-full items-center justify-center rounded-lg bg-zinc-50/50 border border-zinc-100 overflow-hidden relative">
                         {renderStepGraphic(idx, isActive, isCompleted)}
                      </div>

                      {/* Pill Badge bawah */}
                      <div className={`flex w-fit max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 font-bold text-[9px] uppercase tracking-widest
                        ${isActive ? 'bg-orange-100 text-orange-600' : isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-zinc-100 text-zinc-500'}`}>
                        <step.icon className="size-3" />
                        <span className="truncate">{step.label}</span>
                      </div>
                    </div>

                    {/* Konektor Dot ke Garis Putus-Putus */}
                    <div className="relative z-10 flex flex-col items-center shrink-0 w-6">
                      <div className={`absolute top-1/2 right-5 h-px w-6 -translate-y-1/2 transition-colors duration-500 ${isActive ? 'bg-orange-500' : isCompleted ? 'bg-emerald-500' : 'bg-zinc-300'}`}></div>
                      <div className={`relative flex size-5 items-center justify-center rounded-full border transition-all duration-300 bg-white
                        ${isActive ? 'scale-110 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : isCompleted ? 'border-emerald-500' : 'border-zinc-300'}`}>
                        <div className={`size-3 rounded-full transition-all duration-300 ${isActive ? 'bg-orange-500 animate-pulse' : isCompleted ? 'bg-emerald-500' : 'bg-zinc-200'}`}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Kolom Kanan: Log Eksekusi Agen Aktif */}
        <section className="flex-1 rounded-2xl border border-zinc-200 bg-white shadow-xl overflow-hidden flex flex-col">
           <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-3">
              <BrainCircuit className="w-5 h-5 text-orange-500 animate-pulse" />
              <div>
                 <h3 className="font-black text-sm text-zinc-900 uppercase tracking-widest">Super Agent Terminal</h3>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase">Executing {THINKING_STEPS[thinkingStep]?.label}...</p>
              </div>
           </div>
           <div className="flex-1 bg-zinc-950 p-6 font-mono text-xs text-emerald-400 overflow-y-auto leading-loose relative">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none" />
              <p className="animate-typing overflow-hidden whitespace-nowrap mb-2">&gt; LumoAgent Core initialized...</p>
              <p className="animate-typing overflow-hidden whitespace-nowrap mb-2" style={{ animationDelay: '0.5s' }}>&gt; Allocating computational resources...</p>
              {thinkingStep >= 1 && <p className="animate-typing overflow-hidden whitespace-nowrap mb-2 text-white">&gt; [Fundamental] Fetching SEC Filings & Earnings Data...</p>}
              {thinkingStep >= 2 && <p className="animate-typing overflow-hidden whitespace-nowrap mb-2 text-white">&gt; [Sentiment] Scraping global news headlines & Social Volatility...</p>}
              {thinkingStep >= 3 && <p className="animate-typing overflow-hidden whitespace-nowrap mb-2 text-white">&gt; [Technical] Aggregating Price Action, RSI, and MACD...</p>}
              <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse mt-2" />
           </div>
        </section>
      </div>
    )
  }

  // --- STATE 4: RESEARCH RESULTS (WORKSPACE SELESAI) ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
      <div className="lg:col-span-7 p-8 overflow-y-auto scrollbar-hide h-full">
        <div className="animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur-sm z-20 py-2 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-900 rounded-xl text-white shadow-lg">
                <Sparkles className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="font-black text-xl text-zinc-900 tracking-tight">Research Report</h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                  {stockData?.symbol || 'Unknown Asset'} • Multi-Agent Synthesized
                </p>
              </div>
            </div>

            <div className="flex bg-zinc-100 p-1.5 rounded-xl">
              <button 
                onClick={() => setActiveTab('insight')}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'insight' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <FileText className="w-3.5 h-3.5" /> Insight
              </button>
              <button 
                onClick={() => setActiveTab('financials')}
                className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'financials' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Metrics
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {activeTab === 'financials' && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <QuantCard data={stockData} isWatchlisted={watchlist.some(w => w.ticker === stockData?.symbol)} onToggleWatchlist={toggleWatchlist} />
              </div>
            )}
            {activeTab === 'insight' && (
              <div className="prose prose-sm prose-zinc max-w-none bg-white">
                 <MarkdownRenderer className="text-[15px] leading-relaxed text-zinc-700 font-medium">
                    {analysis}
                 </MarkdownRenderer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel Kanan (Chart & Live Feed) */}
      <div className="lg:col-span-5 border-l border-zinc-200 bg-zinc-50/50 h-full flex flex-col">
        <div className="p-6 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Live Market Feed</span>
          </div>
          
          {/* PERBAIKAN 1: Pengecekan Aman (Safe Checks) untuk Mencegah Nilai 0 Jika Data Belum Lengkap */}
          {stockData && typeof stockData.price === 'number' ? (
             <div className="flex items-end justify-between">
               <div className="flex items-baseline gap-3">
                 <h1 className="text-4xl font-black text-zinc-900">{stockData.symbol}</h1>
                 <span className={`text-xl font-bold ${stockData.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                   {stockData.price.toFixed(2)}
                 </span>
               </div>
               <div className={`text-sm font-bold px-3 py-1 rounded-lg flex items-center gap-1 ${stockData.change >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                 {stockData.changePercent >= 0 ? '▲' : '▼'} {Math.abs(stockData.changePercent).toFixed(2)}%
               </div>
             </div>
          ) : (
            // Tampilkan Skeleton (Efek Loading Abu-abu) jika harga belum tersedia
            <div className="flex items-end justify-between animate-pulse">
               <div className="flex gap-3 items-baseline">
                 <div className="h-10 w-24 bg-zinc-200 rounded-md" />
                 <div className="h-6 w-16 bg-zinc-200 rounded-md" />
               </div>
               <div className="h-6 w-20 bg-zinc-200 rounded-md" />
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide space-y-6">
          {stockData?.historicalData ? (
            <div className="animate-in slide-in-from-right-4 duration-700 space-y-6">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price Action (60D)</h3>
                   <LineChart className="w-4 h-4 text-zinc-300" />
                </div>
                <PriceChart data={stockData.historicalData} ticker={stockData.symbol} />
              </div>
              
              {stockData?.quantitative && (
                <div className="p-6 bg-zinc-900 rounded-3xl text-white shadow-2xl relative overflow-hidden group border border-zinc-800">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 blur-[50px] rounded-full group-hover:bg-orange-500/30 transition-all duration-700" />
                  <div className="space-y-5 relative z-10">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Algorithmic Trend</p>
                      <p className="text-lg font-medium leading-snug">
                        Pattern matching classifies <span className="text-orange-400 font-bold">{stockData.symbol}</span> as exhibiting <span className="underline decoration-orange-500/50 uppercase">{stockData.quantitative.trend}</span> characteristics.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Network className="w-16 h-16 mb-4 text-zinc-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Awaiting Sub-Agent Data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}