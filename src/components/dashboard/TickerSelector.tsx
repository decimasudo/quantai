'use client'

import { Send } from 'lucide-react'

const SUPPORTED_TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'META', name: 'Meta Platforms' },
  { symbol: 'AMZN', name: 'Amazon.com' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
  { symbol: 'ETH-USD', name: 'Ethereum' },
  { symbol: 'SOL-USD', name: 'Solana' }
]

interface TickerSelectorProps {
  ticker: string
  onTickerChange: (ticker: string) => void
  onAnalyze: (e: React.FormEvent) => void
  loading: boolean
  activeMenu: string
  onMenuChange: (menu: string) => void
}

export function TickerSelector({ ticker, onTickerChange, onAnalyze, loading, activeMenu, onMenuChange }: TickerSelectorProps) {
  return (
    <div className="p-8 border-t border-zinc-100 bg-white z-30">
      <form onSubmit={onAnalyze} className="max-w-3xl mx-auto relative group">
        <select
          value={ticker}
          onChange={(e) => {
            const newTicker = e.target.value;
            onTickerChange(newTicker);
            // If in Agent Market, switch back to workspace when selecting a stock
            if (activeMenu === 'agents') {
              onMenuChange('dashboard');
            }
          }}
          className="w-full pl-8 pr-20 py-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl text-zinc-900 font-bold text-xl appearance-none cursor-pointer outline-none focus:border-zinc-900 transition-all shadow-sm"
        >
          <option value="" disabled>SELECT ASSET TERMINAL...</option>
          {SUPPORTED_TICKERS.map((t) => (
            <option key={t.symbol} value={t.symbol}>{t.symbol} — {t.name}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading || !ticker}
          className="absolute right-3 top-3 bottom-3 px-6 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  )
}