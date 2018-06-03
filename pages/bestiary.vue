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
          :model="bestiary"
          :filter-fields="filterFields"
          :filters-to-sort="filterFields"
          search-field="name"
          search-type="creature"
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
      filterFields: ['cr', 'size', 'source', 'type'],
      sizes: {
        T: 'Tiny',
        S: 'Small',
        M: 'Medium',
        L: 'Large',
        H: 'Huge',
        G: 'Gargantuan'
      },
      alignmentMap: {
        'any non-good alignment': ['L', 'NX', 'C', 'NY', 'E'],
        'any non-lawful alignment': ['NX', 'C', 'G', 'NY', 'E'],
        'any chaotic alignment': ['C', 'G', 'NY', 'E'],
        'any evil alignment': ['L', 'NX', 'C', 'E'],
        'any alignment': ['A'],
        unaligned: ['U'],
        neutral: ['N'],
        'chaotic evil': ['C', 'E'],
        'chaotic neutral': ['C', 'N'],
        'chaotic good': ['C', 'G'],
        'neutral good': ['N', 'G'],
        'neutral evil': ['N', 'E'],
        'lawful evil': ['L', 'E'],
        'lawful neutral': ['L', 'N'],
        'lawful good': ['L', 'G']
      }
    }
  },

  created: function() {
    this.parseSizes(this.bestiary)
    this.parseAlignment(this.bestiary)
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL'
    }),
    updateData: function(value) {
      this.results = value // Use results from Search.vue
      // Expand first entry if only one result. Must match search debounce time
      if (this.results.truncated.length === 1)
        this.setActiveEl({ el: `creature-1`, delay: 300 })
    },
    creatureIndex: function(name) {
      const index =
        this.results.truncated.findIndex(result => result.name === name) + 1
      return `creature-${index}`
    },
    parseSizes: function(arr) {
      arr.forEach(
        creature =>
          (creature.size = this.sizes.hasOwnProperty(creature.size)
            ? this.sizes[creature.size]
            : creature.size)
      )
    },
    parseAlignment: function(arr) {
      arr.forEach(
        creature =>
          (creature.prettyAlignment = creature.alignment[0].special
            ? // Creatures with special alignments. e.g.: Sacred Statue (Mordenkainen's Tome of Foes)
              creature.alignment[0].special
            : creature.alignment[0].chance
              ? // Creatures with chance alignments. e.g.: Cloud Giant, Empyrean
                `${this.setCleanAlignment(creature.alignment[0].alignment)}
                (${creature.alignment[0].chance}%) or
                ${this.setCleanAlignment(creature.alignment[1].alignment)}
                (${creature.alignment[1].chance}%)`
              : // Standard alignments
                this.setCleanAlignment(creature.alignment))
      )
    },
    setCleanAlignment: function(target) {
      const cleanAlignment = Object.keys(this.alignmentMap)
      const aligns = Object.values(this.alignmentMap)
      // Find the index of the alignmentMap array matching the creature's alignment array
      const idx = aligns.findIndex(a => a.every(axis => target.includes(axis)))
      return cleanAlignment[idx]
    }
  }
}
</script>

<style>
</style>
