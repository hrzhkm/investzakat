import { PublicKey } from '@solana/web3.js'

export function validateSolanaAddress(address: string) {
  try {
    const publicKey = new PublicKey(address.trim())
    return publicKey.toBase58().length > 0
  } catch {
    return false
  }
}
