<template>
  <section class="section">
    <div class="container">
      <div class="content">

        <div class="level is-mobile" style="margin:0;">
          <div class="level-left">
            <div class="level-item">
              <h1>Encounter</h1>
            </div>
          </div>
          <div v-if="encounter.length" class="level-right">
            <div class="level-item" style="margin-right:0;">
              <button
                :disabled="encounter.length === 0"
                class="button is-text"
                style="margin:0 0.25rem 1rem 0;"
                @click="clearEncounter">
                <b-icon icon="delete" />
              </button>
              <nuxt-link to="/bestiary" class="button is-primary" style="margin:0 0 1rem 0.25rem;">
                Add
              </nuxt-link>
            </div>
          </div>
        </div>

        <hr>
        <div v-if="encounter.length">
          <!-- List creatures -->
          <creature-entries
            v-for="creature in encounter"
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
    something: function() {
      return 3
    }
  },

  methods: {
    creatureIndex: function(name) {
      let index =
        this.encounter.findIndex(creature => creature.name === name) + 1
      return `creature-${index}`
    },
    ...mapMutations('encounter', {
      clearEncounter: 'CLEAR_ENCOUNTER'
    })
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin-top: 0;
}
</style>
