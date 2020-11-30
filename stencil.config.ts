import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import { postcss } from '@stencil/postcss'
import autoprefixer from 'autoprefixer'
import nodePolyfills from 'rollup-plugin-node-polyfills'

export const config: Config = {
  namespace: 'applecardforynab',
  devServer: {
    openBrowser: false
  },
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      prerenderConfig: './prerender.config.ts',
      baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3333/' : 'https://applecardforynab.com/',
      copy: [
        { src: 'robots.txt' }
      ]
    }
  ],
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