import { motion } from 'framer-motion'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.22,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 38,
    scale: 0.985,
    filter: 'blur(14px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

function HomePage() {
  return (
    <main className="min-h-[calc(100vh-6.75rem)] px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <motion.section
        animate="visible"
        className="mx-auto flex max-w-6xl flex-col items-center"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.div
          className="max-w-3xl text-center"
          variants={itemVariants}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.42em] text-slate-500">
            InvestZakat
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            Calculate Your Investment Zakat Effortlessly
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            A simpler starting point for your zakat flow, with a clean visual
            focus and room for the calculator experience underneath.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 w-full max-w-5xl"
          variants={itemVariants}
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-slate-900/85 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.82))] px-6 py-8 shadow-[0_26px_90px_rgba(15,23,42,0.14)] sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_72%)]" />
            <div className="pointer-events-none absolute left-10 top-10 h-20 w-20 rounded-full bg-emerald-100/80 blur-2xl" />
            <div className="pointer-events-none absolute bottom-8 right-10 h-24 w-24 rounded-full bg-sky-100/80 blur-2xl" />

            <div className="relative flex min-h-[18rem] items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/65 sm:min-h-[24rem] lg:min-h-[27rem]">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                className="flex flex-col items-center gap-4 text-center"
                transition={{
                  duration: 5.5,
                  ease: 'easeInOut',
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff,#eef4ff)] shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                  <div className="grid h-9 w-9 grid-cols-2 gap-1">
                    <span className="rounded-sm bg-emerald-300" />
                    <span className="rounded-sm bg-sky-300" />
                    <span className="rounded-sm bg-amber-200" />
                    <span className="rounded-sm bg-slate-300" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:text-2xl">
                    Image Placeholder
                  </p>
                  <p className="mt-2 text-sm text-slate-500 sm:text-base">
                    Future product visual, calculator preview, or illustration.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </main>
  )
}
