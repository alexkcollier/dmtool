<template>
  <main class="content">

    <!-- Search and filter -->
    <Search
      :model="spells"
      :filter-fields="filterFields"
      :filters-to-sort="filterFields"
      search-field="name"
      search-type="spell"
      @update-data="updateData"/>
        
    <template v-if="results.show">
      <SpellEntries
        v-for="spell in results.truncated"
        :model="spell"
        :key="spell.index"
        :id="spellIndex(spell)"
        :ref="spellIndex(spell)"/>
    </template>
        
    <div v-else class="ampersand"/>
        
  </main>
</template>

<script>
import spells from '~/data/spells.json'
import Search from '~/components/Search'
import SpellEntries from '~/components/SpellEntries'
import { mapActions } from 'vuex'

export default {
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

  head() {
    return { title: 'Spells' }
  },

  created() {
    this.spells = this.spells.filter(spell => !spell.source.includes('UA')) // remove UA spells
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL'
    }),

    updateData(value) {
      this.results = value // Use results from Search.vue
      // Expand first entry if only one result. Must match search debounce time
      if (this.results.truncated.length === 1)
        this.setActiveEl({ el: `spell-1`, delay: 300 })
    },

    spellIndex({ name, source }) {
      const index =
        this.results.truncated.findIndex(
          r => r.name === name && r.source === source
        ) + 1
      return `spell-${index}`
    }
  }
}
</script>

<style>
</style>
