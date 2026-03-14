export type EthereumChain = 'ethereum' | 'base' | 'arbitrum' | 'optimism'

export type HomeStepTranslation = {
  step: string
  title: string
  description: string
}

export type HomeTranslations = {
  heroTitle: string
  heroDescription: string
  visualTitle: string
  visualDescription: string
  usageEyebrow: string
  usageTitle: string
  usageDescription: string
  placeholder: string
  steps: HomeStepTranslation[]
}

export type CalculatorBreakdownItem = {
  label: string
  value: string
}

export type CalculatorTranslations = {
  eyebrow: string
  title: string
  description: string
  inputLabel: string
  inputPlaceholder: string
  networkLabel: string
  networkDescription: string
  solanaValidationError: string
  ethereumValidationError: string
  chainsLabel: string
  chainsDescription: string
  addWallet: string
  trackedTitle: string
  trackedDescription: string
  emptyState: string
  assetsTitle: string
  assetsDescription: string
  liveValueLabel: string
  zakatStatusLabel: string
  zakatDue: string
  zakatNotDue: string
  zakatDescriptionDue: string
  zakatDescriptionNotDue: string
  zakatEstimateLabel: string
  nisabLabel: string
  walletsCountLabel: string
  chainsCountLabel: string
  breakdownTitle: string
  breakdown: CalculatorBreakdownItem[]
  solana: string
  ethereum: string
  chainLabels: Record<EthereumChain, string>
}

export type LanguageSwitcherTranslations = {
  action: string
  title: string
}

export type HeaderTranslations = {
  calculator: string
  nisab: string
  wallet: string
}

export type AppTranslations = {
  home: HomeTranslations
  calculator: CalculatorTranslations
  languageSwitcher: LanguageSwitcherTranslations
  header: HeaderTranslations
}
