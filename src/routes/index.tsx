import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

const hasDynamicEnvironmentId = Boolean(
  import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
)

function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef2f7] text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(191,219,254,0.75),_transparent_24%),radial-gradient(circle_at_50%_120%,_rgba(167,243,208,0.5),_transparent_32%),linear-gradient(180deg,_#f9fbff_0%,_#e8eef8_52%,_#dde7f3_100%)]" />
      <div className="absolute left-1/2 top-[-8rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-52 w-52 rounded-full bg-sky-200/45 blur-3xl" />
      <div className="absolute bottom-[-4rem] left-16 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex h-fit w-full items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/30 px-4 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-black/5 backdrop-blur-2xl sm:px-6">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.4rem] border border-white/80 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.38))] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_12px_30px_rgba(148,163,184,0.22)]">
              <div className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffffff,#86efac_38%,#38bdf8_78%,#0f172a_120%)] shadow-[0_0_18px_rgba(56,189,248,0.35)]" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:text-xl">
                investzakat
              </p>
            </div>
          </div>

          <WalletAction />
        </nav>
      </div>
    </main>
  )
}

function WalletAction() {
  const buttonClassName =
    'inline-flex h-11 items-center justify-center rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.52))] px-5 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_10px_30px_rgba(15,23,42,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_18px_36px_rgba(15,23,42,0.16)] active:translate-y-0'

  if (!hasDynamicEnvironmentId) {
    return (
      <button
        className={`${buttonClassName} min-w-[10rem] opacity-70`}
        disabled
        type="button"
      >
        Connect Wallet
      </button>
    )
  }

  return (
    <DynamicConnectButton
      buttonClassName={`${buttonClassName} min-w-[10rem]`}
      buttonContainerClassName="contents"
    >
      Connect Wallet
    </DynamicConnectButton>
  )
}
