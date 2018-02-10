<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>

      <div class="content">
        <h1>Magic Item Search</h1>
        
        <!-- Search box -->
        <search :model="magicItems" search-field="name" search-type="magic item" :filter-fields="filterFields" :filters-to-sort="filtersToSort" @update-data="updateData" />

        <!-- Item entries -->
        <item-entries v-for="item in sliceMagicItems" :model="item" :key="item.index" :id="itemIndex(item.name)"/>

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
      filterFields: ['rarity', 'type', 'source'],
      filtersToSort: ['source', 'type']
    }
  },
  computed: {
    sliceMagicItems: function () { return this.results.slice(0, this.count) }
  },
  methods: {
    itemIndex: function (name) {
      let index = this.results.findIndex(result => result.name === name) + 1
      const id = `item-${index}`
      return id
    },
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
  }
}
</script>

<style lang="scss">
</style>
