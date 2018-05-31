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
import bestiary from '~/data/bestiary-mm.json'
import Search from '~/components/Search'
import CreatureEntries from '~/components/CreatureEntries'
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
      // TODO: filter by type
      filterFields: ['cr', 'size', 'source'],
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
    this.parseSizes(this.bestiary.monster)
    this.parseAlignment(this.bestiary.monster)
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
      arr.forEach(creature => (creature.size = this.sizes[creature.size]))
    },
    parseAlignment: function(arr) {
      arr.forEach(creature => {
        if (typeof creature.alignment !== 'string') {
          if (creature.alignment.every(axis => typeof axis === 'string')) {
            creature.prettyAlignment = this.setCleanAlignment(
              creature.alignment
            )
          } else {
            const a0 = this.setCleanAlignment(creature.alignment[0].alignment)
            const a1 = this.setCleanAlignment(creature.alignment[1].alignment)
            creature.prettyAlignment = `${a0} (${
              creature.alignment[0].chance
            }%), ${a1} (${creature.alignment[1].chance}%)`
          }
          return creature
        }
      })
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
