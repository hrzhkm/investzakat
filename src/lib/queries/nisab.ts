import { queryOptions } from '@tanstack/react-query'
import { getLatestNisab } from '../getLatestNisab'

export const latestNisabQueryOptions = queryOptions({
  queryKey: ['latest-nisab'],
  queryFn: () => getLatestNisab(),
  staleTime: 1000 * 60 * 60,
})
