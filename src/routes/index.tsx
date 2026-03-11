import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return <main className="min-h-[calc(100vh-6.75rem)]" />
}
