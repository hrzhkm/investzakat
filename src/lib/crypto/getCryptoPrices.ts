import { createServerFn } from '@tanstack/react-start'

type CryptoPriceResponse = {
  ethereum?: {
    myr?: number
  }
  solana?: {
    myr?: number
  }
}

export type CryptoPrices = {
  ethereumMyr: number
  solanaMyr: number
}

const coingeckoSimplePriceUrl =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana&vs_currencies=myr'

export const getCryptoPrices = createServerFn({
  method: 'GET',
}).handler(async (): Promise<CryptoPrices> => {
  const headers: HeadersInit = {
    accept: 'application/json',
  }

  const apiKey = process.env.VITE_COINGECKO_API_KEY

  if (apiKey) {
    headers['x-cg-demo-api-key'] = apiKey
  }

  const response = await fetch(coingeckoSimplePriceUrl, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch crypto prices: ${response.statusText}`)
  }

  const data = (await response.json()) as CryptoPriceResponse
  const ethereumMyr = data.ethereum?.myr
  const solanaMyr = data.solana?.myr

  if (
    typeof ethereumMyr !== 'number' ||
    Number.isNaN(ethereumMyr) ||
    typeof solanaMyr !== 'number' ||
    Number.isNaN(solanaMyr)
  ) {
    throw new Error(
      'CoinGecko did not return valid MYR prices for ETH and SOL.',
    )
  }

  return {
    ethereumMyr,
    solanaMyr,
  }
})
