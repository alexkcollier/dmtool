<template>
  <section class="section">
    <div class="container">
      <div class="columns is-centered">
        <div class="column  has-text-centered">
          <logo/>
          <h1 class="title">
            dmtool
          </h1>
          <h2 class="subtitle">
            Personal DM tools
          </h2>
          <a href="https://nuxtjs.org/" target="_blank" class="button is-primary">Documentation</a>
          <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button">GitHub</a>
          <div v-for="(description, item) in jsonItems" :key="item">
            <h2>{{ item }}</h2>
            <div>{{ description.content }}</div>
          </div>
          <!-- {{ jsonItems }} -->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

var jsonItems = require('~/static/magicItems.json')

export default {
  components: {
    Logo
  },
  data () {
    return { jsonItems }
  }
}
</script>


