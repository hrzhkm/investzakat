import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="relative min-h-[calc(100vh-6.5rem)] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(191,219,254,0.75),_transparent_24%),radial-gradient(circle_at_50%_120%,_rgba(167,243,208,0.5),_transparent_32%),linear-gradient(180deg,_#f9fbff_0%,_#e8eef8_52%,_#dde7f3_100%)]" />
      <div className="absolute left-1/2 top-[-8rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute right-[-5rem] top-24 h-52 w-52 rounded-full bg-sky-200/45 blur-3xl" />
      <div className="absolute bottom-[-4rem] left-16 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" />
    </main>
  )
}
