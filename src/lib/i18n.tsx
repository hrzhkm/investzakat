import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type Language = 'ms' | 'en'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
}

const STORAGE_KEY = 'investzakat-language'

const LANGUAGE_LABELS: Record<Language, string> = {
  ms: 'Bahasa Melayu',
  en: 'English',
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'ms'
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'en' || stored === 'ms' ? stored : 'ms'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ms')

  useEffect(() => {
    setLanguage(getStoredLanguage())
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
    }),
    [language],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return context
}

export function getLanguageLabel(language: Language) {
  return LANGUAGE_LABELS[language]
}
