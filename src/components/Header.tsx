import { Link } from '@tanstack/react-router'
import { useLanguage } from '../lib/i18n'
import { getTranslations } from '../translations'

export default function Header() {
  const { language } = useLanguage()
  const copy = getTranslations(language).header

  return (
    <header className="relative z-20 px-4 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center gap-5 rounded-[2rem] border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-white/30 backdrop-blur-[24px] supports-[backdrop-filter]:backdrop-saturate-150 sm:gap-7 sm:px-6">
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

          <Link
            to="/crypto"
            className="relative inline-flex shrink-0 text-sm font-medium text-slate-700 no-underline transition-colors duration-200 hover:text-slate-950 after:absolute after:bottom-[-0.2rem] after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100"
            activeProps={{
              className: 'text-slate-950 after:scale-x-100',
            }}
          >
            {copy.calculator}
          </Link>
        </nav>
      </div>
    </header>
  )
}
