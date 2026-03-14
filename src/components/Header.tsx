import {
  DynamicConnectButton,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core'
import { Link } from '@tanstack/react-router'
import { useLanguage } from '../lib/i18n'
import { getTranslations } from '../translations'

const hasDynamicEnvironmentId = Boolean(
  import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
)

export default function Header() {
  const { language } = useLanguage()
  const copy = getTranslations(language).header

  return (
    <header className="relative z-20 px-4 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-white/30 backdrop-blur-[24px] supports-[backdrop-filter]:backdrop-saturate-150 sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[1.2rem] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.38))] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_30px_rgba(148,163,184,0.22)]">
              <div className="h-5 w-5 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#86efac_38%,#38bdf8_78%,#0f172a_120%)] shadow-[0_0_18px_rgba(56,189,248,0.35)]" />
            </div>

            <Link
              to="/"
              className="truncate text-base font-semibold tracking-[-0.03em] text-slate-950 no-underline sm:text-lg"
            >
              investzakat
            </Link>
          </div>

          <WalletAction label={copy.wallet} />
        </nav>
      </div>
    </header>
  )
}

function WalletAction({ label }: { label: string }) {
  const buttonClassName =
    'inline-flex h-10 min-w-[9.5rem] items-center justify-center rounded-full border border-white/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.18))] px-5 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_30px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,255,255,0.24))] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.62),0_18px_36px_rgba(15,23,42,0.16)] active:translate-y-0'

  if (!hasDynamicEnvironmentId) {
    return (
      <button
        className={`${buttonClassName} opacity-70`}
        disabled
        type="button"
      >
        {label}
      </button>
    )
  }

  return (
    <ConnectedWalletAction buttonClassName={buttonClassName} label={label} />
  )
}

function ConnectedWalletAction({
  buttonClassName,
  label,
}: {
  buttonClassName: string
  label: string
}) {
  const { primaryWallet } = useDynamicContext()
  const address = primaryWallet?.address
  const buttonLabel = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : label

  return (
    <DynamicConnectButton
      buttonClassName={buttonClassName}
      buttonContainerClassName="contents"
    >
      {buttonLabel}
    </DynamicConnectButton>
  )
}
