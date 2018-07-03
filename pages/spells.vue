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
    this.spells = this.spells.filter(spell => !spell['source'].includes('UA')) // remove UA spells
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

    spellIndex(name) {
      const index =
        this.results.truncated.findIndex(result => result.name === name) + 1
      return `spell-${index}`
    }
  }
}
</script>

<style>
</style>
