import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import contentCollections from '@content-collections/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig(({ isSsrBuild }) => ({
  resolve: {
    alias: isSsrBuild
      ? {
          buffer: 'node:buffer',
          'node:buffer': 'node:buffer',
        }
      : {
          buffer: 'buffer',
          'node:buffer': 'buffer',
        },
  },
  define: {
    global: 'globalThis',
  },
  plugins: [
    devtools(),
    nitro(),
    contentCollections(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
}))
