import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import tsconfigPaths from 'vite-tsconfig-paths'

const ReactCompilerConfig = {
  /* ... */
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    babel({
      filter: /\.[jt]sx?$/,
      babelConfig: {
        presets: ['@babel/preset-typescript'], // if you use TypeScript
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    tsconfigPaths(),
  ],
  ssr: {
    noExternal: [
      '@infinityloop.labs/common',
      '@infinityloop.labs/event-bus',
      '@infinityloop.labs/ui-kit',
      '@infinityloop.labs/utils',
      '@infinityloop.labs/routing',
      '@infinityloop.labs/fronted-core',
    ],
  },
})
