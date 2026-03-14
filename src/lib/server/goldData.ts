import '@tanstack/react-start/server-only'

import { prisma } from '@/db'

type JsonValue =
  | JsonObject
  | JsonArray
  | string
  | number
  | boolean
type JsonObject = { [key: string]: JsonValue | null }
type JsonArray = Array<JsonValue | null>

const GRAMS_PER_TROY_OUNCE = 31.1034768

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

export async function getLatestGoldPricePerGram() {
  const latestGoldData = await prisma.goldData.findFirst({
    orderBy: {
      fetchedAt: 'desc',
    },
  })

  if (!latestGoldData) {
    return null
  }

  return {
    ...latestGoldData,
    priceMyrPerGram: convertGoldPriceMyrPerOunceToGram(latestGoldData.priceMyr),
  }
}

export async function createGoldData(data: {
  priceMyr: number
  rawData: JsonValue
}) {
  return prisma.goldData.create({
    data,
  })
}
