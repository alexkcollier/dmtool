<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Encounter</h1>


        <div>
          <!-- <p>No creatures.</p> -->
          <nuxt-link class="button is-primary" style="margin-left:0;" to="/bestiary">Add creatures</nuxt-link>
          <button v-if="$store.state.encounter.length !== 0" class="button is-text" @click="$store.commit('clearEncounter')">Reset</button>
        </div>
        <hr>
        <div v-if="$store.state.encounter.length !== 0">
          <!-- List creatures -->
          <creature-entries v-for="creature in $store.state.encounter" :model="creature" :key="creature.index" :id="creatureIndex(creature.name)" />
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import CreatureEntries from '~/components/CreatureEntries'

export default {
  head () {
    return { title: 'Encounter' }
  },
  components: {
    CreatureEntries
  },
  methods: {
    creatureIndex: function (name) {
      let index = this.$store.state.encounter.findIndex(creature => creature.name === name) + 1
      const id = `creature-${index}`
      return id
    }
  }
}
</script>

<style>

</style>
