import { describe, expect, it } from 'vitest'
import { assertHealthyMarketData } from './verify-deployment'

describe('assertHealthyMarketData', () => {
  it('accepts a valid market-data payload', () => {
    expect(() =>
      assertHealthyMarketData({
        ok: true,
        cryptoPrices: {
          ethereumMyr: 8_400,
          solanaMyr: 350,
        },
        nisab: {
          fetchedAt: '2026-03-20T00:00:00.000Z',
          nisabMyr: 37_000,
          priceMyrPerGram: 450,
        },
      }),
    ).not.toThrow()
  })

  it('rejects missing nisab data', () => {
    expect(() =>
      assertHealthyMarketData({
        ok: true,
        cryptoPrices: {
          ethereumMyr: 8_400,
          solanaMyr: 350,
        },
      }),
    ).toThrow('nisab.nisabMyr is invalid')
  })

  it('rejects an unhealthy response', () => {
    expect(() =>
      assertHealthyMarketData({
        ok: false,
        error: 'Nisab data is unavailable.',
      }),
    ).toThrow('Nisab data is unavailable.')
  })
})
