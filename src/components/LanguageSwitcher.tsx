import { Languages } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { getLanguageLabel, useLanguage } from '../lib/i18n'
import type { Language } from '../lib/i18n'
import { getTranslations } from '../translations'

const supportedLanguages: Language[] = ['ms', 'en']

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const menuId = useId()
  const copy = getTranslations(language).languageSwitcher

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7"
      ref={containerRef}
    >
      {isOpen ? (
        <div
          className="w-[14rem] rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.92))] p-3 shadow-[0_22px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80 backdrop-blur-xl"
          id={menuId}
          role="menu"
        >
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            {copy.title}
          </p>
          <div className="mt-3 grid gap-2">
            {supportedLanguages.map((item) => {
              const isActive = item === language

              return (
                <button
                  aria-pressed={isActive}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-[0_14px_28px_rgba(15,23,42,0.22)]'
                      : 'border-slate-200 bg-white/80 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                  key={item}
                  onClick={() => {
                    setLanguage(item)
                    setIsOpen(false)
                  }}
                  role="menuitemradio"
                  type="button"
                >
                  <span>{getLanguageLabel(item)}</span>
                  <span className="text-xs uppercase tracking-[0.24em] opacity-75">
                    {item}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <button
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={copy.action}
        className="inline-flex items-center gap-3 rounded-full border border-slate-900/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(30,41,59,0.92))] px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_55px_rgba(15,23,42,0.28)]"
        onClick={() => {
          setIsOpen((current) => !current)
        }}
        type="button"
      >
        <Languages className="h-4 w-4" />
        <span>{getLanguageLabel(language)}</span>
      </button>
    </div>
  )
}
