import { fetchWalletNativeBalance } from '../src/lib/crypto/getWalletNativeBalance'

const ethereumAddress = ''
const solanaAddress = ''

async function main() {
  const results = await Promise.all([
    fetchWalletNativeBalance({
      address: ethereumAddress,
      network: 'ethereum',
      chains: ['ethereum', 'base', 'arbitrum', 'optimism'],
    }),
    fetchWalletNativeBalance({
      address: solanaAddress,
      network: 'solana',
      chains: [],
    }),
  ])

  for (const result of results) {
    console.log(`\nWallet: ${result.address}`)

    for (const balance of result.balances) {
      const label =
        balance.formatted && !balance.error
          ? `${balance.formatted} ${balance.symbol}`
          : `ERROR: ${balance.error ?? 'Unavailable'}`

      console.log(`- ${balance.chain}: ${label}`)
    }
  }
}

void main().catch((error) => {
  console.error('Wallet balance test failed.')
  console.error(error)
  process.exitCode = 1
})
