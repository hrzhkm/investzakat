const MAX_ERROR_LENGTH = 140

export function getDisplayErrorMessage(error: unknown, fallback: string) {
  const message =
    error instanceof Error
      ? error.message.trim()
      : typeof error === 'string'
        ? error.trim()
        : ''

  if (!message) {
    return fallback
  }

  const normalizedMessage = message.replace(/^Error:\s*/i, '')

  if (normalizedMessage.length <= MAX_ERROR_LENGTH) {
    return normalizedMessage
  }

  return `${normalizedMessage.slice(0, MAX_ERROR_LENGTH - 3)}...`
}
