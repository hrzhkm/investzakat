import '@tanstack/react-start/server-only'

import { prisma } from '#/db'

export async function createGoldData(data: {
  priceMyr: number
  rawData: unknown
}) {
  return prisma.goldData.create({
    data,
  })
}
