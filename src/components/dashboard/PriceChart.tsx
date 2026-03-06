'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

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
    <div className="w-full flex flex-col animate-in fade-in duration-700">
      {/* Header internal opsional (menyatu dengan tema gelap) */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <p className="text-[10px] text-stellar font-black uppercase tracking-[0.2em] mb-1">
            Market Performance
          </p>
          <h3 className="font-black text-white tracking-tighter text-lg">
            {ticker} Neural Price History
          </h3>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              {/* Holographic Gradient Fill */}
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(3, 7, 18, 0.8)', // bg-void with opacity
                backdropFilter: 'blur(12px)',
                borderRadius: '16px', 
                border: '1px solid rgba(34, 211, 238, 0.2)', // stellar border
                boxShadow: '0 0 30px rgba(34, 211, 238, 0.15)',
                color: '#f8fafc', // text-slate-50
                fontSize: '13px',
                fontWeight: '900'
              }}
              itemStyle={{ color: '#22d3ee', fontWeight: '900' }} // stellar value
              labelStyle={{ 
                color: '#64748b', 
                marginBottom: '6px', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em', 
                fontSize: '10px',
                fontWeight: 'bold'
              }}
            />
            
            <XAxis 
              dataKey="date" 
              hide={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} // text-slate-500
              minTickGap={30}
              dy={10}
            />
            
            <YAxis 
              hide={true} 
              domain={[minPrice - padding, maxPrice + padding]} 
            />
            
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#22d3ee" // stellar neon stroke
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={2000}
              activeDot={{ r: 6, fill: '#22d3ee', stroke: '#030712', strokeWidth: 3 }} // Titik hover futuristik
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}