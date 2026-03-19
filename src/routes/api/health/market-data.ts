import { createFileRoute } from '@tanstack/react-router'
import { resolveCryptoPrices } from '#/lib/crypto/getCryptoPrices'
import { resolveLatestNisab } from '#/lib/getLatestNisab'

export const Route = createFileRoute('/api/health/market-data')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [cryptoPrices, nisab] = await Promise.all([
            resolveCryptoPrices(),
            resolveLatestNisab(),
          ])

          if (!nisab) {
            return Response.json(
              {
                ok: false,
                error: 'Nisab data is unavailable.',
              },
              { status: 503 },
            )
          }

          return Response.json(
            {
              ok: true,
              cryptoPrices,
              nisab,
            },
            {
              headers: {
                'Cache-Control': 'no-store',
              },
            },
          )
        } catch (error) {
          return Response.json(
            {
              ok: false,
              error:
                error instanceof Error ? error.message : 'Unknown server error.',
            },
            { status: 503 },
          )
        }
      },
    },
  },
})
