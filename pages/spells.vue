<template>
  <section class="section">
    <div class="container">
      <div class="content">
        <h1>Spells</h1>

        <!-- Search and filter -->
        <search
          :model="spells"
          :filter-fields="filterFields"
          :filters-to-sort="filterFields"
          search-field="name"
          search-type="spell"
          @update-data="updateData"/>
        
        <div v-if="results.show">
          <!-- List spells -->
          <spell-entries
            v-for="spell in results.truncated"
            :model="spell"
            :key="spell.index"
            :id="spellIndex(spell.name)"
            :ref="spellIndex(spell.name)"/>
        </div>
        
        <div v-else class="ampersand"/>
      </div>
    </div>
  </section>
</template>

<script>
import spells from '~/data/spells.json'
import Search from '~/components/Search'
import SpellEntries from '~/components/SpellEntries'

export default {
  head() {
    return { title: 'Spells' }
  },

  components: {
    Search,
    SpellEntries
  },

  data() {
    return {
      spells,
      results: {},
      filterFields: ['level', 'school', 'source']
    }
  },

  created: function() {
    this.spells = this.spells.filter(spell => !spell['source'].includes('UA')) // remove UA spells
  },

  methods: {
    updateData: function(value) {
      this.results = value // Use results from Search.vue
      setTimeout(() => {
        if (this.results.truncated.length === 1)
          this.$refs['spell-1'][0]['collapse'] = false // Expand first entry if only one result
      }, 300) // Must match search debounce time
    },
    spellIndex: function(name) {
      let index =
        this.results.truncated.findIndex(result => result.name === name) + 1
      return `spell-${index}`
    }
  }
}
</script>

<style>
</style>
