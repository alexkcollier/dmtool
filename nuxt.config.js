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
      },
      {
        rel: 'prefetch',
        href: process.env.API_DB
      }
    ]
  },
  css: [{ src: '@assets/buefy-custom.scss', lang: 'sass' }],
  plugins: [
    '@/plugins/buefy.js',
    '@/plugins/vue-scrollto.client.js',
    '@/plugins/vuex-persist.client.js'
  ],
  modules: ['@nuxtjs/pwa'],
  pwa: {
    manifest: {
      name: 'DM Tool',
      short_name: name,
      background_color: brandColor,
      theme_color: brandColor
    },
    workbox: {
      importScripts: ['data-sw.js'],
      runtimeCaching: [
        {
          urlPattern: '.*//cdn.materialdesignicons.com/.*',
          handler: 'networkFirst'
        },
        {
          urlPattern: '.*//*.typekit.net/.*',
          handler: 'networkFirst'
        },
        {
          urlPattern: `${process.env.API_DB}/.*.json`,
          handler: 'networkFirst'
        }
      ]
    }
  },
  loading: { color: '#3B8070' },
  router: {
    middleware: 'clear-active-el'
  },
  env: {
    API_DB: process.env.API_DB
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
    loaders: {
      scss: {
        implementation: require('sass'),
        fiber: require('fibers')
      }
    },
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
