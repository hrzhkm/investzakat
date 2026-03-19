export function getCoinGeckoApiKey() {
  return process.env.COINGECKO_API_KEY || process.env.VITE_COINGECKO_API_KEY
}

export function applyCoinGeckoApiKey(url: URL, headers: HeadersInit) {
  const apiKey = getCoinGeckoApiKey()

  if (!apiKey) {
    return
  }

  url.searchParams.set('x_cg_demo_api_key', apiKey)

  if (headers instanceof Headers) {
    headers.set('x-cg-demo-api-key', apiKey)
    return
  }

  if (Array.isArray(headers)) {
    headers.push(['x-cg-demo-api-key', apiKey])
    return
  }

  headers['x-cg-demo-api-key'] = apiKey
}
