<template>
  <section class="hero is-primary is-bold is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-size-1">
          dmtool
        </h1>
        <h2 class="subtitle is-size-3">
          Personal DM tools
        </h2>
        <input v-if="$store.state.user !== 'hellothere'" class="input" type="password" v-model="user" @change="login">
        
        <template v-else>
          <nuxt-link to="/magic-items" class="button is-medium">Magic Items</nuxt-link>
          <nuxt-link to="/bestiary" class="button is-medium">Bestiary</nuxt-link>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head () {
    return { title: 'Home' }
  },
  data () {
    return {
      user: ''
    }
  },
  methods: {
    login () {
      this.$store.state.user = this.user
    }
  }
}
</script>

<style lang="scss">
</style>
