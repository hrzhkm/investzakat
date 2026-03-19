import '@tanstack/react-start/server-only'

import type { Prisma } from '@prisma/client'
import { prisma } from '@/db'
import { applyCoinGeckoApiKey } from './coingecko'

const GRAMS_PER_TROY_OUNCE = 31.1034768
const COINGECKO_XAUT_URL = 'https://api.coingecko.com/api/v3/coins/tether-gold'

function getTodayRange(now = new Date()) {
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(end.getDate() + 1)

  return { start, end }
}

export async function getLatestGoldDataForToday(now = new Date()) {
  const { start, end } = getTodayRange(now)

  return prisma.goldData.findFirst({
    where: {
      fetchedAt: {
        gte: start,
        lt: end,
      },
    },
    orderBy: {
      fetchedAt: 'desc',
    },
  })
}

export function convertGoldPriceMyrPerOunceToGram(priceMyrPerOunce: number) {
  return priceMyrPerOunce / GRAMS_PER_TROY_OUNCE
}

function mapGoldDataToPricePerGram(goldData: {
  id: number
  asset: string
  currency: string
  priceMyr: number
  rawData: Prisma.JsonValue
  fetchedAt: Date
  createdAt: Date
}) {
  return {
    ...goldData,
    priceMyrPerGram: convertGoldPriceMyrPerOunceToGram(goldData.priceMyr),
  }
}

export async function getLatestGoldPricePerGram() {
  const latestGoldData = await prisma.goldData.findFirst({
    orderBy: {
      fetchedAt: 'desc',
    },
  })

  if (!latestGoldData) {
    return null
  }

  return mapGoldDataToPricePerGram(latestGoldData)
}

export async function createGoldData(data: {
  priceMyr: number
  rawData: Prisma.InputJsonValue
}) {
  return prisma.goldData.create({
    data,
  })
}

export async function fetchGoldPriceFromCoinGecko() {
  const endpoint = new URL(COINGECKO_XAUT_URL)
  const headers: HeadersInit = {
    accept: 'application/json',
  }

  applyCoinGeckoApiKey(endpoint, headers)

  const upstreamResponse = await fetch(endpoint, {
    headers,
    signal: AbortSignal.timeout(10_000),
  })

  if (!upstreamResponse.ok) {
    const errorText = await upstreamResponse.text()

    throw new Error(
      `Failed to fetch XAUT from CoinGecko (${upstreamResponse.status}): ${
        errorText || upstreamResponse.statusText
      }`,
    )
  }

  const data = await upstreamResponse.json()
  const priceMyr = data?.market_data?.current_price?.myr

  if (typeof priceMyr !== 'number' || Number.isNaN(priceMyr)) {
    throw new Error('CoinGecko response does not contain a valid MYR gold price.')
  }

  return {
    priceMyr,
    rawData: data as Prisma.InputJsonValue,
  }
}

export async function getOrCreateLatestGoldDataForToday(now = new Date()) {
  const existingGoldData = await getLatestGoldDataForToday(now)

  if (existingGoldData) {
    return existingGoldData
  }

  const freshGoldData = await fetchGoldPriceFromCoinGecko()

  return createGoldData(freshGoldData)
}

export async function getResolvableLatestGoldPricePerGram(now = new Date()) {
  const latestGoldData = await getLatestGoldPricePerGram()

  if (latestGoldData && getTodayRange(now).start <= latestGoldData.fetchedAt) {
    return latestGoldData
  }

  try {
    const freshGoldData = await getOrCreateLatestGoldDataForToday(now)

    return mapGoldDataToPricePerGram(freshGoldData)
  } catch (error) {
    if (latestGoldData) {
      console.error(
        'Gold price refresh failed; serving last known gold price instead.',
        error,
      )
      return latestGoldData
    }

    throw error
  }
}
