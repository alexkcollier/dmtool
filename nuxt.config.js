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
      { hid: 'description', name: 'description', content: 'Personal DM tools' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** CSS
  */
  css: [
    { src: '@assets/buefy-custom.scss', lang: 'sass' }
  ],
  /*
  ** Plugins
  */
  plugins: ['@plugins/buefy'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  generate: {
    minify: {
      collapseWhitespace: false
    }
  },
  /*
  ** Build configuration
  */
  build: {
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
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
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
