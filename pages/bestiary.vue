<template>
  <main class="content">
        
    <Search
      :model="bestiary"
      :filter-fields="filterFields"
      :filters-to-sort="filterFields"
      search-field="name"
      search-type="creature"
      @update-data="updateData"/>
        
    <template v-if="results.show">
      <CreatureEntries
        v-for="creature in results.truncated"
        :model="creature"
        :key="creature.index"
        :id="creatureIndex(creature)"
        :ref="creatureIndex(creature)"/>
    </template>

    <div v-else class="ampersand"/>

  </main>
</template>

<script>
import bestiary from '~/data/bestiary'
import CreatureEntries from '~/components/CreatureEntries'
import Search from '~/components/Search'
import { mapActions } from 'vuex'

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
      bestiary,
      results: {},
      // TODO: filter by alignment?
      filterFields: ['cr', 'size', 'source', 'type']
    }
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
