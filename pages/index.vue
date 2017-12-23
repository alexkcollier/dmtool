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
        <nuxt-link to="/magic-items" class="button is-medium">Magic Items</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head () {
    return { title: 'Home' }
  }
}
</script>

<style lang="scss">
</style>
