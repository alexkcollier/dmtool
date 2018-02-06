<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>

      <div class="content">
        <h1>Magic Item Search</h1>
        
        <!-- Search box -->
        <search :model="magicItems" search-field="name" search-type="items" @update-data="updateData" />

        <div class="card">
          <!-- Filters -->
          <div class="card-header">
            <a @click="collapseFilters = !collapseFilters" class="card-header-title">
              Filters
              <b-icon :icon="collapseFilters ? 'chevron-down' : 'chevron-up'"/>
            </a>
          </div>

          <transition name="fade-grow">
            <div v-show="!collapseFilters">

              <div class="card-header">
                <a :class="{'is-active': showFilter == 'Rarity'}" @click="showFilter = 'Rarity'" class="card-footer-item">Rarity</a>
                <a :class="{'is-active': showFilter == 'Source'}" @click="showFilter = 'Source'" class="card-footer-item">Source</a>
              </div>

              <div class="card-content">

                <!-- Rarity filter -->
                <template v-if="showFilter === 'Rarity'">
                  <b-field grouped group-multiline>
                    <div v-for="level in rarity" :key="level.name" class="control">
                      <b-switch v-model="level.value" @input="makeRarityQuery">{{ level.name }}</b-switch>
                    </div>
                  </b-field>
                </template>

                <!-- Source filter -->
                <template v-else-if="showFilter === 'Source'">
                  <b-field grouped group-multiline>
                    <div v-for="s in source" :key="s.name" class="control">
                      <b-switch v-model="s.value" @input="makeSourceQuery">{{ s.name }}</b-switch>
                    </div>
                  </b-field>
                </template>
              </div>

            </div>
          </transition>
        </div>
        <div class="control">
          <div v-if="!pageLoad" class="help has-text-right" :class="{'is-danger': resultCount == 0}">{{ resultCount }} item<span v-if="resultCount != 1">s</span> found.</div>
        </div>
        <hr style="margin-top:0.25em;">
        
        <div v-if="pageLoad" class="is-loading"></div>
        <!-- Loop through items -->
        <div v-for="item in orderedItems" :key="item.index">
          
          <!-- Item name and rarity -->
          <!-- Only display one item at a time -->
          <a @click="showItem(item.name)">
            <h3 class="title">{{ item.name }}</h3>

            <!-- Rarity and attunement -->
            <h6 class="subtitle is-item-rarity is-size-6 is-italic">
              <span>{{ item.type }}<span v-if="item.subtype"> ({{ item.subtype }})</span>, {{ item.rarity | lowerCase }}</span>

              <!-- Attunement options -->
              <span v-if="item.reqAttune === 'YES'"> (requires attunement)</span>
              <span v-else-if="item.reqAttune"> (requires attunement {{ item.reqAttune | lowerCase }})</span>
            </h6>
          </a>

          <!-- Item description -->
          <transition name="fade-grow" mode="out-in">
            <div v-if="activeItem === item.name">

              <!-- Iterate item entries -->
              <item-entries :model="item.entries" style="margin-bottom: 1em;" />
              <p class="is-italic">{{ item.source }}<span v-if="item.page">, page {{ item.page }}</span></p>
            </div>
          </transition>
          <hr>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import magicItems from '~/data/magic-items.json'
import itemEntries from '~/components/ItemEntries'
import Search from '~/components/Search'

export default {
  components: {
    itemEntries,
    Search
  },
  head () {
    return { title: 'Magic Items' }
  },
  data () {
    return {
      magicItems,
      search: '',
      searchQuery: '',
      count: 10,
      scrollPos: 0,
      prevScroll: 0,
      rarity: [],
      rarityQuery: [],
      source: [],
      sourceQuery: [],
      activeItem: '',
      pageLoad: true,
      collapseFilters: true,
      showFilter: 'Rarity',
      results: Array
    }
  },
  computed: {
    filteredItems: function () {
      return _.filter(this.results, item => {
        return this.rarityQuery.includes(item.rarity) && this.sourceQuery.includes(item.source)
      })
    },
    resultCount: function () {
      return Object.keys(this.filteredItems).length
    },
    orderedItems: function () {
      let orderedItems = _.orderBy(this.filteredItems, 'name')
      return orderedItems.slice(0, this.count)
    },
    rarityFilter: function () {
      return _.map(
        _.filter(this.rarity, rarity => { if (rarity.value) return rarity.name }), 'name')
    },
    sourceFilter: function () {
      return _.map(
        _.filter(this.source, s => { if (s.value) return s.name }), 'name')
    }
  },
  methods: {
    showItem: function (item) {
      // Only display one item at a time
      this.activeItem = this.activeItem === item ? '' : item
    },
    getLists: function (...filterList) { // Generate filter lists from data
      filterList.forEach(filterList => {
        let options = [...new Set(this.magicItems.map(item => item[filterList]))]
        options.forEach(item => { if (!_.includes(filterList, item)) this[filterList].push({ name: item, value: true }) })
      })
    },
    updateData: function (value) { this.results = value },
    loadMore: function (n = 10) {
      this.count += n
    },
    loadFewer: function (n = 10) {
      this.count = this.count - n >= 10 ? this.count - n : 10
    },
    makeRarityQuery: _.debounce(function () { this.rarityQuery = this.rarityFilter }, 300),
    makeSourceQuery: _.debounce(function () { this.sourceQuery = this.sourceFilter }, 300),
    handleScroll: _.throttle(function (event) {
      let d = document.documentElement
      let offset = d.scrollTop + window.innerHeight // Distance scrolled and viewport height
      let height = d.offsetHeight // Total CSS height
      let scrollDir = this.prevScroll - d.scrollTop // scrollDir < 0 = scrolled down
      if (scrollDir < 0) {
        if (offset === height) {
          this.loadMore()
          this.scrollPos = offset
        }
      } else {
        // TODO: Better remove items performance
        if (this.scrollPos >= offset) {
          let m = this.orderedItems.length % 10 === 0 ? 0 : this.orderedItems.length - Math.floor(this.orderedItems.length / 10) * 10
          let x = (Math.floor(this.scrollPos / offset)) * 5 + m
          this.loadFewer(x)
          this.scrollPos = offset - (window.innerHeight * 2)
        }
      }
      this.prevScroll = document.documentElement.scrollTop
    }, 200)
  },
  created: function () {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll)
    }
    this.getLists('rarity', 'source')
    setTimeout(() => {
      this.rarityQuery = this.rarityFilter
      this.sourceQuery = this.sourceFilter
      this.pageLoad = false
    }, 200)
  },
  destroyed: function () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },
  filters: {
    lowerCase: str => str ? str.toLowerCase() : ''
  }
}
</script>

<style lang="scss">
.is-item-rarity {
  padding-top:0.3em;
}

.card {
  border-radius: 2px;
  box-shadow: none;
  &-header {
    .is-active {
      font-weight: 600;
    }
    &-title, {
      padding: 0.36em 0.75em;
    }
  }

  &-footer-item {
    padding: 0.75em;
  }

  &-content {
    padding-bottom: 1.25em;
  }
}
</style>
