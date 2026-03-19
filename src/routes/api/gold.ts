import { createFileRoute } from '@tanstack/react-router'
import { applyCoinGeckoApiKey } from '#/lib/server/coingecko'

const COINGECKO_XAUT_URL = 'https://api.coingecko.com/api/v3/coins/tether-gold'

export const Route = createFileRoute('/api/gold')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { createGoldData, getLatestGoldDataForToday } = await import(
            '#/lib/server/goldData'
          )
          const existingGoldData = await getLatestGoldDataForToday()

          if (existingGoldData) {
            return Response.json(
              {
                id: existingGoldData.id,
                asset: existingGoldData.asset,
                currency: existingGoldData.currency,
                priceMyr: existingGoldData.priceMyr,
                fetchedAt: existingGoldData.fetchedAt,
                createdAt: existingGoldData.createdAt,
              },
              {
                headers: {
                  'Cache-Control':
                    'public, s-maxage=60, stale-while-revalidate=300',
                },
              },
            )
          }

          const endpoint = new URL(COINGECKO_XAUT_URL)
          const headers = {
            accept: 'application/json',
          }

          applyCoinGeckoApiKey(endpoint, headers)

          const upstreamResponse = await fetch(endpoint, {
            headers,
            signal: AbortSignal.timeout(10_000),
          })

          if (!upstreamResponse.ok) {
            const errorText = await upstreamResponse.text()

            return Response.json(
              {
                error: 'Failed to fetch XAUT from CoinGecko.',
                status: upstreamResponse.status,
                details: errorText || upstreamResponse.statusText,
              },
              { status: upstreamResponse.status },
            )
          }

          const data = await upstreamResponse.json()
          const priceMyr = data?.market_data?.current_price?.myr

          if (typeof priceMyr !== 'number' || Number.isNaN(priceMyr)) {
            return Response.json(
              {
                error: 'CoinGecko response does not contain a valid MYR price.',
              },
              { status: 502 },
            )
          }

          const savedGoldData = await createGoldData({
            priceMyr,
            rawData: data,
          })

          return Response.json(
            {
              id: savedGoldData.id,
              asset: savedGoldData.asset,
              currency: savedGoldData.currency,
              priceMyr: savedGoldData.priceMyr,
              fetchedAt: savedGoldData.fetchedAt,
              createdAt: savedGoldData.createdAt,
            },
            {
              headers: {
                'Cache-Control':
                  'public, s-maxage=60, stale-while-revalidate=300',
              },
            },
          )
        } catch (error) {
          return Response.json(
            {
              error: 'Failed to fetch or store gold data.',
              details:
                error instanceof Error ? error.message : 'Unknown server error.',
            },
            { status: 500 },
          )
        }
      },
    },
  },
})
