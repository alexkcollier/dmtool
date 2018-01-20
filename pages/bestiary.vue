<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Bestiary</h1>

        <!-- List creatures -->
        <template v-for="creature in bestiary.monster">
          <creature-entries :model="creature" :key="creature.index" />
        </template>

      </div>
    </div>
  </section>
</template>

<script>
import bestiary from '~/data/bestiary.json'
import CreatureEntries from '~/components/CreatureEntries'

export default {
  head () {
    return { title: 'Bestiary' }
  },
  components: {
    CreatureEntries
  },
  data () {
    return {
      bestiary
    }
  }
}
</script>

<style>

</style>
