import type { Language } from '../lib/i18n'
import { en } from './en'
import { ms } from './ms'

const translations = {
  ms,
  en,
} as const

export function getTranslations(language: Language) {
  return translations[language]
}
