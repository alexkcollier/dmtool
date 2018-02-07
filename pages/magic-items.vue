<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>

      <div class="content">
        <h1>Magic Item Search</h1>
        
        <!-- Search box -->
        <search :model="magicItems" search-field="name" search-type="items" :filter-fields="filterFields" @update-data="updateData" />

        <!-- Loop through items -->
        <div v-for="item in sliceMagicItems" :key="item.index">
          
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
import ItemEntries from '~/components/ItemEntries'
import Search from '~/components/Search'

export default {
  components: {
    ItemEntries,
    Search
  },
  head () {
    return { title: 'Magic Items' }
  },
  data () {
    return {
      magicItems,
      count: 10,
      scrollPos: 0,
      prevScroll: 0,
      activeItem: '',
      results: [],
      filterFields: ['rarity', 'source']
    }
  },
  computed: {
    sliceMagicItems: function () { return this.results.slice(0, this.count) }
  },
  methods: {
    showItem: function (item) { this.activeItem = this.activeItem === item ? '' : item }, // Only display one item at a time
    updateData: function (value) { this.results = value },
    loadMore: function (n = 10) { this.count += n },
    loadFewer: function (n = 10) { this.count = this.count - n >= 10 ? this.count - n : 10 },
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
          let m = this.sliceMagicItems.length % 10 === 0 ? 0 : this.sliceMagicItems.length - Math.floor(this.sliceMagicItems.length / 10) * 10
          let x = (Math.floor(this.scrollPos / offset)) * 10 + m
          this.loadFewer(x)
          this.scrollPos = offset - (window.innerHeight * 2)
        }
      }
      this.prevScroll = document.documentElement.scrollTop
    }, 200)
  },
  created: function () {
    if (typeof window !== 'undefined') window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function () {
    if (typeof window !== 'undefined') window.removeEventListener('scroll', this.handleScroll)
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
</style>
