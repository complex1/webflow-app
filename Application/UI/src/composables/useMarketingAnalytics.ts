/** PRD: named analytics events (`cta_hero_primary`, …). Hook or listen on `marketing-analytics`. */
export const MARKETING_ANALYTICS_EVENT = 'marketing-analytics' as const

export type MarketingAnalyticsDetail = {
  name: string
  path?: string
}

export function trackMarketingEvent(name: string, detail: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent(MARKETING_ANALYTICS_EVENT, {
      detail: { name, ...detail },
    }),
  )
}
