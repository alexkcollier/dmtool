<template>
  <main class="content">
    <div
      v-if="encounter.length"
      class="buttons"
    >
      <nuxt-link
        to="/bestiary"
        class="button is-primary"
      >
        Add a creature
      </nuxt-link>
      <button
        :disabled="encounter.length === 0"
        class="button is-red"
        @click="clearEncounter"
      >
        Clear encounter
      </button>
      <hr>
    </div>

    <template v-if="encounter.length">
      <CreatureEntries
        v-for="creature in encounter"
        :id="creatureIndex(creature)"
        :key="creature.index"
        :model="creature"
      />
    </template>

    <div
      v-else
      class="ampersand"
      style="height:60vh;"
    >
      <div
        class="is-sans-serif has-text-centered is-size-2"
        style="position:relative; top:40%;"
      >
        <div>
          <strong>There's nothing here.</strong>
        </div>
        <nuxt-link
          to="/bestiary"
          class="button is-primary is-large"
        >
          Add a Creature
        </nuxt-link>
      </div>
    </div>
  </main>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import CreatureEntries from '~/components/CreatureEntries'

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
    })
  },

  methods: {
    creatureIndex({ name: n, source: s }) {
      const i = this.encounter.findIndex(c => c.name === n && c.source === s) + 1
      return `creature-${i}`
    },

    ...mapMutations('encounter', {
      clearEncounter: 'CLEAR_ENCOUNTER'
    })
  }
}
</script>
