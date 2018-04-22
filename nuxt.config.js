module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'dmtool',
    titleTemplate: '%s - dmtool',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Personal DM tools' },
      { name: 'theme-color', content: '#3d4f5d' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          '//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css'
      }
    ]
  },
  /*
  ** CSS
  */
  css: [{ src: '@assets/buefy-custom.scss', lang: 'sass' }],
  /*
  ** Plugins
  */
  plugins: ['@plugins/buefy'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Router config
  */
  router: {
    middleware: 'clear-active-el'
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['lodash'],
    /*
    ** Silence PostCSS Bulma error
    */
    postcss: {
      plugins: {
        'postcss-custom-properties': {
          warnings: false
        }
      }
    },
    /*
    ** Run ESLint on save
    */
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      /*
      ** Increase max asset size
      */
      config.performance.maxAssetSize = 2000000
    }
  }
}
