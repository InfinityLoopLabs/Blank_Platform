import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 4010,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@infinityloop.labs/fronted-core',
      formats: ['es', 'umd'],
      fileName: format => `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@reduxjs/toolkit',
        '@infinityloop.labs/event-bus',
        '@infinityloop.labs/routing',
        '@infinityloop.labs/utils',
        'react-router',
        'react-redux',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@reduxjs/toolkit': 'ReduxToolkit',
          '@infinityloop.labs/event-bus': 'InfinityloopLabsEventBus',
          '@infinityloop.labs/routing': 'InfinityloopLabsRouting',
          '@infinityloop.labs/utils': 'InfinityloopLabsUtils',
          'react-router': 'ReactRouter',
          'react-redux': 'ReactRedux',
        },
      },
    },
  },
})
