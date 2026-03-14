import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import { DynamicProvider } from '../integrations/dynamic/provider'
import Header from '../components/Header'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { LanguageProvider, useLanguage } from '../lib/i18n'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'InvestZakat',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <RootDocumentFrame>{children}</RootDocumentFrame>
    </LanguageProvider>
  )
}

function RootDocumentFrame({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage()

  return (
    <html lang={language}>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen text-slate-950">
        <TanStackQueryProvider>
          <DynamicProvider>
            <div className="relative min-h-screen overflow-hidden bg-[#eef2f7]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.95),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(191,219,254,0.75),_transparent_24%),radial-gradient(circle_at_50%_120%,_rgba(167,243,208,0.5),_transparent_32%),linear-gradient(180deg,_#f9fbff_0%,_#e8eef8_52%,_#dde7f3_100%)]" />
              <div className="pointer-events-none absolute left-1/2 top-[-8rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
              <div className="pointer-events-none absolute right-[-5rem] top-24 h-52 w-52 rounded-full bg-sky-200/45 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[-4rem] left-16 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" />

              <div className="relative z-10 min-h-screen">
                <Header />
                {children}
                <LanguageSwitcher />
                <TanStackDevtools
                  config={{
                    position: 'bottom-left',
                  }}
                  plugins={[
                    {
                      name: 'Tanstack Router',
                      render: <TanStackRouterDevtoolsPanel />,
                    },
                    TanStackQueryDevtools,
                  ]}
                />
              </div>
            </div>
          </DynamicProvider>
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}
