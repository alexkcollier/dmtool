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
        <nuxt-link to="/spells" class="button is-medium">Spells</nuxt-link>
        <nuxt-link to="/bestiary" class="button is-medium">Bestiary</nuxt-link>
        <nuxt-link to="/encounter" class="button is-medium">Encounter</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'HomePage',
  head() {
    return { title: 'Home' }
  }
}
</script>

<style lang="scss" scoped>
.hero::before {
  height: 90%;
  width: 100%;
  position: absolute;
  top: 5vh;
  background: url('~assets/ampersand.svg') center center / contain no-repeat;
  background-blend-mode: multiply;
  mix-blend-mode: multiply;
  opacity: 0.1;
  content: '';
}
</style>
