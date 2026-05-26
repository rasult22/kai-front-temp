import { PROTOTYPE_MODE } from '.'

export function safeWebApp<T>(fn: () => T, fallback: T): T {
  if (!PROTOTYPE_MODE) return fn()
  try {
    return fn()
  } catch {
    return fallback
  }
}

export function safeHaptic() {
  if (PROTOTYPE_MODE) return
  try {
    const WebApp = (window as any).Telegram?.WebApp
    WebApp?.HapticFeedback?.impactOccurred?.('medium')
  } catch {}
}
