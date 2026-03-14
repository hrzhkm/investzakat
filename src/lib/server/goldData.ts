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

export async function createGoldData(data: {
  priceMyr: number
  rawData: JsonValue
}) {
  return prisma.goldData.create({
    data,
  })
}
