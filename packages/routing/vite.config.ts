/// <reference types="vitest" />
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    threads: false,
    setupFiles: ['./vitest-setup.ts'],
  },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //     '@assets': path.resolve(__dirname, './src/assets'),
  //   },
  // },
  plugins: [
    // поддержка синтаксиса React (JSX и прочее)
    react({}),
    // генерация файла `index.d.ts`
    dts({
      insertTypesEntry: true,
    }),
  ],
  server: {
    host: '0.0.0.0',
    // port: 4002,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@infinityloop.labs/routing',
      formats: ['es', 'umd'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom',"react-router"],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router': 'react-router',
        },
      },
    },
  },
})

