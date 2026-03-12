import { getWeb3Provider } from '@dynamic-labs/ethers-v6'
import type { Wallet } from '@dynamic-labs/sdk-react-core'
import { formatEther } from 'viem'

export type FetchBalanceResult = {
  formatted: string
  value: bigint
}

export async function fetchBalance(
  primaryWallet: Wallet | null | undefined,
): Promise<FetchBalanceResult | null> {
  if (!primaryWallet?.address) {
    return null
  }

  const provider = await getWeb3Provider(primaryWallet)
  const value = await provider.getBalance(primaryWallet.address)

  return {
    formatted: formatEther(value),
    value,
  }
}
