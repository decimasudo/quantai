'use client'

import { Bot, Activity } from 'lucide-react'
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
  if (!stockData && !loading && !error) {
    return (
      <div className="mt-32 text-center animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
          <div className="w-10 h-10 text-zinc-900" />
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">Awaiting Ticker Selection.</h2>
        <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Select an asset below to initialize workspace</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-8 h-full">
        <div className="lg:col-span-7 space-y-4 animate-pulse">
          <div className="h-64 bg-zinc-50 rounded-3xl" />
          <div className="h-96 bg-zinc-50 rounded-3xl" />
        </div>
        <div className="lg:col-span-5 animate-pulse">
          <div className="h-full bg-zinc-50 rounded-3xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-600 mb-2">Analysis Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-full">
      {/* KOLOM KIRI: FUNDAMENTAL INSIGHTS */}
      <div className="lg:col-span-7 p-8 border-r border-zinc-100 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="w-5 h-5 text-zinc-900" />
          <h2 className="font-black uppercase tracking-tight text-zinc-400 text-sm">AI Agent Analysis</h2>
        </div>

        <QuantCard
          data={stockData}
          isWatchlisted={watchlist.some(w => w.ticker === stockData.symbol)}
          onToggleWatchlist={toggleWatchlist}
        />

        <MarkdownRenderer className="bg-white text-zinc-800 text-[15px]">
          {analysis}
        </MarkdownRenderer>
      </div>

      {/* KOLOM KANAN: CHART & TECHNICAL TOOLS */}
      <div className="lg:col-span-5 p-8 bg-zinc-50/30 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-400" />
            <h2 className="font-black uppercase tracking-tight text-zinc-400 text-sm">Visual Terminal</h2>
          </div>
        </div>

        <PriceChart
          data={stockData.historicalData}
          ticker={stockData.symbol}
        />

        {/* Market Sentiment Card */}
        <div className="mt-6 p-6 bg-zinc-900 rounded-2xl text-white shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Market Sentiment</p>
          <p className="text-sm font-medium leading-snug">
            {stockData.symbol} exhibits {stockData.quantitative.trend} trend characteristics over the 60-day window with an RSI of {stockData.quantitative.rsi14.toFixed(2)}.
          </p>
        </div>
      </div>
    </div>
  )
}