import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import { Link } from '@tanstack/react-router'

const hasDynamicEnvironmentId = Boolean(
  import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
)

export default function Header() {
  return (
    <header className="relative z-50 px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/30 px-4 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-black/5 backdrop-blur-2xl sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.4rem] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.38))] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_30px_rgba(148,163,184,0.22)]">
              <div className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#86efac_38%,#38bdf8_78%,#0f172a_120%)] shadow-[0_0_18px_rgba(56,189,248,0.35)]" />
            </div>

            <Link
              to="/"
              className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-950 no-underline sm:text-xl"
            >
              investzakat
            </Link>
          </div>

          <WalletAction />
        </nav>
      </div>
    </header>
  )
}

function WalletAction() {
  const buttonClassName =
    'inline-flex h-11 min-w-[10rem] items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.52))] px-5 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_30px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_18px_36px_rgba(15,23,42,0.16)] active:translate-y-0'

  if (!hasDynamicEnvironmentId) {
    return (
      <button
        className={`${buttonClassName} opacity-70`}
        disabled
        type="button"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <DynamicConnectButton
      buttonClassName={buttonClassName}
      buttonContainerClassName="contents"
    >
      Connect Wallet
    </DynamicConnectButton>
  )
}
