import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

/**
 * Robustly parses a JSON field (e.g. JSONB columns that might be stringified or escaped in n8n)
 */
export function robustParseJson<T>(input: unknown, defaultValue: T): T {
  if (input === null || input === undefined) return defaultValue

  if (typeof input === 'object') {
    return input as T
  }

  if (typeof input !== 'string') {
    return defaultValue
  }

  let cleaned = input.trim()

  // Try direct parse first
  try {
    const parsed = JSON.parse(cleaned)
    if (parsed && typeof parsed === 'object') {
      return parsed as T
    }
    if (typeof parsed === 'string') {
      return robustParseJson<T>(parsed, defaultValue)
    }
  } catch {
    // Ignore direct parse error and continue
  }

  // Handle corrupted n8n-style stringification
  if (cleaned.startsWith('["')) {
    cleaned = '[' + cleaned.substring(2)
  }
  if (cleaned.endsWith('"]')) {
    cleaned = cleaned.substring(0, cleaned.length - 2) + ']'
  }

  // Replace escaped quotes
  cleaned = cleaned.replace(/\\"/g, '"')
  cleaned = cleaned.replace(/\\\\"/g, '"')

  try {
    const parsed = JSON.parse(cleaned)
    if (parsed && typeof parsed === 'object') {
      return parsed as T
    }
    if (typeof parsed === 'string') {
      return robustParseJson<T>(parsed, defaultValue)
    }
  } catch (e) {
    console.error('robustParseJson failed to parse:', cleaned.substring(0, 100), e)
  }

  return defaultValue
}


