import fs from 'fs'
import path from 'path'
import nodeResolve from 'rollup-plugin-node-resolve'
import nodeGlobals from 'rollup-plugin-node-globals'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import vue from 'rollup-plugin-vue'

import { packageName } from './package.json'

const baseConfig = {
  input: path.resolve('module', 'index.js'),
  plugins: [
    nodeGlobals(),
    nodeResolve({
      mainFields: ['module', 'jsnext', 'main'],
      extensions: [ '.vue', '.js']
    }),
    commonjs(),
    postcss({
      plugins: [
        autoprefixer
      ],
      sourceMap: true,
      extract: true,
    }),
    vue({
      css: false
    })
  ]
}

if (!fs.existsSync('umd')) {
  fs.mkdirSync('umd')
}
if (!fs.existsSync('lib')) {
  fs.mkdirSync('lib')
}
if (!fs.existsSync('esm')) {
  fs.mkdirSync('esm')
}

export default [
  // UMD
  {
    ...baseConfig,
    output: {
      format: 'umd',
      name: packageName,
      file: path.resolve('umd', `index.js`),
      sourcemap: false
    }
  },
  // COMMON
  {
    ...baseConfig,
    output: {
      format: 'cjs',
      name: packageName,
      file: path.resolve('lib', `index.js`),
      sourcemap: false
    }
  },
  // ES
  {
    ...baseConfig,
    output: {
      format: 'esm',
      name: packageName,
      file: path.resolve('esm', `index.js`),
      sourcemap: false
    }
  }
]