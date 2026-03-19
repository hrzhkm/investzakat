import type { AppTranslations } from './type'

export const en: AppTranslations = {
  home: {
    heroTitle: 'Calculate Zakat for Your Investments — Instantly',
    heroDescription:
      'A clearer starting point for your zakat flow, with a clean visual focus and room for the calculator experience underneath.',
    visualTitle: 'Primary visual space',
    visualDescription:
      'A calculator preview, product illustration, or supporting visual can live here.',
    usageEyebrow: 'How It Works',
    usageTitle: 'Three simple steps to start calculating your investment zakat',
    usageDescription:
      'Keep the flow clear so users understand what to do from the first input through the final estimate.',
    placeholder: 'Placeholder visual',
    steps: [
      {
        step: 'Step 01',
        title: 'Enter your investment details',
        description:
          'Fill in your savings or investment amount so the calculation starts with a clear figure.',
      },
      {
        step: 'Step 02',
        title: 'Check zakat eligibility',
        description:
          'Compare your total against core conditions such as nisab and the relevant holding period.',
      },
      {
        step: 'Step 03',
        title: 'Review the final estimate',
        description:
          'Get a readable zakat estimate before moving on to the next action.',
      },
    ],
  },
  calculator: {
    eyebrow: 'Wallet Tracker',
    title: 'Zakat Crypto',
    description:
      'Enter a Solana or Ethereum address first. If Ethereum is selected, mark the extra networks you want tracked for portfolio and zakat calculations.',
    errorPrefix: 'Error',
    inputLabel: 'Wallet Address',
    inputPlaceholder: 'Paste your wallet address here',
    networkLabel: 'Network',
    networkDescription:
      'Choose the base network before saving the address into the watchlist.',
    addWalletDescription: 'WalletDescription',
    solanaValidationError: 'Enter a valid Solana address.',
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
      'This total is calculated from live native wallet balances using current ETH and SOL prices in MYR.',
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
    nisabUnavailable: 'Nisab data is unavailable.',
    walletsCountLabel: 'Tracked wallets',
    chainsCountLabel: 'Active networks',
    nativeBalancesLabel: 'Balances',
    balanceLoading: 'Fetching live balance...',
    balanceUnavailable: 'Unavailable',
    breakdownTitle: 'Asset breakdown',
    distributionTitle: 'Asset distribution',
    breakdown: [],
    solana: 'Solana',
    ethereum: 'Ethereum',
    chainLabels: {
      ethereum: 'Ethereum Mainnet',
      base: 'Base',
      arbitrum: 'Arbitrum',
      optimism: 'Optimism',
    },
  },
  languageSwitcher: {
    action: 'Change language',
    title: 'Language',
  },
  header: {
    calculator: 'Crypto',
    comingSoon: 'Feature coming soon',
    errorPrefix: 'Error',
    nisab: 'Nisab',
    nisabUnavailable: 'Nisab data is unavailable.',
    stocks: 'Stocks',
    wallet: 'Connect Wallet',
  },
}
