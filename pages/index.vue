<template>
  <section class="hero is-primary is-bold is-fullheight">
    <div class="hero-body">
      
      <!-- Animation -->
      <Lottie 
        :options="options"
        class="ampersand-animation"/>

      <div class="container has-text-centered">
        <h1 class="title is-size-1">
          dmtool
        </h1>
        <h2 class="subtitle is-size-3">
          Personal DM tools
        </h2>
        
        <nuxt-link to="/magic-items" class="button is-medium">Magic Items</nuxt-link>
        <nuxt-link to="/spells" class="button is-medium">Spells</nuxt-link>
        <nuxt-link to="/bestiary" class="button is-medium">Bestiary</nuxt-link>
        <nuxt-link to="/encounter" class="button is-medium">Encounter</nuxt-link>
      </div>

    </div>
  </section>
</template>

<script>
import Lottie from 'vue-lottie/src/lottie.vue'
import * as animationData from '~/assets/animations/ampersand-animation.json'

export default {
  layout: 'HomePage',

  components: {
    Lottie
  },

  data() {
    return {
      options: {
        animationData,
        loop: false
      }
    }
  },

  head() {
    return { title: 'Home' }
  }
}
</script>

<style lang="scss" scoped>
.ampersand-animation {
  margin: 0 auto;
  max-width: 90vw;
  mix-blend-mode: darken;
  opacity: 0.2;
  position: absolute;
}
</style>
