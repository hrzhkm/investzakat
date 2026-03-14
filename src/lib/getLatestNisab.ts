import { createServerFn } from '@tanstack/react-start'
import { NISAB_GOLD_GRAMS } from './nisab'

export const getLatestNisab = createServerFn({
  method: 'GET',
}).handler(async () => {
  const { getLatestGoldPricePerGram } = await import('#/lib/server/goldData')
  const latestGoldPrice = await getLatestGoldPricePerGram()

  if (!latestGoldPrice) {
    return null
  }

  return {
    fetchedAt: latestGoldPrice.fetchedAt.toISOString(),
    nisabMyr: latestGoldPrice.priceMyrPerGram * NISAB_GOLD_GRAMS,
    priceMyrPerGram: latestGoldPrice.priceMyrPerGram,
  }
})
