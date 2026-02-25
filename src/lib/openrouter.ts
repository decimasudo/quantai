// src/lib/openrouter.ts

export async function analyzeStock(ticker: string, stockData: any, apiKey: string, agentType: string) {
  
  let systemPrompt = "";
  
  // INSTRUKSI KETAT: Memaksa AI menggunakan gaya akademis dan melarang emotikon
  const baseRules = `
    STRICT RULES:
    1. STRICTLY NO EMOJIS. Do not use any emojis, unicode icons, or graphical symbols under any circumstances.
    2. Tone: Highly professional, academic, objective, and institutional (like a Bloomberg or Goldman Sachs report).
    3. Formatting: Use clear Markdown. Use **bold** for key metrics, risk factors, and important terms. Use bullet points for lists.
    4. Structure: Use Header 3 (###) for main sections.
  `;

  if (agentType === 'technical') {
    systemPrompt = `You are an elite Quantitative & Technical Trading Analyst. 
    Your core directive: Analyze the price action, volatility, moving averages, and statistical risk levels. 
    Do not focus on company fundamentals. 
    
    ${baseRules}
    
    Required Output Structure:
    ### 1. Quantitative Overview
    ### 2. Volatility & Momentum Analysis
    ### 3. Risk Management Strategy
    ### 4. Technical Verdict (Buy/Sell/Hold with defined zones)
    `;
  } else {
    systemPrompt = `You are an elite Value Investing & Fundamental Analyst.
    Your core directive: Analyze intrinsic value, valuation multiples (P/E), market cap, yields, and macroeconomic positioning.
    Do not focus on short-term chart patterns.
    
    ${baseRules}
    
    Required Output Structure:
    ### 1. Fundamental Overview
    ### 2. Valuation Analysis
    ### 3. Long-term Risk Assessment
    ### 4. Investment Verdict (Undervalued/Fairly Valued/Overvalued)
    `;
  }

  const userPrompt = `
  Please provide a comprehensive analysis for the following asset: **${ticker}** (${stockData.companyName})

  **Market Data:**
  - Current Price: $${stockData.currentPrice}
  - 52-Week High: $${stockData.week52High}
  - 52-Week Low: $${stockData.week52Low}
  - Market Cap: $${stockData.marketCap}
  - P/E Ratio: ${stockData.peRatio || 'N/A'}
  - EPS: ${stockData.eps || 'N/A'}
  - Dividend Yield: ${stockData.dividendYield ? (stockData.dividendYield * 100).toFixed(2) + '%' : 'N/A'}

  **Quantitative Indicators (Last 30 Days):**
  - 20-Day SMA: $${stockData.quantitative?.sma20?.toFixed(2) || 'N/A'}
  - 30-Day Volatility (Std Dev): ${stockData.quantitative?.volatility?.toFixed(2) || 'N/A'}
  - Calculated Risk Level: ${stockData.quantitative?.riskLevel || 'Unknown'}
  `;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Direkomendasikan oleh OpenRouter
        "HTTP-Referer": "https://quantai.vercel.app", 
        "X-Title": "QuantAI Terminal"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku", // Model ini sangat patuh pada instruksi format
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2 // Diturunkan agar AI lebih analitis dan tidak terlalu kreatif/bertele-tele
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API Error: ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("[OpenRouter] Error:", error.message);
    throw new Error("Failed to generate AI analysis. Please try again.");
  }
}