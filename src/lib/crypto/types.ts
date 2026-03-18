import type { EthereumChain } from '../../translations/type'

export type Network = 'solana' | 'ethereum'

export type BalanceChain = 'solana' | EthereumChain

export type WalletBalanceRequest = {
  address: string
  network: Network
  chains: EthereumChain[]
}

export type ChainBalanceResult = {
  chain: BalanceChain
  symbol: 'SOL' | 'ETH'
  raw: string | null
  formatted: string | null
  error: string | null
}

export type WalletNativeBalanceResult = {
  address: string
  balances: ChainBalanceResult[]
}
