import fs from 'fs';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import clear from 'rollup-plugin-clear';
import typescript from 'rollup-plugin-typescript2';
import vue from 'rollup-plugin-vue';
import autoprefixer from 'autoprefixer';

const packageName = 'btblab-vue-list';

if (!fs.existsSync('umd')) {
  fs.mkdirSync('umd')
}
if (!fs.existsSync('lib')) {
  fs.mkdirSync('lib')
}
if (!fs.existsSync('esm')) {
  fs.mkdirSync('esm')
}

export default {
  input: path.resolve('src', 'index.ts'),
  output: [
    {
      exports: 'named',
      globals: {
        vue: 'Vue'
      },
      format: 'umd',
      name: packageName,
      file: path.resolve('umd', `index.js`),
      sourcemap: false
    },
    // COMMON
    {
      exports: 'named',
      format: 'cjs',
      name: packageName,
      file: path.resolve('lib', `index.js`),
      sourcemap: false
    },
    // ES
    {
      exports: 'named',
      globals: {
        vue: 'Vue'
      },
      format: 'esm',
      name: packageName,
      file: path.resolve('esm', `index.js`),
      sourcemap: false
    }
  ],
  external: ['vue'],
  plugins: [
    clear({
      targets: ['umd', 'lib', 'esm']
    }),
    nodeResolve({
      mainFields: ['module', 'jsnext', 'main'],
      extensions: ['.vue', 'ts']
    }),
    typescript(),
    vue({
      include: /\.vue$/,
    }),
    postcss({
      plugins: [
        autoprefixer()
      ],
      minimize: true,
      sourceMap: true,
      extract: true,
    }),
    commonjs(),
    terser()
  ]
}