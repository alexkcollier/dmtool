<template>
  <section class="section">
    <div class="container">

      <div class="content">
        <h1>Magic Item Search</h1>
        
        <!-- Search box -->
        <search
          :model="magicItems"
          search-field="name"
          search-type="magic item"
          :filter-fields="filterFields"
          :filters-to-sort="filtersToSort"
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
    itemIndex: function(name) {
      let index =
        this.results.truncated.findIndex(result => result.name === name) + 1
      return `item-${index}`
    },
    updateData: function(value) {
      this.results = value // Use results from Search.vue
      setTimeout(() => {
        if (this.results.truncated.length === 1)
          this.$refs['item-1'][0]['collapse'] = false // Expand first entry if only one result
      }, 300) // Must match search debounce time
    }
  }
}
</script>

<style lang="scss">

</style>
