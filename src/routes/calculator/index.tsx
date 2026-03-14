import { useState, type FormEvent } from 'react'
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
import { validateEthereumAddress } from '../../lib/crypto/validateEthereumAddress'
import { useLanguage } from '../../lib/i18n'

export const Route = createFileRoute('/calculator/')({
  component: CalculatorPage,
})

type Network = 'solana' | 'ethereum'
type EthereumChain = 'ethereum' | 'base' | 'arbitrum' | 'optimism'

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

const calculatorCopy = {
  ms: {
    eyebrow: 'Penjejak Wallet',
    title: 'Mulakan dengan alamat wallet anda',
    description:
      'Masukkan alamat Solana atau Ethereum terlebih dahulu. Jika Ethereum dipilih, tandakan rangkaian tambahan yang anda mahu jejaki untuk portfolio dan zakat.',
    inputLabel: 'Alamat Wallet',
    inputPlaceholder: 'Tampal alamat wallet anda di sini',
    networkLabel: 'Network',
    networkDescription:
      'Buat pilihan rangkaian asas sebelum alamat disimpan ke senarai pemantauan.',
    ethereumValidationError: 'Masukkan alamat Ethereum yang sah.',
    chainsLabel: 'Ethereum Networks To Track',
    chainsDescription:
      'Ethereum mempunyai beberapa L2. Pilih rangkaian yang perlu dipantau bersama alamat ini.',
    addWallet: 'Tambah Wallet',
    trackedTitle: 'Wallet Dipantau',
    trackedDescription:
      'Senarai ini akan digunakan kemudian untuk sambungan data aset sebenar.',
    emptyState: 'Belum ada wallet ditambah.',
    assetsTitle: 'Nilai Aset',
    assetsDescription:
      'Nilai ini masih hardcoded buat masa sekarang untuk memuktamadkan UI.',
    liveValueLabel: 'Nilai semasa portfolio',
    zakatStatusLabel: 'Status zakat',
    zakatDue: 'Perlu bayar zakat',
    zakatNotDue: 'Belum perlu bayar zakat',
    zakatDescriptionDue:
      'Jumlah aset anda melepasi anggaran nisab, jadi zakat pelaburan perlu dibayar.',
    zakatDescriptionNotDue:
      'Jumlah aset anda masih di bawah anggaran nisab semasa.',
    zakatEstimateLabel: 'Anggaran zakat 2.5%',
    nisabLabel: 'Anggaran nisab',
    walletsCountLabel: 'Wallet dipantau',
    chainsCountLabel: 'Network aktif',
    breakdownTitle: 'Pecahan aset',
    breakdown: [
      { label: 'Token utama', value: 'RM 96,400' },
      { label: 'Stablecoins', value: 'RM 31,250' },
      { label: 'Yield / staking', value: 'RM 18,950' },
    ],
    solana: 'Solana',
    ethereum: 'Ethereum',
    chainLabels: {
      ethereum: 'Ethereum Mainnet',
      base: 'Base',
      arbitrum: 'Arbitrum',
      optimism: 'Optimism',
    },
  },
  en: {
    eyebrow: 'Wallet Tracker',
    title: 'Start with your wallet address',
    description:
      'Enter a Solana or Ethereum address first. If Ethereum is selected, mark the extra networks you want tracked for portfolio and zakat calculations.',
    inputLabel: 'Wallet Address',
    inputPlaceholder: 'Paste your wallet address here',
    networkLabel: 'Network',
    networkDescription:
      'Choose the base network before saving the address into the watchlist.',
    ethereumValidationError: 'Enter a valid Ethereum address.',
    chainsLabel: 'Ethereum Networks To Track',
    chainsDescription:
      'Ethereum spans multiple L2s. Select the networks that should be tracked with this address.',
    addWallet: 'Add Wallet',
    trackedTitle: 'Tracked Wallets',
    trackedDescription:
      'This list will feed the real asset data connection in the next step.',
    emptyState: 'No wallet has been added yet.',
    assetsTitle: 'Assets Value',
    assetsDescription:
      'These values are hardcoded for now so the UI can be finalized first.',
    liveValueLabel: 'Current portfolio value',
    zakatStatusLabel: 'Zakat status',
    zakatDue: 'Zakat payment required',
    zakatNotDue: 'Zakat payment not required yet',
    zakatDescriptionDue:
      'Your asset value is above the current nisab estimate, so investment zakat is payable.',
    zakatDescriptionNotDue:
      'Your asset value is still below the current nisab estimate.',
    zakatEstimateLabel: '2.5% zakat estimate',
    nisabLabel: 'Estimated nisab',
    walletsCountLabel: 'Tracked wallets',
    chainsCountLabel: 'Active networks',
    breakdownTitle: 'Asset breakdown',
    breakdown: [
      { label: 'Core tokens', value: 'RM 96,400' },
      { label: 'Stablecoins', value: 'RM 31,250' },
      { label: 'Yield / staking', value: 'RM 18,950' },
    ],
    solana: 'Solana',
    ethereum: 'Ethereum',
    chainLabels: {
      ethereum: 'Ethereum Mainnet',
      base: 'Base',
      arbitrum: 'Arbitrum',
      optimism: 'Optimism',
    },
  },
} as const

