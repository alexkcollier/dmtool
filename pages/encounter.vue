<template>
  <section class="section">
    <div class="container">
      <div class="content">

        <div v-if="encounter.length" class="buttons">
          <nuxt-link to="/bestiary" class="button is-primary">
            Add a creature
          </nuxt-link>
          <button
            :disabled="encounter.length === 0"
            class="button is-red"
            @click="clearEncounter">
            Clear encounter
          </button>
          <hr>
        </div>

        <template v-if="encounter.length">
          <CreatureEntries
            v-for="creature in encounter"
            :model="creature"
            :key="creature.index"
            :id="creatureIndex(creature)" />
        </template>

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
import { mapMutations, mapState } from 'vuex'

export default {
  head() {
    return { title: 'Encounter' }
  },

  components: {
    CreatureEntries
  },

  computed: {
    ...mapState('encounter', {
      encounter: 'encounter'
    }),

    something() {
      return 3
    }
  },

  methods: {
    creatureIndex({ name, source }) {
      const index =
        this.encounter.findIndex(c => c.name === name && c.source === source) +
        1
      return `creature-${index}`
    },

    ...mapMutations('encounter', {
      clearEncounter: 'CLEAR_ENCOUNTER'
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
