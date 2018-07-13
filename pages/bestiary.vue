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

  created() {
    this.parseSizes()
    this.parseAlignment()
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
    },

    parseSizes() {
      for (const creature of this.bestiary) {
        creature.size = this.sizes[creature.size] || creature.size
      }
    },

    parseAlignment() {
      for (const creature of this.bestiary) {
        if (creature.alignment[0].special) {
          // Creatures with special alignments. e.g.: Sacred Statue (Mordenkainen's Tome of Foes)
          creature.prettyAlignment = creature.alignment[0].special
        } else if (creature.alignment[0].chance) {
          // Creatures with chance alignments. e.g.: Cloud Giant, Empyrean
          const a1 = this.setCleanAlignment(creature.alignment[0].alignment)
          const a2 = this.setCleanAlignment(creature.alignment[1].alignment)
          const c1 = creature.alignment[0].chance
          const c2 = creature.alignment[1].chance
          creature.prettyAlignment = `${a1} (${c1}%) or ${a2} (${c2}%)`
        } else {
          // Standard alignments
          creature.prettyAlignment = this.setCleanAlignment(creature.alignment)
        }
      }
    },

    setCleanAlignment(target) {
      const cleanAlignment = Object.keys(this.alignmentMap)
      const aligns = Object.values(this.alignmentMap)
      // Find the index of the alignmentMap array matching the creature's alignment array
      const idx = aligns.findIndex(a => a.every(axis => target.includes(axis)))
      return cleanAlignment[idx]
    }
  }
}
</script>

<style scoped>
hr {
  margin-top: 1rem;
}
</style>
