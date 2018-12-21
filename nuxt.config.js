export default {
  mode: 'spa',
  head: {
    titleTemplate: t => (t ? `${t} - dmtool` : 'dmtool'),
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'D&D 5e Utilities' },
      { name: 'theme-color', content: '#3d4f5d' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css'
      },
      {
        rel: 'prefetch',
        href: '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css'
      }
    ]
  },
  css: [{ src: '@assets/buefy-custom.scss', lang: 'sass' }],
  plugins: [
    '@plugins/buefy',
    '@plugins/vue-scrollto',
    { src: '@/plugins/vuex-persist', ssr: false }
  ],
  modules: ['@nuxtjs/pwa'],
  manifest: {
    name: 'DM Tool',
    short_name: 'dmtool',
    background_color: '#3d4f5d',
    theme_color: '#3d4f5d'
  },
  workbox: {
    offlineAssets: ['/data/bestiary.json', '/data/magic-items.json', '/data/spells.json'],
    runtimeCaching: [
      {
        urlPattern: 'https://dmtool.acollier.ca/data/.*',
        strategyOptions: {
          cacheName: 'dmtool-cache',
          cacheExpiration: {
            maxEntries: 10,
            maxAgeSeconds: 300
          }
        }
      },
      {
        urlPattern: '.*//cdn.materialdesignicons.com/.*',
        handler: 'cacheFirst'
      },
      {
        urlPattern: '.*//*.typekit.net/.*'
      }
    ]
  },
  loading: { color: '#3B8070' },
  router: {
    middleware: 'clear-active-el'
  },
  generate: {
    routes: ['/bestiary', '/magic-items', '/spells'],
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
