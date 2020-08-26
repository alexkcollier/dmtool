<template>
  <section class="hero is-primary is-bold is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-size-1">
          dmtool
        </h1>
        <h2 class="subtitle is-size-3">
          D&amp;D 5e Utility
        </h2>

        <NuxtLink
          to="/magic-items"
          class="button is-medium"
        >
          Magic Items
        </NuxtLink>
        <NuxtLink
          to="/spells"
          class="button is-medium"
        >
          Spells
        </NuxtLink>
        <NuxtLink
          to="/bestiary"
          class="button is-medium"
        >
          Bestiary
        </NuxtLink>
        <NuxtLink
          to="/encounter"
          class="button is-medium"
        >
          Encounter
        </NuxtLink>
        <NuxtLink
          to="/roll-dice"
          class="button is-medium"
        >
          Roll Dice
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'HomePage',

  head () {
    return { title: 'Home' }
  },
}
</script>

<style lang="scss" scoped>
.hero-body {
  &::before {
    background: url('~assets/ampersand.svg') center center / contain no-repeat;
    background-blend-mode: multiply;
    content: '';
    height: 50vh;
    left: 0;
    mix-blend-mode: multiply;
    opacity: 0.1;
    position: absolute;
    width: 100%;
  }
}

.button {
  margin: 0.25em;
}
</style>
