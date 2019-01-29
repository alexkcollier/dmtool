import dotenv from 'dotenv'
import { routes } from './routes'
import pkg from './package.json'
dotenv.config()

const brandColor = '#3d4f5d'
const name = pkg.name

export default {
  mode: 'spa',
  modern: 'client',
  head: {
    titleTemplate: t => {
      return t ? `${t} - dmtool` : 'dmtool'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'D&D 5e Utilities' },
      { name: 'theme-color', content: brandColor }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css'
      },
      {
        rel: 'preload',
        href: '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css',
        crossorigin: 'anonymous',
        as: 'style'
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://use.typekit.net/fnw1iwa.css'
      },
      {
        rel: 'preload',
        href: 'https://use.typekit.net/fnw1iwa.css',
        crossorigin: 'anonymous',
        as: 'style'
      }
    ]
  },
  css: [{ src: '@assets/buefy-custom.scss', lang: 'sass' }],
  plugins: [
    '@plugins/buefy.js',
    '@plugins/vue-scrollto.client.js',
    '@/plugins/vuex-persist.client.js'
  ],
  modules: ['@nuxtjs/pwa'],
  manifest: {
    name: 'DM Tool',
    short_name: name,
    background_color: brandColor,
    theme_color: brandColor
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: '.*//cdn.materialdesignicons.com/.*',
        handler: 'cacheFirst'
      },
      {
        urlPattern: '.*//*.typekit.net/.*',
        handler: 'cacheFirst'
      }
    ]
  },
  loading: { color: '#3B8070' },
  router: {
    middleware: 'clear-active-el'
  },
  env: {
    API_KEY: process.env.API_KEY,
    API_DOMAIN: process.env.API_DOMAIN,
    API_DB: process.env.API_DB,
    API_BUCKET: process.env.API_BUCKET
  },
  generate: {
    routes,
    fallback: true
  },
  build: {
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    },
    optimization: { splitChunks: { maxSize: 244000 } },
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.devtool = '#eval-source-map'

        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
