import { createFileRoute } from '@tanstack/react-router'

const COINGECKO_XAUT_URL = 'https://api.coingecko.com/api/v3/coins/tether-gold'

export const Route = createFileRoute('/api/gold')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const apiKey = process.env.VITE_COINGECKO_API_KEY
          const endpoint = new URL(COINGECKO_XAUT_URL)

          if (apiKey) {
            endpoint.searchParams.set('x_cg_demo_api_key', apiKey)
          }

          const upstreamResponse = await fetch(endpoint, {
            headers: {
              accept: 'application/json',
            },
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

          const { createGoldData } = await import('#/lib/server/goldData')
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
