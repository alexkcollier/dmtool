<template>
  <section class="section">
    <div class="container">
      <div class="content">
        
        <div class="level is-mobile" style="margin:0;">
          <div class="level-left">
            <div class="level-item">
              <h1>Bestiary</h1>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item" style="margin-right:0;">
              <nuxt-link to="/encounter" class="button is-text" style="margin:0 0 1rem 0;">
                Manage Encounter
              </nuxt-link>
            </div>
          </div>
        </div>
        
        <search
          :model="bestiary.monster"
          search-field="name"
          search-type="creature"
          :filter-fields="filterFields"
          :filters-to-sort="filterFields"
          @update-data="updateData"/>
        
        <div v-if="results.show">
          <!-- List creatures -->
          <creature-entries
            v-for="creature in results.truncated"
            :model="creature"
            :key="creature.index"
            :id="creatureIndex(creature.name)"
            :ref="creatureIndex(creature.name)"/>
        </div>
        <div v-else class="ampersand"/>

      </div>
    </div>
  </section>
</template>

<script>
import bestiary from '~/data/bestiary.json'
import Search from '~/components/Search'
import CreatureEntries from '~/components/CreatureEntries'

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
      // TODO: filter by type
      filterFields: ['cr', 'size', 'source']
    }
  },

  methods: {
    updateData: function(value) {
      this.results = value // Use results from Search.vue
      setTimeout(() => {
        if (this.results.truncated.length === 1)
          this.$refs['creature-1'][0]['collapse'] = false // Expand first entry if only one result
      }, 300) // Must match search debounce time
    },
    creatureIndex: function(name) {
      let index =
        this.results.truncated.findIndex(result => result.name === name) + 1
      return `creature-${index}`
    }
  }
}
</script>

<style>

</style>
