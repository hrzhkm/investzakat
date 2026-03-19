import { fileURLToPath } from 'node:url'

type MarketDataHealthResponse = {
  ok?: boolean
  error?: string
  cryptoPrices?: {
    ethereumMyr?: number
    solanaMyr?: number
  }
  nisab?: {
    fetchedAt?: string
    nisabMyr?: number
    priceMyrPerGram?: number
  }
}

const maxRetries = 5
const retryDelayMs = 2_000
const requestTimeoutMs = 15_000

function getBaseUrl() {
  const arg = process.argv[2]
  const envUrl = process.env.DEPLOY_VERIFY_URL
  const baseUrl = arg || envUrl || 'http://127.0.0.1:3000'

  return baseUrl.replace(/\/$/, '')
}

function assertFinitePositiveNumber(value: unknown, fieldName: string) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} is invalid: ${String(value)}`)
  }
}

export function assertHealthyMarketData(payload: MarketDataHealthResponse) {
  if (!payload.ok) {
    throw new Error(payload.error || 'Market-data health endpoint returned ok=false.')
  }

  assertFinitePositiveNumber(
    payload.cryptoPrices?.ethereumMyr,
    'cryptoPrices.ethereumMyr',
  )
  assertFinitePositiveNumber(
    payload.cryptoPrices?.solanaMyr,
    'cryptoPrices.solanaMyr',
  )
  assertFinitePositiveNumber(payload.nisab?.nisabMyr, 'nisab.nisabMyr')
  assertFinitePositiveNumber(
    payload.nisab?.priceMyrPerGram,
    'nisab.priceMyrPerGram',
  )

  if (!payload.nisab?.fetchedAt) {
    throw new Error('nisab.fetchedAt is missing.')
  }

  if (Number.isNaN(Date.parse(payload.nisab.fetchedAt))) {
    throw new Error(`nisab.fetchedAt is invalid: ${payload.nisab.fetchedAt}`)
  }
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

export async function verifyDeployment() {
  const baseUrl = getBaseUrl()
  const endpoint = `${baseUrl}/api/health/market-data`

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: ${endpoint}`)

      const response = await fetch(endpoint, {
        headers: {
          accept: 'application/json',
        },
        signal: AbortSignal.timeout(requestTimeoutMs),
      })

      const payload = (await response.json()) as MarketDataHealthResponse

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${payload.error || response.statusText}`,
        )
      }

      assertHealthyMarketData(payload)

      console.log(JSON.stringify(payload, null, 2))
      console.log('Deployment verification passed.')
      return
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown verification error.'

      console.error(`Attempt ${attempt} failed: ${message}`)

      if (attempt === maxRetries) {
        process.exitCode = 1
        return
      }

      await sleep(retryDelayMs)
    }
  }
}

const isMainModule =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === process.argv[1]

if (isMainModule) {
  await verifyDeployment()
}
