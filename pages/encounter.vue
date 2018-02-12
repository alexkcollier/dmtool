<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">

        <div class="level is-mobile" style="margin:0;">
          <div class="level-left">
            <div class="level-item">
              <h1>Encounter</h1>
            </div>
          </div>
          <div v-if="$store.state.encounter.length" class="level-right">
            <div class="level-item" style="margin-right:0;">
              <button
                @click="$store.commit('clearEncounter')"
                :disabled="$store.state.encounter.length === 0"
                class="button is-text"
                style="margin:0 0.25rem 1rem 0;">
                  <b-icon icon="delete" />
              </button>
              <nuxt-link to="/bestiary" class="button is-primary" style="margin:0 0 1rem 0.25rem;">
                Add
              </nuxt-link>
            </div>
          </div>
        </div>

        <hr>
        <div v-if="$store.state.encounter.length !== 0">
          <!-- List creatures -->
          <creature-entries
            v-for="creature in $store.state.encounter"
            :model="creature"
            :key="creature.index"
            :id="creatureIndex(creature.name)" />
        </div>

        <div v-else class="ampersand" style="height:60vh;">
          
          <div class="is-sans-serif has-text-centered is-size-2" style="position:relative; top:40%;">
            <div><strong>There's nothing here.</strong></div>
            <nuxt-link to="/bestiary" class="button is-primary is-large">
              Add a Creature
            </nuxt-link>
          </div>
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

<style lang="scss" scoped>
hr { margin-top: 0; }
</style>
