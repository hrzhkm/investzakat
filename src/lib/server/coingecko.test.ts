import { afterEach, describe, expect, it } from 'vitest'
import { applyCoinGeckoApiKey, getCoinGeckoApiKey } from './coingecko'

describe('getCoinGeckoApiKey', () => {
  afterEach(() => {
    delete process.env.COINGECKO_API_KEY
    delete process.env.VITE_COINGECKO_API_KEY
  })

  it('prefers the server-only key when both are present', () => {
    process.env.COINGECKO_API_KEY = 'server-key'
    process.env.VITE_COINGECKO_API_KEY = 'vite-key'

    expect(getCoinGeckoApiKey()).toBe('server-key')
  })

  it('falls back to the vite key when needed', () => {
    process.env.VITE_COINGECKO_API_KEY = 'vite-key'

    expect(getCoinGeckoApiKey()).toBe('vite-key')
  })
})

describe('applyCoinGeckoApiKey', () => {
  afterEach(() => {
    delete process.env.COINGECKO_API_KEY
    delete process.env.VITE_COINGECKO_API_KEY
  })

  it('adds the api key to both query params and plain-object headers', () => {
    process.env.COINGECKO_API_KEY = 'server-key'
    const url = new URL('https://api.coingecko.com/api/v3/simple/price')
    const headers: HeadersInit = { accept: 'application/json' }

    applyCoinGeckoApiKey(url, headers)

    expect(url.searchParams.get('x_cg_demo_api_key')).toBe('server-key')
    expect((headers as Record<string, string>)['x-cg-demo-api-key']).toBe(
      'server-key',
    )
  })

  it('adds the api key to Headers instances', () => {
    process.env.VITE_COINGECKO_API_KEY = 'vite-key'
    const url = new URL('https://api.coingecko.com/api/v3/simple/price')
    const headers = new Headers({ accept: 'application/json' })

    applyCoinGeckoApiKey(url, headers)

    expect(url.searchParams.get('x_cg_demo_api_key')).toBe('vite-key')
    expect(headers.get('x-cg-demo-api-key')).toBe('vite-key')
  })
})
