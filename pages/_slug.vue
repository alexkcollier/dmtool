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
      <Component
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
    FilterPanel,
  },

  async fetch (ctx) {
    const { error, isDev, params, store } = ctx
    const notFound = () => error({ statusCode: 404, message: 'Not Found' })
    const hasStoreModule = Object.keys(store.state).includes(params.slug)

    if (!routes.includes(`/${params.slug}`)) return notFound()
    if (!hasStoreModule) store.registerModule(params.slug, baseStore)

    // Try fetching data if store empty
    try {
      return getData(ctx)
    } catch (err) {
      if (isDev) console.error(err)

      return notFound()
    }

    async function getData ({ env, params, store }) {
      // magic-items => items
      const reqUrl = new URL(`/${params.slug.split('-').pop()}.json`, env.API_DB)
      const init = { headers: new Headers({ 'X-Firebase-ETag': true }) }
      const response = await fetch(reqUrl, init)
      const data = await response.json()
      const eTag = response.headers.get('ETag')

      if (eTag === store.state[params.slug].eTag) return

      return store.dispatch(`${params.slug}/initStore`, { data, eTag })
    }
  },

  data () {
    return {
      filterFields: {
        spells: ['level', 'school', 'source', 'class'],
        'magic-items': ['rarity', 'type', 'source'],
        bestiary: ['cr', 'size', 'source', 'type', 'tags'],
      },
      filtersToSort: {
        'magic-items': ['rarity', 'source', 'type'],
      },
      prevScroll: 0,
      count: 10,
    }
  },

  computed: {
    title () {
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

    activeComponent () {
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

    searchType () {
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

    slug () {
      return this.$route.params.slug
    },

    results () {
      return this.$store.state[this.slug].queryResult
    },

    truncatedResults () {
      return this.results.slice(0, this.count)
    },
  },

  watch: {
    results () {
      if (this.results.length === 1) {
        this.setActiveEl({ el: `${this.slug}-${this.results[0].source}-1`, delay: 300 })
      }
    },
  },

  mounted () {
    window.addEventListener('scroll', this.loadMoreOnScroll)

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.onmessage = (event) => {
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
            onAction: () => window.location.reload(true),
          })
        }
      }
    }
  },

  destroyed () {
    window.removeEventListener('scroll', this.loadMoreOnScroll)
  },

  methods: {
    ...mapActions('toggle-active-el', {
      setActiveEl: 'SET_ACTIVE_EL',
      clearActiveEl: 'CLEAR_ACTIVE_EL',
    }),

    setId ({ name, source }) {
      const index = this.results.findIndex(r => r.name === name && r.source === source) + 1
      return `${this.slug}-${source}-${index}`
    },

    loadMoreOnScroll: throttle(function (event) {
      const { offsetHeight, scrollTop } = document.documentElement
      const scrollDistance = scrollTop + window.innerHeight
      const atBottom = scrollDistance >= offsetHeight - 300
      const hiddenResults = this.truncatedResults.length < this.results.length
      if (atBottom && hiddenResults) this.count += 1
      this.prevScroll = scrollTop
    }, 50),
  },

  head () {
    return {
      title: this.title,
    }
  },
}
</script>

<style>
hr {
  margin-top: 0.25em;
}
</style>
