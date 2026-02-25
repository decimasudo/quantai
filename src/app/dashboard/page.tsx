'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { 
  LayoutDashboard, 
  Bot, 
  Settings, 
  LogOut, 
  Send, 
  TrendingUp,
  Activity,
  Briefcase,
  AlertTriangle,
  BarChart2
} from 'lucide-react'

export default function Dashboard() {
  const [ticker, setTicker] = useState('')
  const [analysis, setAnalysis] = useState('')
  const [stockData, setStockData] = useState<any>(null) // State untuk menyimpan data kuantitatif
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  
  const [agentType, setAgentType] = useState('fundamental')
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const router = useRouter()
  const supabase = createClient()
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
      } else {
        setUserEmail(user.email || 'User')
      }
    }
    getUser()
  }, [router, supabase])

  // Otomatis scroll ke bawah saat AI sedang mengetik/selesai
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [analysis, loading])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticker) return

    setLoading(true)
    setError('')
    setAnalysis('')
    setStockData(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, agentType }), 
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze stock')
      }

      setAnalysis(data.analysis)
      setStockData(data.data) // Menyimpan data kuantitatif dari API
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans">
      
      {/* SIDEBAR (Monochrome Professional) */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-100">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-zinc-900">QuantAI</span>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${activeMenu === 'dashboard' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Workspace</span>
            </button>
            <button 
              onClick={() => setActiveMenu('agents')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${activeMenu === 'agents' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <Bot className="w-5 h-5" />
              <span>Agent Market</span>
            </button>
            <button 
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors ${activeMenu === 'settings' ? 'bg-zinc-100 text-zinc-900 font-semibold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Account</span>
              <span className="text-sm font-semibold truncate text-zinc-900">{userEmail}</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-md transition-colors text-sm font-medium shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-white">
        
        {/* Top Header & Agent Selector */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-zinc-200 z-10 sticky top-0">
          <h1 className="text-lg font-bold text-zinc-800">
            {activeMenu === 'dashboard' ? 'Analysis Terminal' : 'Menu'}
          </h1>
          
          <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200">
            <button 
              onClick={() => setAgentType('fundamental')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center space-x-2 ${agentType === 'fundamental' ? 'bg-white shadow-sm text-zinc-900 border border-zinc-200' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Warren (Value)</span>
            </button>
            <button 
              onClick={() => setAgentType('technical')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center space-x-2 ${agentType === 'technical' ? 'bg-white shadow-sm text-zinc-900 border border-zinc-200' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              <Activity className="w-4 h-4" />
              <span>Quant (Tech)</span>
            </button>
          </div>
        </header>

        {/* Chat / Analysis Result Area */}
        <div className="flex-1 overflow-y-auto p-8 pb-40">
          {activeMenu === 'dashboard' && (
            <div className="max-w-4xl mx-auto">
              
              {!analysis && !loading && !error && (
                <div className="flex flex-col items-center justify-center h-64 text-center mt-20">
                  <div className="w-16 h-16 bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                    <Bot className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Initiate Analysis</h2>
                  <p className="text-zinc-500 max-w-md">
                    Enter a stock or crypto ticker below. Our <strong className="text-zinc-800">{agentType === 'fundamental' ? 'Value Investing' : 'Quantitative Trading'}</strong> agent is ready to process market data.
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col space-y-3 w-full max-w-2xl bg-zinc-50 p-6 rounded-2xl border border-zinc-200 animate-pulse">
                    <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
                    <div className="h-3 bg-zinc-200 rounded w-3/4"></div>
                    <div className="h-3 bg-zinc-200 rounded w-1/2"></div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center space-x-3 mb-6">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span className="font-semibold text-sm">{error}</span>
                </div>
              )}

              {stockData && analysis && !loading && (
                <div className="space-y-6">
                  {/* QUANTITATIVE DASHBOARD CARD */}
                  <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-zinc-100">
                      <BarChart2 className="w-5 h-5 text-zinc-700" />
                      <h3 className="font-bold text-zinc-900">Quantitative Overview: {stockData.symbol}</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-medium uppercase mb-1">Current Price</p>
                        <p className="text-xl font-bold text-zinc-900">${stockData.currentPrice?.toFixed(2)}</p>
                      </div>
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-medium uppercase mb-1">20-Day SMA</p>
                        <p className="text-xl font-bold text-zinc-900">${stockData.quantitative?.sma20?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <p className="text-xs text-zinc-500 font-medium uppercase mb-1">Volatility</p>
                        <p className="text-xl font-bold text-zinc-900">{stockData.quantitative?.volatility?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${stockData.quantitative?.riskLevel === 'High' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
                        <p className="text-xs font-medium uppercase mb-1 opacity-70">Risk Level</p>
                        <p className="text-xl font-bold">{stockData.quantitative?.riskLevel || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  {/* AI ANALYSIS BUBBLE */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white p-8 rounded-3xl rounded-tl-none shadow-sm border border-zinc-200 prose prose-zinc max-w-none text-zinc-800">
                      {/* REACT-MARKDOWN RENDERING */}
                      <ReactMarkdown>
                        {analysis}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        {activeMenu === 'dashboard' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-8 px-8">
            <div className="max-w-4xl mx-auto relative">
              <form onSubmit={handleAnalyze} className="relative flex items-center shadow-lg rounded-full bg-white border border-zinc-300 focus-within:border-zinc-500 focus-within:ring-4 focus-within:ring-zinc-100 transition-all">
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="Enter ticker (e.g. AAPL, NVDA, BTC-USD)..."
                  disabled={loading}
                  className="w-full pl-6 pr-16 py-4 bg-transparent text-zinc-900 placeholder-zinc-400 focus:outline-none disabled:opacity-50 text-lg font-medium"
                />
                <button
                  type="submit"
                  disabled={loading || !ticker}
                  className="absolute right-2 p-3 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 text-white rounded-full transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
              <p className="text-center text-xs text-zinc-400 mt-3 font-medium">
                QuantAI Agents process data mathematically. Always conduct your own verification.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}