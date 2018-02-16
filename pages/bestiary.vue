<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        
        <div class="level is-mobile" style="margin:0;">
          <div class="level-left">
            <div class="level-item">
              <h1>Bestiary</h1>
            </div>
          </div>
          <div class="level-right">
            <div class="level-item" style="margin-right:0;">
              <nuxt-link to="/encounter" class="button is-text" style="margin:0 0 1rem 0;">
                Manage Encounter
              </nuxt-link>
            </div>
          </div>
        </div>
        
        <search
          :model="bestiary.monster"
          search-field="name"
          search-type="creature"
          :filter-fields="filterFields"
          :filters-to-sort="filterFields"
          @update-data="updateData"/>
        
        <div v-if="results.length">
          <!-- List creatures -->
          <creature-entries
            v-for="creature in creatures"
            :model="creature"
            :key="creature.index"
            :id="creatureIndex(creature.name)" />
        </div>
        <div v-else class="ampersand"/>

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
  head() {
    return { title: 'Bestiary' }
  },
  components: {
    Search,
    CreatureEntries
  },
  data() {
    return {
      bestiary,
      count: 10,
      results: [],
      scrollPos: 0,
      prevScroll: 0,
      // TODO: filter by type
      filterFields: ['cr', 'size', 'source']
    }
  },
  computed: {
    creatures: function() {
      return this.results.slice(0, this.count)
    }
  },
  created: function() {
    if (typeof window !== 'undefined')
      window.addEventListener('scroll', this.handleScroll)
  },
  destroyed: function() {
    if (typeof window !== 'undefined')
      window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    updateData: function(value) {
      this.results = value
    },
    creatureIndex: function(name) {
      let index = this.results.findIndex(result => result.name === name) + 1
      const id = `creature-${index}`
      return id
    },
    loadMore: function(n = 10) {
      this.count += n
    },
    loadFewer: function(n = 10) {
      this.count = this.count - n >= 10 ? this.count - n : 10
    },
    handleScroll: _.throttle(function(event) {
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
          let m =
            this.creatures.length % 10 === 0
              ? 0
              : this.creatures.length -
                Math.floor(this.creatures.length / 10) * 10
          let x = Math.floor(this.scrollPos / offset) * 5 + m
          this.loadFewer(x)
          this.scrollPos = offset - window.innerHeight * 2
        }
      }
      this.prevScroll = document.documentElement.scrollTop
    }, 200)
  }
}
</script>

<style>

</style>
