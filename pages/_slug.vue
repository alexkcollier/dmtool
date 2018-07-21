<template>
  <main class="content">

    <Search
      :model="activeData"
      :filter-fields="filterFields[$route.params.slug]"
      :filters-to-sort="filtersToSort[$route.params.slug] || filterFields[$route.params.slug]"
      :search-type="searchType"
      @update-data="updateData"/>
        
    <template v-if="results.show">
      <component
        v-for="result in results.truncated"
        :is="activeComponent"
        :model="result"
        :key="result.index"
        :id="setId(result)"/>
    </template>
        
    <div v-else class="ampersand"/>
        
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import Search from '~/components/Search'

export default {
  components: {
    CreatureEntries: () => import('~/components/CreatureEntries'),
    ItemEntries: () => import('~/components/ItemEntries'),
    SpellEntries: () => import('~/components/SpellEntries'),
    Search
  },

  data() {
    return {
      results: {},
      filterFields: {
        spells: ['level', 'school', 'source'],
        'magic-items': ['rarity', 'type', 'source'],
        bestiary: ['cr', 'size', 'source', 'type']
      },
      filtersToSort: {
        'magic-items': ['source', 'type']
      }
    }
  },

  head() {
    return {
      title: () => {
        switch (this.slug) {
          case 'spells':
            return 'Spells'
          case 'magic-items':
            return 'Magic Items'
          case 'bestiary':
            return 'Creatures'
          default:
            return null
        }
      }
    }
  },

  computed: {
    activeComponent() {
      switch (this.slug) {
        case 'spells':
          return 'SpellEntries'
        case 'magic-items':
          return 'ItemEntries'
        case 'bestiary':
          return 'CreatureEntries'
        default:
          return null
      }
    },

    searchType() {
      switch (this.slug) {
        case 'spells':
          return 'spell'
        case 'magic-items':
          return 'magic item'
        case 'bestiary':
          return 'creature'
        default:
          return null
      }
    },

    slug() {
      return this.$route.params.slug
    }
  },

  async asyncData({ params, error }) {
    try {
      const { default: activeData } = await import(`~/data/${params.slug}`)
      return { activeData }
    } catch (e) {
      error({ statusCode: 404, message: 'This page could not be found' })
    }
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL'
    }),

    updateData(value) {
      this.results = value // Use results from Search.vue
      if (this.results.truncated.length === 1) {
        const el = `${this.slug}-${this.results.truncated[0].source}-1`
        this.setActiveEl({ el, delay: 300 })
      }
    },

    setId({ name, source }) {
      const { truncated: t } = this.results
      const index = t.findIndex(r => r.name === name && r.source === source) + 1
      return `${this.slug}-${source}-${index}`
    }
  }
}
</script>

<style>
</style>