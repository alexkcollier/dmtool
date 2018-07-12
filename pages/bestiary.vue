<template>
  <section class="section">
    <div class="container">
      <div class="content">
        {{ $store.state.bestiary.bestiary.length }}
        
        <search
          :model="bestiary"
          :filter-fields="filterFields"
          :filters-to-sort="filterFields"
          search-field="name"
          search-type="creature"
          @update-data="updateData"/>
        
        <template v-if="results.show">
          <!-- List creatures -->
          <template v-for="creature in results.truncated">
            <creature-entries
              :model="creature"
              :key="creature.index"
              :id="creatureIndex(creature)"
              :ref="creatureIndex(creature)"/>
            <hr :key="creature.index">
          </template>
        </template>
        <div v-else class="ampersand"/>

      </div>
    </div>
  </section>
</template>

<script>
import CreatureEntries from '~/components/CreatureEntries'
import Search from '~/components/Search'
import { mapActions, mapState } from 'vuex'

export default {
  head() {
    return { title: 'Bestiary' }
  },

  components: {
    Search,
    CreatureEntries
  },

  data() {
    return {
      // bestiary,
      results: {},
      // TODO: filter by alignment?
      filterFields: ['cr', 'size', 'source', 'type']
    }
  },

  computed: {
    ...mapState('bestiary', ['bestiary'])
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL'
    }),

    updateData(value) {
      this.results = value // Use results from Search.vue
      // Expand first entry if only one result. Must match search debounce time
      if (this.results.truncated.length === 1)
        this.setActiveEl({ el: `creature-1`, delay: 300 })
    },

    creatureIndex({ name, source }) {
      const { truncated: t } = this.results
      const index = t.findIndex(r => r.name === name && r.source === source) + 1
      return `creature-${index}`
    }
  }
}
</script>

<style scoped>
hr {
  margin-top: 1rem;
}
</style>
