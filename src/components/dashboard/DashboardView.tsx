'use client'

import { useState, useEffect } from 'react'
import { Bot, Activity, BrainCircuit, Sparkles, LineChart, FileText, BarChart3, Clock, CheckCircle2 } from 'lucide-react'
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

export function DashboardView({ stockData, analysis, watchlist, toggleWatchlist, loading, error }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'insight' | 'financials'>('insight')
  const [thinkingStep, setThinkingStep] = useState(0)

  // Efek animasi untuk "Thinking Process"
  useEffect(() => {
    if (loading) {
      setThinkingStep(0)
      const interval = setInterval(() => {
        setThinkingStep(prev => (prev < 3 ? prev + 1 : prev))
      }, 1500) // Ganti step setiap 1.5 detik
      return () => clearInterval(interval)
    }
  }, [loading])

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
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-zinc-900 text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          Reset Workspace
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
      {/* --- KOLOM KIRI: MAIN CONTENT (Thinking / Results) --- */}
      <div className="lg:col-span-7 p-8 overflow-y-auto scrollbar-hide h-full relative">
        
        {loading ? (
          /* UI THINKING PROCESS */
          <div className="max-w-xl mx-auto mt-20 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100 z-10 relative">
                  <BrainCircuit className="w-6 h-6 text-orange-600 animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-orange-500/30 blur-xl animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-zinc-900">Agent Thinking...</h2>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Processing Financial Data</p>
              </div>
            </div>
            
            {/* Steps Log */}
            <div className="space-y-6 relative pl-4 border-l-2 border-zinc-100 ml-6">
              {[
                "Decoding prompt & identifying financial assets...",
                "Retrieving real-time market data (Price, Vol, Greeks)...",
                "Aggregating technical indicators (RSI, MACD, Bollinger)...",
                "Synthesizing final investment thesis..."
              ].map((step, idx) => (
                <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${idx <= thinkingStep ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-4'}`}>
                  <div className={`w-3 h-3 rounded-full border-2 ${idx < thinkingStep ? 'bg-emerald-500 border-emerald-500' : idx === thinkingStep ? 'bg-orange-500 border-orange-500 animate-ping' : 'bg-zinc-200 border-zinc-200'} -ml-[23px] transition-colors duration-300`} />
                  <span className={`text-sm font-medium ${idx === thinkingStep ? 'text-zinc-900' : 'text-zinc-500'}`}>
                    {step} {idx < thinkingStep && <CheckCircle2 className="inline w-4 h-4 text-emerald-500 ml-2"/>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* UI RESEARCH RESULTS */
          <div className="animate-in slide-in-from-bottom-8 duration-700">
            {/* Header Result */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur-sm z-20 py-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-xl text-zinc-900 tracking-tight">Research Report</h2>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    {stockData?.symbol} • {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Toggle Tabs */}
              <div className="flex bg-zinc-100 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab('insight')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'insight' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Insight
                </button>
                <button 
                  onClick={() => setActiveTab('financials')}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'financials' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Metrics
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-6">
              {activeTab === 'financials' && (
                <div className="animate-in fade-in zoom-in-95 duration-300">
                  <QuantCard
                    data={stockData}
                    isWatchlisted={watchlist.some(w => w.ticker === stockData?.symbol)}
                    onToggleWatchlist={toggleWatchlist}
                  />
                </div>
              )}

              {activeTab === 'insight' && (
                <div className="prose prose-sm prose-zinc max-w-none bg-white">
                   {/* Analisis Markdown */}
                   <MarkdownRenderer className="text-[15px] leading-7 text-zinc-700">
                      {analysis}
                   </MarkdownRenderer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- KOLOM KANAN: VISUAL TERMINAL (Chart & Sentiment) --- */}
      <div className="lg:col-span-5 border-l border-zinc-200 bg-zinc-50/50 h-full flex flex-col">
        <div className="p-6 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <LineChart className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Live Market Data</span>
          </div>
          {stockData ? (
             <div className="flex items-baseline gap-3">
               <h1 className="text-3xl font-black text-zinc-900">{stockData.symbol}</h1>
               <span className={`text-lg font-bold ${(stockData.change || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                 {stockData.price?.toFixed(2) ?? '0.00'}
               </span>
               <span className={`text-sm font-medium px-2 py-0.5 rounded-md ${(stockData.change || 0) >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                 {stockData.changePercent?.toFixed(2) ?? '0.00'}%
               </span>
             </div>
          ) : (
            <div className="h-10 w-32 bg-zinc-200 rounded-md animate-pulse" />
          )}
        </div>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          {stockData?.historicalData ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-700">
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-100">
                <PriceChart
                  data={stockData.historicalData}
                  ticker={stockData.symbol}
                />
              </div>

              {/* Sentiment / Quick Stats Card */}
              {!loading && stockData?.quantitative && (
                <div className="p-6 bg-zinc-900 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl rounded-full group-hover:bg-orange-500/30 transition-all" />
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">AI Summary</p>
                    <Clock className="w-4 h-4 text-zinc-600" />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Trend Signal</p>
                      <p className="text-lg font-medium leading-snug">
                        <span className="text-orange-400 font-bold">{stockData.symbol}</span> is showing a <span className="underline decoration-orange-500/50 decoration-2 underline-offset-4">{stockData.quantitative.trend}</span> pattern.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold">RSI (14)</p>
                        <p className="text-xl font-mono text-white">{stockData.quantitative.rsi14.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 uppercase font-bold">Volatility</p>
                        <p className="text-xl font-mono text-white">{stockData.quantitative.volatility.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State Chart */
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <LineChart className="w-16 h-16 mb-4 text-zinc-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Waiting for Data Feed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}