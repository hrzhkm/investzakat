import { createServerFn } from '@tanstack/react-start'
import { applyCoinGeckoApiKey } from '../server/coingecko'
import { getRedisClient } from '../server/redis'

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
const cryptoPricesCacheKey = 'crypto:prices:myr:ethereum-solana'
const cryptoPricesStaleCacheKey = 'crypto:prices:myr:ethereum-solana:last-good'
const cryptoPricesCacheTtlSeconds = 60 * 10

export const getCryptoPrices = createServerFn({
  method: 'GET',
}).handler(async (): Promise<CryptoPrices> => {
  const cachedPrices = await getCachedCryptoPrices()

  if (cachedPrices) {
    return cachedPrices
  }

  try {
    const freshPrices = await fetchCryptoPricesFromCoinGecko()

    await cacheCryptoPrices(freshPrices)

    return freshPrices
  } catch (error) {
    const stalePrices = await getStaleCryptoPrices()

    if (stalePrices) {
      console.error(
        'CoinGecko crypto price fetch failed; serving last known prices instead.',
        error,
      )
      return stalePrices
    }

    throw error
  }
})

async function fetchCryptoPricesFromCoinGecko(): Promise<CryptoPrices> {
  const endpoint = new URL(coingeckoSimplePriceUrl)
  const headers: HeadersInit = {
    accept: 'application/json',
  }

  applyCoinGeckoApiKey(endpoint, headers)

  const response = await fetch(endpoint, {
    headers,
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(
      `Failed to fetch crypto prices from CoinGecko (${response.status}): ${
        details || response.statusText
      }`,
    )
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
}

async function getCachedCryptoPrices() {
  return getCryptoPricesFromCacheKey(cryptoPricesCacheKey)
}

async function getStaleCryptoPrices() {
  return getCryptoPricesFromCacheKey(cryptoPricesStaleCacheKey)
}

async function getCryptoPricesFromCacheKey(cacheKey: string) {
  const redis = getRedisClient()

  if (!redis) {
    return null
  }

  try {
    await ensureRedisConnection(redis)
    const cached = await redis.get(cacheKey)

    if (!cached) {
      return null
    }

    const parsed = JSON.parse(cached) as Partial<CryptoPrices>

    if (
      typeof parsed.ethereumMyr !== 'number' ||
      Number.isNaN(parsed.ethereumMyr) ||
      typeof parsed.solanaMyr !== 'number' ||
      Number.isNaN(parsed.solanaMyr)
    ) {
      return null
    }

    return {
      ethereumMyr: parsed.ethereumMyr,
      solanaMyr: parsed.solanaMyr,
    }
  } catch {
    return null
  }
}

async function cacheCryptoPrices(prices: CryptoPrices) {
  const redis = getRedisClient()

  if (!redis) {
    return
  }

  try {
    await ensureRedisConnection(redis)
    await redis.set(
      cryptoPricesCacheKey,
      JSON.stringify(prices),
      'EX',
      cryptoPricesCacheTtlSeconds,
    )
    await redis.set(cryptoPricesStaleCacheKey, JSON.stringify(prices))
  } catch {
    // Cache write failures should not break price fetching.
  }
}

async function ensureRedisConnection(
  redis: NonNullable<ReturnType<typeof getRedisClient>>,
) {
  if (redis.status === 'wait') {
    await redis.connect()
  }
}
