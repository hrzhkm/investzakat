import { queryOptions } from '@tanstack/react-query'
import { getCryptoPrices } from '../crypto/getCryptoPrices'

export const cryptoPricesQueryOptions = queryOptions({
  queryKey: ['crypto-prices'],
  queryFn: () => getCryptoPrices(),
  staleTime: 1000 * 60,
  refetchOnWindowFocus: false,
})
