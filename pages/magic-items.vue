<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>

      <div class="content">
        <h1>Magic Item Search</h1>
        
        <!-- Search box -->
        <b-field>
          <div class="control has-icons-left">
            <input 
              :class="{'is-danger': (!orderedItems.length && !pageLoad)}"
              @keyup="makeSearchQuery"
              v-model="search" 
              class="input"
              type="text"
              placeholder="Search for items">
              <b-icon icon="magnify" size="is-small" class="is-left"></b-icon>
          </div>
        </b-field>

        <div class="card">
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
                  <b-field horizontal grouped group-multiline>
                    <div v-for="level in rarity" :key="level.name" class="control">
                      <b-switch v-model="level.value" @input="makeRarityQuery">{{ level.name }}</b-switch>
                    </div>
                  </b-field>
                </template>

                <!-- Source filter -->
                <template v-else-if="showFilter === 'Source'">
                  <b-field horizontal grouped group-multiline>
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
          <div class="help has-text-right" :class="{'is-danger': resultCount == 0}">{{ resultCount }} item<span v-if="resultCount != 1">s</span> found.</div>
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
              <item-entries :model="item.entries" />
              <p class="is-italic">{{ item.source }}, page {{ item.page }}</p>
            </div>
          </transition>
          <hr>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
import lodash from 'lodash'
import magicItems from '~/data/magic-items.json'
import itemEntries from '~/components/ItemEntries'

export default {
  components: {
    itemEntries
  },
  head () {
    return { title: 'Magic Items' }
  },
  data () {
    return {
      magicItems,
      search: '',
      searchQuery: '',
      rarity: [
        { name: 'Common', value: true },
        { name: 'Uncommon', value: true },
        { name: 'Rare', value: false },
        { name: 'Very Rare', value: false },
        { name: 'Legendary', value: false },
        { name: 'Artifact', value: false }
      ],
      rarityQuery: [],
      source: [
        { name: 'DMG', value: true },
        { name: 'PotA', value: false },
        { name: 'SKT', value: false },
        { name: 'HotDQ', value: false },
        { name: 'CoS', value: false },
        { name: 'RoTOS', value: false },
        { name: 'OotA', value: false },
        { name: 'RoT', value: false },
        { name: 'VGM', value: false },
        { name: 'LMoP', value: false },
        { name: 'TftYP', value: true },
        { name: 'XGE', value: true }
      ],
      sourceQuery: [],
      activeItem: '',
      pageLoad: true,
      collapseFilters: true,
      showFilter: 'Rarity'
    }
  },
  computed: {
    filteredItems () {
      return lodash.filter(this.magicItems, item => {
        return lodash.includes(item.name.toLowerCase(), this.searchQuery.toLowerCase()) &&
          this.rarityQuery.includes(item.rarity) && this.sourceQuery.includes(item.source)
      })
    },
    resultCount () {
      return Object.keys(this.orderedItems).length
    },
    orderedItems () {
      return lodash.orderBy(this.filteredItems, 'name')
    },
    rarityFilter () {
      return lodash.map(
        lodash.filter(this.rarity, rarity => { if (rarity.value) return rarity.name }), 'name')
    },
    sourceFilter () {
      return lodash.map(
        lodash.filter(this.source, (s) => { if (s.value) return s.name }), 'name')
    }
  },
  created () {
    setTimeout(() => {
      this.rarityQuery = this.rarityFilter
      this.sourceQuery = this.sourceFilter
      this.pageLoad = false
      this.compareList('rarity')
      this.compareList('source')
    }, 200)
  },
  methods: {
    showItem (item) {
      // Only display one item at a time
      this.activeItem = this.activeItem === item ? '' : item
      return this.activeItem
    },
    compareList (list) {
      // Create array from object keys
      let current = [...new Set(this[list].map(item => item.name))]
      let incoming = [...new Set(this.items.map(item => item[list]))]

      let missingFromCurrent = []
      let missingFromIncoming = []

      // Check current list
      for (let i = 0; i < incoming.length; i++) {
        if (!lodash.includes(current, incoming[i])) {
          missingFromCurrent.push(incoming[i])
          this[list].push({name: incoming[i], value: false})
        }
      }
      if (missingFromCurrent.length > 0) console.warn('Missing from magic-items.vue', list, 'list', missingFromCurrent)

      // Check incoming list
      for (let i = 0; i < current.length; i++) {
        if (!lodash.includes(incoming, current[i])) {
          missingFromIncoming.push(current[i])
        }
      }
      if (missingFromIncoming.length > 0) console.warn('Missing from items.json', list, 'list', missingFromIncoming)
    },
    makeSearchQuery: lodash.debounce(function () { this.searchQuery = this.search; this.activeItem = '' }, 500),
    makeRarityQuery: lodash.debounce(function () { this.rarityQuery = this.rarityFilter }, 300),
    makeSourceQuery: lodash.debounce(function () { this.sourceQuery = this.sourceFilter }, 300)
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
