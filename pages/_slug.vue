<template>
  <main class="content">

    <Search
      :model="activeData"
      :filter-fields="filterFields[$route.params.slug]"
      :filters-to-sort="filtersToSort[$route.params.slug] || filterFields[$route.params.slug]"
      :search-type="searchType"
      @update-data="updateData"
    />

    <template v-if="results.length > 0">
      <component
        :is="activeComponent"
        v-for="result in truncatedResults"
        :id="setId(result)"
        :key="result.index"
        :model="result"
      />
    </template>

    <div v-else class="ampersand" />

  </main>
</template>

<script>
import { mapActions } from 'vuex'
import { throttle } from 'lodash'
import Search from '~/components/Search'

export default {
  components: {
    /* eslint-disable vue/no-unused-components */
    CreatureEntries: () => import('~/components/CreatureEntries'),
    ItemEntries: () => import('~/components/ItemEntries'),
    SpellEntries: () => import('~/components/SpellEntries'),
    /* eslint-enable */
    Search
  },

  data() {
    return {
      results: [],
      filterFields: {
        spells: ['level', 'school', 'source', 'class'],
        'magic-items': ['rarity', 'type', 'source'],
        bestiary: ['cr', 'size', 'source', 'type', 'tags']
      },
      filtersToSort: {
        'magic-items': ['rarity', 'source', 'type']
      },
      prevScroll: 0,
      count: 10
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
    },

    truncatedResults() {
      return this.results.slice(0, this.count)
    }
  },

  async asyncData({ params, error }) {
    try {
      const { default: activeData } = await import(`~/data/${params.slug}`)
      return { activeData }
    } catch (e) {
      console.error(e)
      error({ statusCode: 404, message: 'This page could not be found' })
    }
  },

  watch: {
    results() {
      if (this.results.length === 1) {
        this.setActiveEl({ el: `${this.slug}-${this.results[0].source}-1`, delay: 300 })
      }
    }
  },

  mounted() {
    window.addEventListener('scroll', this.loadMoreOnScroll)
  },

  destroyed() {
    window.removeEventListener('scroll', this.loadMoreOnScroll)
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL',
      clearActiveEl: 'CLEAR_ACTIVE_EL'
    }),

    updateData(value) {
      this.clearActiveEl()
      this.results = value // Use results from Search.vue
    },

    setId({ name, source }) {
      const index = this.results.findIndex(r => r.name === name && r.source === source) + 1
      return `${this.slug}-${source}-${index}`
    },

    loadMoreOnScroll: throttle(function(event) {
      const { offsetHeight, scrollTop } = document.documentElement
      const scrollDistance = scrollTop + window.innerHeight
      const atBottom = scrollDistance >= offsetHeight - 300
      const hiddenResults = this.truncatedResults.length < this.results.length
      if (atBottom && hiddenResults) this.count += 1
      this.prevScroll = scrollTop
    }, 50)
  }
}
</script>
