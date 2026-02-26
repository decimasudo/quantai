'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { Send, Bot, Briefcase, Activity, AlertTriangle, ChevronDown, Layout } from 'lucide-react'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { QuantCard } from '@/components/dashboard/QuantCard'
import { PriceChart } from '@/components/dashboard/PriceChart'

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

export default function Dashboard() {
  const [ticker, setTicker] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [stockData, setStockData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [agentType, setAgentType] = useState('fundamental')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  
  const [historyList, setHistoryList] = useState<any[]>([])
  const [watchlist, setWatchlist] = useState<any[]>([])

  const router = useRouter()
  const supabase = createClient()
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
      } else {
        setUserEmail(user.email || null)
        fetchHistory()
        fetchWatchlist()
      }
    }
    initData()
  }, [router, supabase])

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history')
      const json = await res.json()
      if (json.success) setHistoryList(json.data || [])
    } catch (err) { console.error("History fetch error") }
  }

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist')
      const json = await res.json()
      if (json.success) setWatchlist(json.data || [])
    } catch (err) { console.error("Watchlist fetch error") }
  }

  const executeAnalysis = async (targetTicker: string) => {
    setLoading(true); setError(''); setAnalysis(''); setStockData(null); setTicker(targetTicker)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: targetTicker, agentType }), 
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed.')
      
      setAnalysis(data.analysis)
      setStockData(data.data)
      fetchHistory() 
      setActiveMenu('dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticker || loading) return
    executeAnalysis(ticker)
  }

  const toggleWatchlist = async () => {
    if (!stockData?.symbol) return
    const symbol = stockData.symbol
    const existing = watchlist.find(w => w.ticker === symbol)
    if (existing) {
      await fetch(`/api/watchlist?id=${existing.id}`, { method: 'DELETE' })
      fetchWatchlist()
    } else {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: symbol })
      })
      fetchWatchlist()
    }
  }

  return (
    <div className="flex h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      
      <Sidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
        userEmail={userEmail} 
        history={historyList}
        onSelectHistory={(item) => { 
          setTicker(item.ticker); 
          setAnalysis(item.ai_analysis); 
          setStockData(item.stock_data); 
          setActiveMenu('dashboard') 
        }}
        watchlist={watchlist}
        onSelectWatchlist={(t) => executeAnalysis(t)}
        onRemoveWatchlist={async (id) => { 
          await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' }); 
          fetchWatchlist() 
        }}
        onSignOut={async () => { await supabase.auth.signOut(); router.push('/') }} 
      />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <h1 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Terminal V1.5</h1>
          </div>
          
          <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
            {['fundamental', 'technical'].map((type) => (
              <button 
                key={type}
                onClick={() => setAgentType(type)}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                  agentType === type ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {type === 'fundamental' ? <Briefcase className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
                <span className="capitalize">{type}</span>
              </button>
            ))}
          </div>
        </header>

        {/* WORKSPACE AREA: DUA KOLOM */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {activeMenu === 'dashboard' ? (
            <div className="h-full">
              {!stockData && !loading && !error && (
                <div className="mt-32 text-center animate-in fade-in zoom-in duration-700">
                  <div className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Layout className="w-10 h-10 text-zinc-900" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">Awaiting Ticker Selection.</h2>
                  <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Select an asset below to initialize workspace</p>
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-8 h-full">
                  <div className="lg:col-span-7 space-y-4 animate-pulse">
                    <div className="h-64 bg-zinc-50 rounded-3xl" />
                    <div className="h-96 bg-zinc-50 rounded-3xl" />
                  </div>
                  <div className="lg:col-span-5 animate-pulse">
                    <div className="h-full bg-zinc-50 rounded-3xl" />
                  </div>
                </div>
              )}

              {stockData && !loading && (
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

                    <div className="bg-white text-zinc-800 text-[15px]
                      [&>h3]:text-lg [&>h3]:font-black [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:uppercase [&>h3]:text-zinc-900
                      [&>p]:mb-6 [&>p]:leading-relaxed
                      [&>ul]:mb-8 [&>ul]:list-disc [&>ul]:pl-6
                      first:[&>h3]:mt-0
                    ">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
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

                    {/* Tambahan: Info Card Kecil untuk kesan "Ramai" */}
                    <div className="mt-6 p-6 bg-zinc-900 rounded-2xl text-white shadow-xl">
                       <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Market Sentiment</p>
                       <p className="text-sm font-medium leading-snug">
                          {stockData.symbol} exhibits {stockData.quantitative.trend} trend characteristics over the 60-day window with an RSI of {stockData.quantitative.rsi14.toFixed(2)}.
                       </p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-400 uppercase tracking-widest">Module Under Development</div>
          )}
        </div>

        {/* INPUT SELECTOR */}
        <div className="p-8 border-t border-zinc-100 bg-white z-30">
          <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto relative group">
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
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
              className="absolute right-3 top-3 bottom-3 px-6 bg-zinc-900 text-white rounded-xl hover:bg-black transition-all flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}