import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { formatMyrCurrency } from '../lib/nisab'
import { latestNisabQueryOptions } from '../lib/queries/nisab'
import { useLanguage } from '../lib/i18n'
import { getTranslations } from '../translations'

export default function Header() {
  const { language } = useLanguage()
  const copy = getTranslations(language).header
  const { data: nisabData } = useQuery(latestNisabQueryOptions)
  const nisabValue = nisabData
    ? formatMyrCurrency(nisabData.nisabMyr)
    : 'RM...'

  return (
    <header className="relative z-20 px-4 pt-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between gap-5 rounded-[2rem] border border-white/45 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))] px-4 py-3 shadow-[0_24px_80px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-white/30 backdrop-blur-[24px] supports-[backdrop-filter]:backdrop-saturate-150 sm:gap-7 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="shrink-0 truncate text-base font-semibold tracking-[-0.03em] text-slate-950 no-underline sm:text-lg"
            >
              investzakat
            </Link>

            <p className="min-w-0 truncate text-xs font-medium text-slate-600 sm:text-sm">
              {copy.nisab} = {nisabValue}
            </p>
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