const hardcodedPortfolio = {
  total: 146_600,
  nisab: 28_000,
  zakatEstimate: 3_665,
}

function CalculatorPage() {
  const { language } = useLanguage()
  const copy = calculatorCopy[language]
  const [address, setAddress] = useState('')
  const [network, setNetwork] = useState<Network>('solana')
  const [selectedChains, setSelectedChains] = useState<EthereumChain[]>([
    'ethereum',
    'base',
  ])
  const [wallets, setWallets] = useState<WalletEntry[]>([])
  const [addressError, setAddressError] = useState<string | null>(null)

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

    if (
      network === 'ethereum' &&
      !validateEthereumAddress(trimmedAddress)
    ) {
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

                <form
                  className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_40px_rgba(15,23,42,0.06)] sm:p-5"
                  onSubmit={handleSubmit}
                >
                  <label className="block text-sm font-semibold text-slate-700">
                    {copy.inputLabel}
                  </label>

                  <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
                    <input
                      className="h-14 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
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

                    <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-1">
                      <div className="grid h-full grid-cols-2 gap-1">
                        <NetworkButton
                          active={network === 'solana'}
                          label={copy.solana}
                          onClick={() => {
                            setNetwork('solana')
                            setAddressError(null)
                          }}
                        />
                        <NetworkButton
                          active={network === 'ethereum'}
                          label={copy.ethereum}
                          onClick={() => {
                            setNetwork('ethereum')
                            setAddressError(null)
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className="inline-flex h-14 items-center justify-center gap-2 rounded-[1.25rem] border border-slate-950 bg-slate-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                      disabled={!address.trim()}
                      type="submit"
                    >
                      <Plus className="h-4 w-4" />
                      {copy.addWallet}
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 sm:text-sm">
                    <span className="font-semibold uppercase tracking-[0.22em] text-slate-400">
                      {copy.networkLabel}
                    </span>
                    <span>{copy.networkDescription}</span>
                  </div>

                  {addressError ? (
                    <p className="mt-3 text-sm font-medium text-rose-600">
                      {addressError}
                    </p>
                  ) : null}

                  {network === 'ethereum' ? (
                    <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff,#f4f7fb)] p-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-sky-700" />
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            {copy.chainsLabel}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {copy.chainsDescription}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {ethereumChainOptions.map((chain) => {
                          const checked = selectedChains.includes(chain)

                          return (
                            <label
                              className={`flex cursor-pointer items-center justify-between rounded-[1.2rem] border px-4 py-3 text-sm transition ${
                                checked
                                  ? 'border-slate-950 bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)]'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
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
                  ) : null}
                </form>

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
                                  : copy.chainLabels[chain]}
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

function NetworkButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={`rounded-[0.95rem] px-4 py-3 text-sm font-semibold transition ${
        active
          ? 'bg-white text-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
          : 'text-slate-500 hover:text-slate-900'
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
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
