import { queryOptions } from '@tanstack/react-query'
import { getWalletNativeBalance } from '../crypto/getWalletNativeBalance'
import type { WalletBalanceRequest } from '../crypto/types'

export const walletNativeBalanceQueryOptions = (wallet: WalletBalanceRequest) =>
  queryOptions({
    queryKey: [
      'wallet-native-balance',
      wallet.address,
      wallet.network,
      ...wallet.chains,
    ],
    queryFn: () => getWalletNativeBalance({ data: wallet }),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
