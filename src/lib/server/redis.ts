import Redis from 'ioredis'

let redisClient: Redis | null | undefined

export function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient
  }

  const redisUrl = process.env.REDIS_URL

  if (!redisUrl) {
    redisClient = null
    return redisClient
  }

  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  })

  redisClient.on('error', () => {
    // Fail closed and let callers fall back to upstream fetches.
  })

  return redisClient
}
