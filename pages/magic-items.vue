<template>
  <main class="content">
        
    <!-- Search box -->
    <Search
      :model="magicItems"
      :filter-fields="filterFields"
      :filters-to-sort="filtersToSort"
      search-field="name"
      search-type="magic item"
      @update-data="updateData"/>

    <template v-if="results.show">
      <ItemEntries
        v-for="item in results.truncated"
        :model="item"
        :key="item.index"
        :id="itemIndex(item)"
        :ref="itemIndex(item)"/>
    </template>
        
    <div v-else class="ampersand"/>

  </main>
</template>

<script>
import ItemEntries from '~/components/ItemEntries'
import magicItems from '~/data/magic-items.json'
import Search from '~/components/Search'
import { mapActions } from 'vuex'

export default {
  components: {
    ItemEntries,
    Search
  },

  head() {
    return { title: 'Magic Items' }
  },

  data() {
    return {
      magicItems,
      results: {},
      filterFields: ['rarity', 'type', 'source'],
      filtersToSort: ['source', 'type']
    }
  },

  methods: {
    itemIndex({ name, source }) {
      const index =
        this.results.truncated.findIndex(
          r => r.name === name && r.source === source
        ) + 1
      return `item-${index}`
    },

    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL'
    }),

    updateData(value) {
      this.results = value // Use results from Search.vue
      // Expand first entry if only one result. Must match search debounce time
      if (this.results.truncated.length === 1)
        this.setActiveEl({ el: `item-1`, delay: 300 })
    }
  }
}
</script>

<style lang="scss">
</style>
