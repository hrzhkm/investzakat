import { DynamicWidget } from '@dynamic-labs/sdk-react-core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

const hasDynamicEnvironmentId = Boolean(import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID)

function App() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-bold">InvestZakat Wallet Adapter</h1>
      <p className="text-muted-foreground">
        Connect with Ethereum, Solana, or Bitcoin using Dynamic.
      </p>

      {hasDynamicEnvironmentId ? (
        <DynamicWidget />
      ) : (
        <p className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm">
          Set <code>VITE_DYNAMIC_ENVIRONMENT_ID</code> in your env file to enable
          wallet connections.
        </p>
      )}
    </main>
  )
}
