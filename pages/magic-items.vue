<template>
  <section class="section">
    <div class="container">

      <div class="content">
        <h1>Magic Item Search</h1>
        
        <!-- Search box -->
        <search
          :model="magicItems"
          :filter-fields="filterFields"
          :filters-to-sort="filtersToSort"
          search-field="name"
          search-type="magic item"
          @update-data="updateData"/>

        <div v-if="results.show">
          <!-- Item entries -->
          <item-entries
            v-for="item in results.truncated"
            :model="item"
            :key="item.index"
            :id="itemIndex(item.name)"
            :ref="itemIndex(item.name)"/>
        </div>
        <div v-else class="ampersand"/>

      </div>
    </div>
  </section>
</template>

<script>
import magicItems from '~/data/magic-items.json'
import ItemEntries from '~/components/ItemEntries'
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
    itemIndex(name) {
      const index = this.results.truncated.findIndex(r => r.name === name) + 1
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
