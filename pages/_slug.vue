<template>
  <main class="content">
    <SearchBox
      :search-type="searchType"
      @update-data="clearActiveEl"
    />

    <FilterPanel
      v-if="filterFields[slug].length"
      :filter-fields="filterFields[slug]"
      @update-data="clearActiveEl"
    />

    <ResultCount :search-type="searchType" />

    <hr>

    <template v-if="results.length > 0">
      <component
        :is="activeComponent"
        v-for="result in truncatedResults"
        :id="setId(result)"
        :key="result.index"
        :model="result"
      />
    </template>

    <div
      v-else
      class="ampersand"
    />
  </main>
</template>

<script>
import { mapActions } from 'vuex'
import throttle from 'lodash.throttle'
import FilterPanel from '~/components/FilterPanel'
import ResultCount from '~/components/ResultCount'
import SearchBox from '~/components/SearchBox'
import { routes } from '~/routes'
import baseStore from '~/store/_slug'

export default {
  components: {
    /* eslint-disable vue/no-unused-components */
    CreatureEntries: () => import('~/components/CreatureEntries'),
    ItemEntries: () => import('~/components/ItemEntries'),
    SpellEntries: () => import('~/components/SpellEntries'),
    /* eslint-enable */
    ResultCount,
    SearchBox,
    FilterPanel
  },

  data() {
    return {
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

  async fetch({ env, error, isDev, params, store }) {
    const notFound = () => error({ statusCode: 404, message: 'Not Found' })
    const hasStoreModule = Object.keys(store.state).includes(params.slug)

    if (!routes.includes(`/${params.slug}`)) return notFound()
    if (!hasStoreModule) store.registerModule(params.slug, baseStore)

    // magic-items => items
    const category = params.slug.split('-').pop()

    // Try fetching data
    try {
      const versionRef = await fetch(`${env.API_DB}/version.json`)
      const newVersion = await versionRef.json()
      // fetch data if there is no local data or the version is outdated
      const request = new Request(`${env.API_DB}/${category}.json`, {
        headers: new Headers({ 'X-Firebase-ETag': true })
      })
      const response = await fetch(request)
      const data = await response.json()
      const eTag = response.headers.get('ETag')

      store.commit('UPDATE_VERSION', { version: newVersion })

      return store.dispatch(`${params.slug}/initStore`, { data, eTag })
    } catch (err) {
      if (isDev) console.error(err)

      return notFound()
    }
  },

  head() {
    return {
      title: this.title
    }
  },

  computed: {
    title() {
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
    },

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

    results() {
      return this.$store.state[this.slug].queryResult
    },

    truncatedResults() {
      return this.results.slice(0, this.count)
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

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.onmessage = event => {
        const message = JSON.parse(event.data)
        const isPath = message.url.includes(this.slug.replace('magic-', ''))
        const isRefresh = message.type === 'refresh'
        const isNew = this.$store.state[this.slug].eTag !== message.eTag
        const shouldRefresh = isRefresh && isPath && isNew

        if (shouldRefresh) {
          this.$store.commit(`${this.slug}/UPDATE_ETAG`, { eTag: message.eTag })
          this.$snackbar.open({
            message: 'Updated data is available',
            actionText: 'Refresh',
            position: 'is-bottom',
            type: 'is-gold',
            indefinite: 'true',
            onAction: () => window.location.reload(true)
          })
        }
      }
    }
  },

  destroyed() {
    window.removeEventListener('scroll', this.loadMoreOnScroll)
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL',
      clearActiveEl: 'CLEAR_ACTIVE_EL'
    }),

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

<style>
hr {
  margin-top: 0.25em;
}
</style>
