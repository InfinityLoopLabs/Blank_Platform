import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { dts } from 'rollup-plugin-dts';

const external = [
  '@qdrant/js-client-rest',
  '@clickhouse/client',
  '@nestjs/common',
  '@nestjs/core',
  '@nestjs/microservices',
  'cassandra-driver',
  'ioredis',
  'minio',
  'neo4j-driver',
  'pg',
  'reflect-metadata',
  'rxjs',
  'rxjs/operators',
  'fs',
  'path',
  'stream',
  'crypto'
];

export default [
  {
    input: './src/index.ts',
    external,
    output: [
      {
        file: './dist/index.es.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: './dist/index.cjs',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ]
  },
  {
    input: './src/index.ts',
    output: [{ file: './dist/index.d.ts', format: 'es' }],
    plugins: [dts()]
  }
];
