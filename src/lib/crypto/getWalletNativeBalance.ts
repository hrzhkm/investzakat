import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { createServerFn } from '@tanstack/react-start'
import {
  createPublicClient,
  formatEther,
  http,
  type Chain,
  type Hex,
} from 'viem'
import { arbitrum, base, mainnet, optimism } from 'viem/chains'
import { validateEthereumAddress } from './validateEthereumAddress'
import { validateSolanaAddress } from './validateSolanaAddress'
import type {
  ChainBalanceResult,
  WalletBalanceRequest,
  WalletNativeBalanceResult,
} from './types'
import type { EthereumChain } from '../../translations/type'

const solanaRpcUrl = process.env.SOLANA_RPC_URL

const evmChainConfigs: Record<
  EthereumChain,
  { chain: Chain; rpcUrl: string | undefined }
> = {
  ethereum: {
    chain: mainnet,
    rpcUrl: process.env.ETHEREUM_MAINNET_RPC_URL,
  },
  base: {
    chain: base,
    rpcUrl: process.env.BASE_RPC_URL,
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: process.env.ARBITRUM_RPC_URL,
  },
  optimism: {
    chain: optimism,
    rpcUrl: process.env.OPTIMISM_RPC_URL,
  },
}

const solanaConnection = solanaRpcUrl
  ? new Connection(solanaRpcUrl, 'confirmed')
  : null

const evmClients = new Map<
  EthereumChain,
  ReturnType<typeof createPublicClient> | null
>()

export async function fetchWalletNativeBalance(
  data: WalletBalanceRequest,
): Promise<WalletNativeBalanceResult> {
  assertValidWalletRequest(data)

  const balances =
    data.network === 'solana'
      ? [await fetchSolanaBalance(data.address)]
      : await Promise.all(
          data.chains.map((chain) => fetchEvmBalance(chain, data.address)),
        )

  return {
    address: data.address,
    balances,
  }
}

export const getWalletNativeBalance = createServerFn({
  method: 'POST',
})
  .inputValidator((data: WalletBalanceRequest) => data)
  .handler(async ({ data }: { data: WalletBalanceRequest }) =>
    fetchWalletNativeBalance(data),
  )

function assertValidWalletRequest(data: WalletBalanceRequest) {
  if (!data.address.trim()) {
    throw new Error('Wallet address is required.')
  }

  if (data.network === 'solana') {
    if (!validateSolanaAddress(data.address)) {
      throw new Error('Invalid Solana wallet address.')
    }

    return
  }

  if (!validateEthereumAddress(data.address)) {
    throw new Error('Invalid Ethereum wallet address.')
  }

  if (data.chains.length === 0) {
    throw new Error('At least one Ethereum chain must be selected.')
  }
}

async function fetchSolanaBalance(
  address: string,
): Promise<ChainBalanceResult> {
  if (!solanaConnection) {
    return {
      chain: 'solana',
      symbol: 'SOL',
      raw: null,
      formatted: null,
      error: 'Solana RPC URL is not configured.',
    }
  }

  try {
    const lamports = await solanaConnection.getBalance(new PublicKey(address))

    return {
      chain: 'solana',
      symbol: 'SOL',
      raw: lamports.toString(),
      formatted: formatSolBalance(lamports),
      error: null,
    }
  } catch (error) {
    return {
      chain: 'solana',
      symbol: 'SOL',
      raw: null,
      formatted: null,
      error: getErrorMessage(error),
    }
  }
}

async function fetchEvmBalance(
  chain: EthereumChain,
  address: string,
): Promise<ChainBalanceResult> {
  const client = getEvmClient(chain)

  if (!client) {
    return {
      chain,
      symbol: 'ETH',
      raw: null,
      formatted: null,
      error: `${chain} RPC URL is not configured.`,
    }
  }

  try {
    const wei = await client.getBalance({
      address: address as Hex,
    })

    return {
      chain,
      symbol: 'ETH',
      raw: wei.toString(),
      formatted: trimTrailingZeros(formatEther(wei)),
      error: null,
    }
  } catch (error) {
    return {
      chain,
      symbol: 'ETH',
      raw: null,
      formatted: null,
      error: getErrorMessage(error),
    }
  }
}

function getEvmClient(chain: EthereumChain) {
  if (evmClients.has(chain)) {
    return evmClients.get(chain) ?? null
  }

  const config = evmChainConfigs[chain]

  if (!config.rpcUrl) {
    evmClients.set(chain, null)
    return null
  }

  const client = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  })

  evmClients.set(chain, client)

  return client
}

function formatSolBalance(lamports: number) {
  return trimTrailingZeros((lamports / LAMPORTS_PER_SOL).toFixed(6))
}

function trimTrailingZeros(value: string) {
  const trimmed = value.replace(/\.?0+$/, '')

  return trimmed || '0'
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown balance fetch error.'
}
