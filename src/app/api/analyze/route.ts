import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { fetchQuoteData } from '@/lib/stocks'
import { analyzeStock } from '@/lib/openrouter'

/**
 * Fungsi untuk mengekstrak simbol saham (Ticker) dari kalimat bahasa natural (Prompt).
 * Contoh: "Analyze Apple's (AAPL) short-term trend" -> menghasilkan "AAPL"
 * Contoh: "Compare BTC-USD today" -> menghasilkan "BTC-USD"
 */
function extractTickerFromPrompt(prompt: string): string {
  // 1. Cek apakah ada ticker di dalam kurung: e.g. "What about (AAPL)?" -> "AAPL"
  const parentheticalMatch = prompt.match(/\(([A-Z0-9.\-]+)\)/i);
  if (parentheticalMatch) {
    return parentheticalMatch[1].toUpperCase();
  }

  // 2. Jika tidak ada kurung, cari kata yang seluruhnya huruf besar (panjang 2-8 karakter)
  // Cocok untuk: "Analyze MSFT please" atau "Compare BTC-USD today"
  // Abaikan kata-kata bahasa Inggris umum yang sering diketik kapital penuh seperti "I", "A", dsb.
  const words = prompt.split(/[\s,!?]+/); 
  const uppercaseWord = words.find(w => /^[A-Z0-9.\-]{2,8}$/.test(w));
  if (uppercaseWord) {
    return uppercaseWord.toUpperCase();
  }

  // 3. Fallback: Anggap keseluruhan prompt adalah ticker jika sangat pendek
  // (misal user memang hanya mengetik "NVDA")
  return prompt.trim().toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Tangkap "ticker" yang sekarang berisi prompt penuh dari UI
    const { ticker: promptText, agentType = 'fundamental', model = 'google/gemini-2.0-flash-001' } = body

    if (!promptText || typeof promptText !== 'string') {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 })
    }

    // Ekstrak simbol saham dari kalimat input user
    const tickerSymbol = extractTickerFromPrompt(promptText);
    
    console.log(`[API] Original Prompt: "${promptText}"`);
    console.log(`[API] Extracted Ticker: ${tickerSymbol} | Analyzing with ${agentType} agent...`);

    // 1. Ambil data mentah + kalkulasi kuantitatif menggunakan ticker hasil ekstrak
    console.log(`[API] Fetching stock data for ${tickerSymbol}...`);
    const stockData = await fetchQuoteData(tickerSymbol);
    console.log(`[API] Stock data fetched:`, stockData ? 'success' : 'null');

    if (!stockData) {
      return NextResponse.json({ 
         success: false, 
         error: `Failed to fetch stock data for ${tickerSymbol}. Please check if the asset is valid (e.g., AAPL, BTC-USD).` 
      }, { status: 404 })
    }

    // 2. Lempar ke Agen AI
    const openRouterKey = process.env.OPENROUTER_API_KEY
    console.log(`[API] OpenRouter key present: ${!!openRouterKey}`);
    let aiAnalysis = ''

    if (openRouterKey) {
      console.log(`[API] Calling analyzeStock with model ${model}...`);
      
      // Catatan: Jika suatu saat fungsi analyzeStock Anda diupdate agar bisa menerima prompt asli, 
      // Anda bisa passing variabel `promptText` juga ke dalamnya.
      // Saat ini kita pakai default: analyzeStock(tickerSymbol, stockData, ...)
      aiAnalysis = await analyzeStock(tickerSymbol, stockData, openRouterKey, agentType, model)
      
      console.log(`[API] AI analysis completed`);
    } else {
      return NextResponse.json({ success: false, error: 'OpenRouter API Key is missing.' }, { status: 500 })
    }

    // 3. Simpan riwayat ke Supabase secara diam-diam (tidak menghentikan proses jika gagal)
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase.from('analysis_history').insert({
          user_id: user.id,
          ticker: tickerSymbol, // Menyimpan ticker asli yang dianalisa (misal "AAPL")
          analysis_result: aiAnalysis
        })
      }
    } catch (dbError) {
      console.error("[API] Failed to save history to Supabase:", dbError)
    }

    // Mengirim kembali hasil ke UI
    return NextResponse.json({ success: true, analysis: aiAnalysis, data: stockData })

  } catch (error: any) {
    console.error('[API] Unexpected Error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}