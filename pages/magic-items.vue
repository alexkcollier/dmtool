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
          <div @click="showItem(item.name)">
            <a>
              <h3 class="title">{{ item.name }}</h3>

              <!-- Rarity and attunement -->
              <h6 class="subtitle is-item-rarity is-size-6 is-italic">
                <span>{{ item.type }}, {{ item.rarity | lowerCase }}</span>

                <!-- Attunement options -->
                <span v-if="item.reqAttune === 'YES'"> (requires attunement)</span>
                <span v-else-if="item.reqAttune"> (requires attunement {{ item.reqAttune }})</span>
              </h6>
            </a>
          </div>

          <!-- Item description -->
          <transition name="fade-grow" mode="out-in">
            <div v-if="activeItem === item.name" :key="item.name">

              <!-- Iterate item entries -->
              <!-- TODO: cleaner implementation -->
              <template v-for="entry in item.entries" >

                <!-- Paragraphs -->
                <p v-if="!entry.type" :key="entry.index">
                  {{ entry }}
                </p>

                <!-- Lists -->
                <ul v-else-if="entry.type =='list'" :key="entry.index">
                  <li v-for="item in entry.items" :key="item.index">{{ item }}</li>
                </ul>

                <!-- Tables -->
                <table v-else-if="entry.type == 'table'" :key="entry.index" class="table">
                  <thead>
                    <tr>
                      <th v-for="label in entry.colLabels" :key="label.index">{{ label }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in entry.rows" :key="row.index">
                      <td v-for="cell in row" :key="cell.index">{{ cell }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Entries -->
                <template v-else-if="entry.type =='entries'">
                  <h5 :key="entry.name">{{ entry.name }}</h5>
                  <template v-for="entry in entry.entries">

                    <!-- Lists -->
                    <ul v-if="entry.type =='list'" :key="entry.index">
                      <li v-for="item in entry.items" :key="item.index">{{ item }}</li>
                    </ul>

                    <!-- Paragraphs -->
                    <p v-else :key="entry.index">
                      {{ entry }}
                    </p>

                  </template>
                </template>

                <!-- Highlight entries of unexpected type. -->
                <p v-else :key="entry.index" style="color: red;">{{ entry }}</p>

              </template>
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
import items from '~/data/items.json'

export default {
  head () {
    return { title: 'Magic Items' }
  },
  data () {
    return {
      items,
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
      return lodash.filter(this.items.item, (item) => {
        return lodash.includes(item.name.toLowerCase(), this.searchQuery.toLowerCase()) &&
          this.rarityQuery.includes(item.rarity) && this.sourceQuery.includes(item.source)
      })
    },
    resultCount () {
      var o = this.orderedItems
      var ol = Object.keys(o)
      return ol.length
    },
    orderedItems () {
      return lodash.orderBy(this.filteredItems, 'name')
    },
    rarityFilter () {
      return lodash.map(
        lodash.filter(this.rarity, (rarity) => {
          if (rarity.value === true) {
            return rarity.name
          }
        }), 'name'
      )
    },
    sourceFilter () {
      return lodash.map(
        lodash.filter(this.source, (s) => {
          if (s.value === true) {
            return s.name
          }
        }), 'name'
      )
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
      if (this.activeItem === item) {
        this.activeItem = ''
      } else {
        this.activeItem = item
      }
      return this.activeItem
    },
    compareList (list) {
      // Create array from object keys
      var current = [...new Set(this[list].map(item => item.name))]
      var incoming = [...new Set(this.items.item.map(item => item[list]))]

      var missingFromCurrent = []
      var missingFromIncoming = []

      // Check current list
      for (let i = 0; i < incoming.length; i++) {
        if (!lodash.includes(current, incoming[i])) {
          missingFromCurrent.push(incoming[i])
          this[list].push({name: incoming[i], value: false})
        }
      }
      if (missingFromCurrent.length > 0) { console.warn('Missing from magic-items.vue', list, 'list', missingFromCurrent) }

      // Check incoming list
      for (let i = 0; i < current.length; i++) {
        if (!lodash.includes(incoming, current[i])) {
          missingFromIncoming.push(current[i])
        }
      }
      if (missingFromIncoming.length > 0) { console.warn('Missing from items.json', list, 'list', missingFromIncoming) }
    },
    makeSearchQuery: lodash.debounce(function () { this.searchQuery = this.search; this.activeItem = '' }, 500),
    makeRarityQuery: lodash.debounce(function () { this.rarityQuery = this.rarityFilter }, 300),
    makeSourceQuery: lodash.debounce(function () { this.sourceQuery = this.sourceFilter }, 300)
  },
  filters: {
    lowerCase: str => {
      if (!str) return ''
      return str.toLowerCase()
    }
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
