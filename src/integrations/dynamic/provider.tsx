import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin'
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'

type DynamicProviderProps = {
  children: React.ReactNode
}

const dynamicEnvironmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID

export function DynamicProvider({ children }: DynamicProviderProps) {
  if (!dynamicEnvironmentId) {
    return <>{children}</>
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId: dynamicEnvironmentId,
        walletConnectors: [
          EthereumWalletConnectors,
          SolanaWalletConnectors,
          BitcoinWalletConnectors,
        ],
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
