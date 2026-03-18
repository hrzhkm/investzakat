import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/fetchCoins')({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          {
            error: 'Not implemented.',
          },
          { status: 501 },
        ),
    },
  },
})
