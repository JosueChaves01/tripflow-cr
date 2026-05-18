'use client'
import { useTripFlowStore } from '@/store'

export function useUser() {
  return useTripFlowStore((s) => s.user)
}