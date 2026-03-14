import type { FormEvent } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { createFileRoute } from '@tanstack/react-router'
import {
  BadgeCheck,
  Coins,
  Landmark,
  Plus,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { validateEthereumAddress } from '../../lib/crypto/validateEthereumAddress'
import { validateSolanaAddress } from '../../lib/crypto/validateSolanaAddress'
import { useLanguage } from '../../lib/i18n'
import { getTranslations } from '../../translations'
import type { EthereumChain } from '../../translations/type'

export const Route = createFileRoute('/calculator/')({
  component: CalculatorPage,
})

type Network = 'solana' | 'ethereum'

type WalletEntry = {
  id: number
  address: string
  network: Network
  chains: EthereumChain[]
}

const ethereumChainOptions: EthereumChain[] = [
  'ethereum',
  'base',
  'arbitrum',
  'optimism',
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.985,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

const hardcodedPortfolio = {
  total: 146_600,
  nisab: 28_000,
  zakatEstimate: 3_665,
}

function CalculatorPage() {
  const { language } = useLanguage()
  const copy = getTranslations(language).calculator
  const networkOptions: Array<{ value: Network; label: string }> = [
    { value: 'solana', label: copy.solana },
    { value: 'ethereum', label: copy.ethereum },
  ]
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState<Network>('solana')
  const [selectedChains, setSelectedChains] = useState<EthereumChain[]>([
    'ethereum',
    'base',
  ])
  const [wallets, setWallets] = useState<WalletEntry[]>([])
  const [addressError, setAddressError] = useState<string | null>(null)
  const [isAddWalletOpen, setIsAddWalletOpen] = useState(false)

  const trackedChainsCount = wallets.reduce((count, wallet) => {
    return count + (wallet.network === 'ethereum' ? wallet.chains.length : 1)
  }, 0)

  const zakatDue = hardcodedPortfolio.total >= hardcodedPortfolio.nisab

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedAddress = address.trim()
    if (!trimmedAddress) {
      return
    }

    if (network === 'solana' && !validateSolanaAddress(trimmedAddress)) {
      setAddressError(copy.solanaValidationError)
      return
    }

    if (network === 'ethereum' && !validateEthereumAddress(trimmedAddress)) {
      setAddressError(copy.ethereumValidationError)
      return
    }

    setWallets((current) => [
      {
        id: Date.now(),
        address: trimmedAddress,
        network,
        chains: network === 'ethereum' ? selectedChains : [],
      },
      ...current,
    ])
    setAddress('')
    setAddressError(null)
    setIsAddWalletOpen(false)
  }

  function toggleEthereumChain(chain: EthereumChain) {
    setSelectedChains((current) => {
      if (current.includes(chain)) {
        if (current.length === 1) {
          return current
        }

        return current.filter((item) => item !== chain)
      }

      return [...current, chain]
    })
  }

  return (
    <main className="min-h-[calc(100vh-6.75rem)] overflow-hidden px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.section
          animate="visible"
          className="relative"
          initial="hidden"
          variants={containerVariants}
        >
          <div className="pointer-events-none absolute left-[-4rem] top-10 h-56 w-56 rounded-full bg-emerald-200/50 blur-3xl" />
          <div className="pointer-events-none absolute right-[-3rem] top-20 h-64 w-64 rounded-full bg-sky-200/55 blur-3xl" />

          <motion.div
            className="mx-auto max-w-3xl text-center"
            variants={itemVariants}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.38em] text-slate-500">
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {copy.description}
            </p>
          </motion.div>

          <motion.div
            className="relative mt-12 grid gap-6 lg:grid-cols-[1.8fr_0.95fr]"
            variants={itemVariants}
          >
            <section className="relative overflow-hidden rounded-[2.4rem] border border-slate-900/85 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(245,248,252,0.92))] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.15)] sm:p-7">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_72%)]" />
              <div className="pointer-events-none absolute bottom-6 right-6 h-24 w-24 rounded-full bg-amber-100/80 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">
                      {copy.inputLabel}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">
                      {copy.trackedTitle}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                      {copy.trackedDescription}
                    </p>
                  </div>

                  <div className="hidden rounded-[1.4rem] border border-slate-200 bg-white/80 p-3 shadow-[0_16px_36px_rgba(15,23,42,0.08)] sm:block">
                    <Wallet className="h-7 w-7 text-slate-900" />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_40px_rgba(15,23,42,0.06)] sm:p-5">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {copy.addWallet}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {copy.networkDescription}
                    </p>
                  </div>

                  <Dialog
                    onOpenChange={(open) => {
                      setIsAddWalletOpen(open)
                      if (open) {
                        setAddressError(null)
                      }
                    }}
                    open={isAddWalletOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="h-12 rounded-xl border border-slate-950 bg-slate-950 px-5 text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] hover:bg-slate-800">
                        <Plus className="h-4 w-4" />
                        {copy.addWallet}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[85vh] w-[min(92vw,36rem)] max-w-none overflow-y-auto rounded-[2rem] border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(249,250,251,0.99))] p-0 shadow-[0_40px_120px_rgba(15,23,42,0.22)]">
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_48%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_44%)]" />

                        <div className="relative border-b border-slate-200/80 px-6 pb-6 pt-8 sm:px-8">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.4rem] border border-white/80 bg-white shadow-[0_18px_38px_rgba(15,23,42,0.08)]">
                              <Wallet className="h-6 w-6 text-slate-950" />
                            </div>

                            <DialogHeader className="gap-3 text-left">
                              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                {copy.networkLabel}
                              </p>
                              <DialogTitle className="text-3xl font-semibold tracking-[-0.06em] text-slate-950">
                                {copy.addWallet}
                              </DialogTitle>
                              <DialogDescription className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                                {copy.description}
                              </DialogDescription>
                            </DialogHeader>
                          </div>
                        </div>

                        <form className="px-6 py-6 sm:px-8 sm:py-8" onSubmit={handleSubmit}>
                          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_44px_rgba(15,23,42,0.06)] sm:p-6">
                            <div className="space-y-5">
                              <div>
                                <label className="block text-sm font-semibold text-slate-700">
                                  {copy.inputLabel}
                                </label>

                                <input
                                  className="mt-3 h-14 w-full rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                  onChange={(event) => {
                                    setAddress(event.target.value)
                                    if (addressError) {
                                      setAddressError(null)
                                    }
                                  }}
                                  placeholder={copy.inputPlaceholder}
                                  type="text"
                                  value={address}
                                />

                                {addressError ? (
                                  <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                                    {addressError}
                                  </p>
                                ) : null}
                              </div>

                              <div className="rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,#fbfdff,#f5f7fb)] p-4">
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
                                    <ShieldCheck className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                                      {copy.networkLabel}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                      {copy.networkDescription}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-4">
                                  <Select
                                    onValueChange={(value) => {
                                      setNetwork(value as Network)
                                      setAddressError(null)
                                    }}
                                    value={network}
                                  >
                                    <SelectTrigger className="h-13 rounded-[1.15rem] border-slate-200 bg-white">
                                      <SelectValue placeholder={copy.networkLabel} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {networkOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>

                          {network === 'ethereum' ? (
                            <div className="mt-5 rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#fbfdff,#f3f7fb)] p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-6">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                                  <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-950">
                                    {copy.chainsLabel}
                                  </p>
                                  <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {copy.chainsDescription}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {ethereumChainOptions.map((chain) => {
                                  const checked = selectedChains.includes(chain)

                                  return (
                                    <label
                                      className={`flex cursor-pointer items-center justify-between rounded-[1.2rem] border px-4 py-3.5 text-sm transition ${
                                        checked
                                          ? 'border-slate-950 bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)]'
                                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                      }`}
                                      key={chain}
                                    >
                                      <span className="font-semibold">
                                        {copy.chainLabels[chain]}
                                      </span>
                                      <input
                                        checked={checked}
                                        className="h-4 w-4 accent-white"
                                        onChange={() => toggleEthereumChain(chain)}
                                        type="checkbox"
                                      />
                                    </label>
                                  )
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-5 rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">
                              {copy.networkDescription}
                            </div>
                          )}

                          <div className="mt-6 flex justify-end border-t border-slate-200/80 pt-5">
                            <Button
                              className="h-12 rounded-xl border border-slate-950 bg-slate-950 px-6 text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] hover:bg-slate-800"
                              disabled={!address.trim()}
                              type="submit"
                            >
                              <Plus className="h-4 w-4" />
                              {copy.addWallet}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-6 grid gap-4">
                  {wallets.length > 0 ? (
                    wallets.map((wallet) => (
                      <article
                        className="rounded-[1.7rem] border border-slate-200 bg-white/92 p-4 shadow-[0_18px_38px_rgba(15,23,42,0.06)]"
                        key={wallet.id}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                              {wallet.network === 'solana'
                                ? copy.solana
                                : copy.ethereum}
                            </p>
                            <p className="mt-2 break-all text-sm font-medium text-slate-900 sm:text-base">
                              {wallet.address}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(wallet.network === 'ethereum'
                              ? wallet.chains
                              : ['solana']
                            ).map((chain) => (
                              <span
                                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
                                key={chain}
                              >
                                {chain === 'solana'
                                  ? copy.solana
                                  : copy.chainLabels[chain as EthereumChain]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[1.7rem] border border-dashed border-slate-300 bg-white/60 px-5 py-10 text-center text-sm text-slate-500">
                      {copy.emptyState}
                    </div>
                  )}
                </div>
              </div>
            </section>

            <aside className="relative overflow-hidden rounded-[2.4rem] border border-slate-900/85 bg-[linear-gradient(180deg,#fffef8,#f7fbff)] p-5 shadow-[0_30px_90px_rgba(15,23,42,0.15)] sm:p-6">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_72%)]" />
              <div className="pointer-events-none absolute right-4 top-10 h-20 w-20 rounded-full bg-emerald-100/80 blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">
                      {copy.assetsTitle}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                      RM {formatCurrency(hardcodedPortfolio.total)}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {copy.assetsDescription}
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-slate-200 bg-white/85 p-3 shadow-[0_16px_36px_rgba(15,23,42,0.08)]">
                    <Coins className="h-7 w-7 text-emerald-700" />
                  </div>
                </div>

                <div className="mt-6 rounded-[1.7rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_48px_rgba(15,23,42,0.22)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                    {copy.liveValueLabel}
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-[-0.05em]">
                    RM {formatCurrency(hardcodedPortfolio.total)}
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <SummaryStat
                      icon={<Wallet className="h-4 w-4" />}
                      label={copy.walletsCountLabel}
                      value={String(wallets.length)}
                    />
                    <SummaryStat
                      icon={<Landmark className="h-4 w-4" />}
                      label={copy.chainsCountLabel}
                      value={String(trackedChainsCount)}
                    />
                  </div>
                </div>

                <div
                  className={`mt-5 rounded-[1.7rem] border p-5 ${
                    zakatDue
                      ? 'border-emerald-200 bg-emerald-50'
                      : 'border-amber-200 bg-amber-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <BadgeCheck
                      className={`mt-0.5 h-5 w-5 ${
                        zakatDue ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        {copy.zakatStatusLabel}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">
                        {zakatDue ? copy.zakatDue : copy.zakatNotDue}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {zakatDue
                          ? copy.zakatDescriptionDue
                          : copy.zakatDescriptionNotDue}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    label={copy.zakatEstimateLabel}
                    value={`RM ${formatCurrency(hardcodedPortfolio.zakatEstimate)}`}
                  />
                  <MetricCard
                    label={copy.nisabLabel}
                    value={`RM ${formatCurrency(hardcodedPortfolio.nisab)}`}
                  />
                </div>

                <div className="mt-5 rounded-[1.7rem] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-semibold text-slate-950">
                    {copy.breakdownTitle}
                  </p>

                  <div className="mt-4 space-y-3">
                    {copy.breakdown.map((item) => (
                      <div
                        className="flex items-center justify-between rounded-[1rem] bg-slate-50 px-4 py-3 text-sm"
                        key={item.label}
                      >
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-semibold text-slate-950">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </motion.div>
        </motion.section>
      </div>
    </main>
  )
}

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-[1.2rem] border border-white/12 bg-white/8 p-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-300">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
        {value}
      </p>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white/85 p-4 shadow-[0_14px_28px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
        {value}
      </p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-MY', {
    maximumFractionDigits: 0,
  }).format(value)
}
