<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Bestiary</h1>

        <search :model="bestiary.monster" search-field="name" search-type="creatures" :filter-fields="filterFields" @update-data="updateData" />
        
        <!-- List creatures -->
        <template v-for="creature in creatures">
          <creature-entries :model="creature" :key="creature.index" :id="creatureIndex(creature.name)" />
        </template>

      </div>
    </div>
  </section>
</template>

<script>
import bestiary from '~/data/bestiary.json'
import Search from '~/components/Search'
import CreatureEntries from '~/components/CreatureEntries'
import _ from 'lodash'

export default {
  head () {
    return { title: 'Bestiary' }
  },
  components: {
    Search,
    CreatureEntries
  },
  data () {
    return {
      bestiary,
      count: 10,
      results: [],
      scrollPos: 0,
      prevScroll: 0,
      filterFields: ['source']
    }
  },
  computed: {
    creatures: function () {
      return this.results.slice(0, this.count)
    }
  },
  methods: {
    updateData: function (value) {
      this.results = value
    },
    creatureIndex: function (name) {
      let index = this.results.findIndex(result => result.name === name) + 1
      const id = `creature-${index}`
      return id
    },
    loadMore: function (n = 10) {
      this.count += n
    },
    loadFewer: function (n = 10) {
      this.count = this.count - n >= 10 ? this.count - n : 10
    },
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
          let m = this.creatures.length % 10 === 0 ? 0 : this.creatures.length - Math.floor(this.creatures.length / 10) * 10
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
  },
  destroyed: function () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
}
</script>

<style>

</style>
