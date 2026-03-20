import { motion } from 'framer-motion'
import { createFileRoute } from '@tanstack/react-router'
import { useLanguage } from '../lib/i18n'
import { getTranslations } from '../translations'

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

const stepImagePaths = [
  '/images/step-1.png',
  '/images/step-2.png',
  '/images/step-3.png',
]
const SHARLIFE_ZAKAT_URL = 'https://sharlife.my/zakat-asset-digital'

function HomePage() {
  const { language } = useLanguage()
  const copy = getTranslations(language).home

  return (
    <main className="min-h-[calc(100vh-6.75rem)] px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.section
          animate="visible"
          className="flex flex-col items-center"
          initial="hidden"
          variants={containerVariants}
        >
          <motion.div className="max-w-3xl text-center" variants={itemVariants}>
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-slate-500">
              InvestZakat
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              {copy.heroDescription}
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

              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <motion.img
                  alt={copy.visualTitle}
                  animate={{
                    y: [0, -8, 0],
                    scale: [1.035, 1.035, 1.035],
                  }}
                  className="block h-auto w-full origin-center will-change-transform"
                  src="/images/calculator.png"
                  transition={{
                    duration: 5.5,
                    ease: 'easeInOut',
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          className="relative mt-16"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, amount: 0.2 }}
          whileInView="visible"
        >
          <div className="pointer-events-none absolute left-0 top-12 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-100/70 blur-3xl" />

          <motion.div className="relative" variants={itemVariants}>
            <div className="overflow-hidden rounded-[2.75rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(244,248,252,0.9))] px-5 py-7 shadow-[0_30px_90px_rgba(15,23,42,0.1)] ring-1 ring-slate-200/70 backdrop-blur-sm sm:px-7 sm:py-8 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">
                  {copy.usageEyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                  {copy.usageTitle}
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  {copy.usageDescription}
                </p>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {copy.steps.map((step, index) => (
                <motion.article
                  className={`relative flex h-full flex-col overflow-hidden rounded-[2.2rem] border p-5 shadow-[0_24px_60px_rgba(15,23,42,0.09)] ring-1 backdrop-blur-sm ${
                    index === copy.steps.length - 1
                      ? 'border-emerald-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(238,252,245,0.92))] ring-emerald-100/80'
                      : 'border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,249,252,0.92))] ring-slate-200/70'
                  }`}
                  key={step.step}
                  transition={{
                    duration: 0.95,
                    delay: index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  variants={itemVariants}
                >
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-20 rounded-b-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_72%)]" />
                  <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200/90 bg-[linear-gradient(180deg,#ffffff,#f6f9fc)] p-3 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
                    <div className="pointer-events-none absolute inset-x-5 top-0 h-16 rounded-b-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_72%)]" />
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.3rem] border border-slate-200/80 bg-white">
                    <img
                      alt={step.title}
                      className={`block h-full w-full object-cover ${
                        index === 1 ? 'object-left-top' : 'object-top'
                      }`}
                      src={stepImagePaths[index] ?? stepImagePaths.at(-1)}
                    />
                    </div>
                  </div>

                  <div className="relative mt-5 flex flex-1 flex-col">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-950 px-3 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                        {step.step}
                      </p>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                      {step.description}
                    </p>

                    {index === copy.steps.length - 1 ? (
                      <a
                        className="mt-6 inline-flex h-12 items-center justify-center rounded-xl border border-emerald-700 bg-emerald-600 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(5,150,105,0.18)] transition hover:bg-emerald-700"
                        href={SHARLIFE_ZAKAT_URL}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Pay Zakat
                      </a>
                    ) : null}
                  </div>
                </motion.article>
              ))}
              </div>
            </div>
          </motion.div>
        </motion.section>
      </div>
    </main>
  )
}
