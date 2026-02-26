'use client'

import { useState } from 'react'
import { Send, BookOpen, ChevronUp, ChevronDown, Terminal } from 'lucide-react'
import { PROMPT_LIBRARY } from '@/lib/market-hot-spots'

interface TickerSelectorProps {
  ticker: string;
  onTickerChange: (value: string) => void;
  onAnalyze: (e: React.FormEvent) => void;
  loading: boolean;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

export function TickerSelector({ 
  ticker, 
  onTickerChange, 
  onAnalyze, 
  loading, 
  activeMenu, 
  onMenuChange 
}: TickerSelectorProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  // 2. Ubah fungsi klik ini
  const handlePromptSelect = (prompt: string) => {
    // Hanya mengisi field input, tidak mengeksekusi
    if (onTickerChange) {
      onTickerChange(prompt)
    }
    
    // Tutup panel library
    setShowLibrary(false)
  }

  return (
    <div className="p-6 border-t border-zinc-100 bg-white/80 backdrop-blur-md z-30 transition-all duration-300">
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* Prompt Library Toggle */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowLibrary(!showLibrary)}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Prompt Library
              {showLibrary ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Prompt Library Grid */}
          {showLibrary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl max-h-[40vh] overflow-y-auto scrollbar-hide animate-in slide-in-from-bottom-2 fade-in duration-200 shadow-inner">
              {PROMPT_LIBRARY.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-[11px] font-black text-zinc-800 uppercase tracking-widest border-b border-zinc-200 pb-2">
                    {category.category}
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {category.prompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handlePromptSelect(prompt)}
                        className="text-left text-xs font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 p-2.5 rounded-lg transition-colors leading-relaxed"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={onAnalyze} className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
          <div className="relative flex items-center bg-white border-2 border-zinc-200 rounded-2xl shadow-sm focus-within:border-zinc-400 focus-within:shadow-md transition-all overflow-hidden">
            <div className="pl-5 text-zinc-400">
              <Terminal className={`w-5 h-5 transition-colors ${ticker && ticker.trim() !== '' ? 'text-zinc-900' : ''}`} />
            </div>
            
            <input
              type="text"
              value={ticker || ''} // Fallback string kosong untuk mencegah undefined
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => {
                onTickerChange(e.target.value);
                if (activeMenu === 'agents') {
                  onMenuChange('dashboard');
                }
              }}
              placeholder="Ask anything (e.g., 'Analyze the cashflow of AAPL' or just 'BTC-USD')..."
              className="w-full px-4 py-5 bg-transparent text-zinc-900 font-medium text-base outline-none placeholder:text-zinc-400"
            />
            
            <div className="pr-3">
              <button
                type="submit"
                disabled={loading || !ticker || ticker.trim() === ''} // Safe check
                className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all shadow-sm active:scale-95 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}