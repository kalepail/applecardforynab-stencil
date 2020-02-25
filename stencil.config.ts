import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import { postcss } from '@stencil/postcss'
import autoprefixer from 'autoprefixer'
import nodePolyfills from 'rollup-plugin-node-polyfills'

// https://stenciljs.com/docs/config

export const config: Config = {
  devServer: {
    openBrowser: false
  },
  outputTargets: [
    {
      type: 'www',
      baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3333/' : 'https://applecardforynab.com/'
    }
  ],
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  commonjs: {
    namedExports: {

    },
  },
  plugins: [
    nodePolyfills(),
    sass(),
    postcss({
      plugins: [autoprefixer()]
    })
  ],
  nodeResolve: {
    browser: true,
    preferBuiltins: true
  }
}