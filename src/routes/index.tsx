import { useEffect, useState } from 'react'
import {
  DynamicConnectButton,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core'
import { createFileRoute } from '@tanstack/react-router'

import type { FetchBalanceResult } from '#/lib/crypto/fetchBalance'
import { fetchBalance } from '#/lib/crypto/fetchBalance'

const hasDynamicEnvironmentId = Boolean(
  import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
)

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="min-h-[calc(100vh-6.75rem)] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,24rem)]">
        <section className="rounded-[2rem] border border-white/55 bg-white/60 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-white/50 backdrop-blur-xl sm:p-10">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Wallet Overview
          </span>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
            Check your wallet balance before calculating your zakat.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Connect your wallet to load the latest on-chain balance from your
            primary Dynamic wallet.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <StatCard
              eyebrow="Why it matters"
              title="Current holdings"
              body="See your connected balance first so your zakat estimate starts from live wallet data."
            />
            <StatCard
              eyebrow="Next step"
              title="Use the fetched value"
              body="Once connected, you can feed this number into your zakat calculation flow."
            />
          </div>
        </section>

        {hasDynamicEnvironmentId ? <BalancePanel /> : <DynamicDisabledPanel />}
      </div>
    </main>
  )
}

function BalancePanel() {
  const { primaryWallet, sdkHasLoaded } = useDynamicContext()
  const [balance, setBalance] = useState<FetchBalanceResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isCancelled = false

    async function loadBalance() {
      if (!sdkHasLoaded) {
        return
      }

      if (!primaryWallet?.address) {
        setBalance(null)
        setErrorMessage(null)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextBalance = await fetchBalance(primaryWallet)

        if (isCancelled) {
          return
        }

        setBalance(nextBalance)
      } catch (error) {
        if (isCancelled) {
          return
        }

        setBalance(null)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to fetch balance for the connected wallet.',
        )
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadBalance()

    return () => {
      isCancelled = true
    }
  }, [primaryWallet, sdkHasLoaded])

  const address = primaryWallet?.address

  return (
    <aside className="rounded-[2rem] border border-white/55 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.84))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.2)] ring-1 ring-white/10 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200/85">
        Connected Wallet
      </p>

      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-slate-300">Address</p>
        <p className="mt-2 break-all text-sm font-medium text-white">
          {address ?? 'Connect a wallet to load the balance.'}
        </p>
      </div>

      <div className="mt-4 rounded-[1.5rem] border border-sky-300/15 bg-sky-400/10 p-5">
        <p className="text-sm text-sky-100/80">Balance</p>
        <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
          {isLoading ? 'Loading...' : balance ? `${balance.formatted} ETH` : '-'}
        </p>
        <p className="mt-2 text-sm text-sky-100/70">
          {errorMessage ??
            (address
              ? 'Fetched from the connected primary wallet.'
              : 'Waiting for a wallet connection.')}
        </p>
      </div>

      <div className="mt-6">
        <DynamicConnectButton
          buttonClassName="inline-flex h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white px-5 text-sm font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 active:translate-y-0"
          buttonContainerClassName="block"
        >
          {address ? 'Manage Wallet' : 'Connect Wallet'}
        </DynamicConnectButton>
      </div>
    </aside>
  )
}

function DynamicDisabledPanel() {
  return (
    <aside className="rounded-[2rem] border border-white/55 bg-white/60 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-white/50 backdrop-blur-xl sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        Wallet Status
      </p>
      <p className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
        Dynamic wallet integration is not configured.
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Set <code>VITE_DYNAMIC_ENVIRONMENT_ID</code> to enable wallet
        connection and balance fetching on this page.
      </p>
    </aside>
  )
}

type StatCardProps = {
  eyebrow: string
  title: string
  body: string
}

function StatCard({ eyebrow, title, body }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {eyebrow}
      </p>
      <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  )
}
