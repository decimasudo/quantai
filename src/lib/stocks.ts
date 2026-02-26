// src/lib/stocks.ts

let globalCookie = '';
let globalCrumb = '';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function getYahooAuth() {
  if (globalCrumb && globalCookie) return { cookie: globalCookie, crumb: globalCrumb };
  
  try {
    const cookieRes = await fetch('https://fc.yahoo.com', {
      headers: { 'User-Agent': USER_AGENT },
      cache: 'no-store'
    });
    
    const setCookie = cookieRes.headers.get('set-cookie');
    if (setCookie) {
      globalCookie = setCookie.split(';')[0];
    }

    const crumbRes = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
      headers: { 'User-Agent': USER_AGENT, 'Cookie': globalCookie },
      cache: 'no-store'
    });
    
    globalCrumb = await crumbRes.text();
  } catch (error) {
    console.error('[Auth] Gagal mengambil Yahoo Crumb:', error);
  }
  
  return { cookie: globalCookie, crumb: globalCrumb };
}

export async function fetchQuoteData(ticker: string): Promise<any | null> {
  try {
    const symbol = ticker.toUpperCase().trim();
    const { cookie, crumb } = await getYahooAuth();

    const headers = {
      'User-Agent': USER_AGENT,
      'Cookie': cookie,
      'Accept': 'application/json'
    };

    // 1. MENGAMBIL DATA FUNDAMENTAL
    const quoteUrl = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${symbol}&crumb=${crumb}`;
    const quoteRes = await fetch(quoteUrl, { headers, cache: 'no-store' });
    
    if (!quoteRes.ok) throw new Error(`Fundamental API returned status: ${quoteRes.status}`);
    
    const quoteData = await quoteRes.json();
    const quote = quoteData.quoteResponse?.result?.[0];

    if (!quote) return null;

    // 2. MENGAMBIL DATA HISTORIS UNTUK MATEMATIKA & GRAFIK VISUAL
    // Kita ambil rentang 60 hari agar grafik visual terlihat lebih panjang dan dinamis
    const chartUrl = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=60d&crumb=${crumb}`;
    const chartRes = await fetch(chartUrl, { headers, cache: 'no-store' });
    
    let sma20 = 0;
    let volatility = 0;
    let riskLevel = 'Unknown';
    let rsi14 = 0;
    let trend = 'Neutral';
    let historicalData: any[] = []; // <--- DATA BARU UNTUK RECHARTS

    if (chartRes.ok) {
      const chartData = await chartRes.json();
      const result = chartData.chart?.result?.[0];
      
      const timestamps = result?.timestamp || [];
      const rawClosePrices = result?.indicators?.quote?.[0]?.close || [];
      
      // Filter array untuk menghindari data 'null' pada hari libur bursa
      const validData = [];
      for (let i = 0; i < timestamps.length; i++) {
        if (rawClosePrices[i] !== null && rawClosePrices[i] !== undefined) {
          validData.push({
            time: timestamps[i],
            price: rawClosePrices[i]
          });
        }
      }

      const closePrices = validData.map(d => d.price);

      if (closePrices.length > 0) {
        const currentPrice = closePrices[closePrices.length - 1];

        // A. Susun Data untuk Grafik UI (Format Tanggal & Harga)
        historicalData = validData.map(d => ({
          date: new Date(d.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Number(d.price.toFixed(2))
        }));

        // B. Kalkulasi SMA 20
        const period20 = Math.min(20, closePrices.length);
        const recent20 = closePrices.slice(-period20);
        const sum20 = recent20.reduce((a, b) => a + b, 0);
        sma20 = sum20 / period20;

        // C. Kalkulasi Volatilitas & Risiko
        const mean = sma20;
        const variance = recent20.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period20;
        volatility = Math.sqrt(variance);
        riskLevel = volatility > (mean * 0.05) ? 'High' : 'Low';

        // D. Identifikasi Momentum Trend Dasar
        trend = currentPrice > sma20 ? 'Bullish' : 'Bearish';

        // E. Kalkulasi RSI 14
        if (closePrices.length > 14) {
          let gains = 0;
          let losses = 0;
          for (let i = closePrices.length - 14; i < closePrices.length; i++) {
            const difference = closePrices[i] - closePrices[i - 1];
            if (difference >= 0) {
              gains += difference;
            } else {
              losses -= difference;
            }
          }
          const avgGain = gains / 14;
          const avgLoss = losses / 14;
          if (avgLoss === 0) {
            rsi14 = 100;
          } else {
            const rs = avgGain / avgLoss;
            rsi14 = 100 - (100 / (1 + rs));
          }
        }
      }
    }

    // 3. MENGAMBIL BERITA TERBARU
    let recentNews: any[] = [];
    try {
      const newsUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${symbol}&quotesCount=0&newsCount=5`;
      const newsRes = await fetch(newsUrl, { headers: { 'User-Agent': USER_AGENT }, cache: 'no-store' });
      
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        recentNews = (newsData.news || []).map((item: any) => ({
          title: item.title,
          publisher: item.publisher,
          link: item.link
        }));
      }
    } catch (newsError) {
      console.error(`[stocks.ts] Failed to fetch news for ${symbol}:`, newsError);
    }

    // 4. MERAKIT DATA KESELURUHAN
    return {
      symbol: quote.symbol,
      companyName: quote.shortName || quote.longName || symbol,
      currentPrice: quote.regularMarketPrice || 0,
      marketCap: quote.marketCap || 0,
      peRatio: quote.trailingPE || 0,
      eps: quote.epsTrailingTwelveMonths || 0,
      dividendYield: quote.dividendYield || 0,
      week52High: quote.fiftyTwoWeekHigh || 0,
      week52Low: quote.fiftyTwoWeekLow || 0,
      volume: quote.regularMarketVolume || 0,
      historicalData, // <--- Array titik koordinat dikirim ke Frontend!
      quantitative: {
        sma20,
        volatility,
        riskLevel,
        rsi14,
        trend
      },
      news: recentNews
    };

  } catch (error: any) {
    console.error(`[stocks.ts] Native Fetch Error for ${ticker}:`, error.message);
    return null;
  }
}