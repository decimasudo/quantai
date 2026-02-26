'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface PriceChartProps {
  data: any[]
  ticker: string
}

export function PriceChart({ data, ticker }: PriceChartProps) {
  if (!data || data.length === 0) return null

  // Mencari harga terendah untuk mengatur domain Y-Axis agar grafik tidak terlihat "flat"
  const minPrice = Math.min(...data.map(d => d.price))
  const maxPrice = Math.max(...data.map(d => d.price))
  const padding = (maxPrice - minPrice) * 0.1

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm mb-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">Market Performance</p>
          <h3 className="font-bold text-zinc-900 tracking-tight text-lg">{ticker} Price History (60D)</h3>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#18181b" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #e4e4e7', 
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <XAxis 
              dataKey="date" 
              hide={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 'bold' }}
              minTickGap={30}
            />
            <YAxis 
              hide={true} 
              domain={[minPrice - padding, maxPrice + padding]} 
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#18181b" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}