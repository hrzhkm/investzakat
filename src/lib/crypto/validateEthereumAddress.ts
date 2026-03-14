import { isAddress } from 'ethers'

export function validateEthereumAddress(address: string) {
  return isAddress(address.trim())
}
