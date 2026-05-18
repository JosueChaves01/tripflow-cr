import OpenAI from 'openai'

// MiniMax M2.7 is OpenAI-compatible.
// Token Plan keys start with sk-cp-
// Endpoint: https://api.minimax.io/v1
export const minimax = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY!,
  baseURL: process.env.MINIMAX_BASE_URL ?? 'https://api.minimax.io/v1',
})

// Recommended parameters for M2.7 (from official MiniMax docs)
export const MINIMAX_MODEL = 'MiniMax-M2.7'
export const MINIMAX_DEFAULTS = {
  temperature: 1.0,   // official recommendation
  top_p: 0.95,        // official recommendation
  max_tokens: 4096,
} as const