<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Spells</h1>

        <search :model="spells" search-field="name" search-type="spells" :filter-fields="filterFields" :filters-to-sort="filterFields" @update-data="updateData" />
        
        <!-- List spells -->
        <spell-entries v-for="spell in sliceSpells" :model="spell" :key="spell.index" :id="spellIndex(spell.name)" />

      </div>
    </div>
  </section>
</template>

<script>
import spells from '~/data/spells.json'
import Search from '~/components/Search'
import SpellEntries from '~/components/SpellEntries'
import _ from 'lodash'

export default {
  head () {
    return { title: 'Spells' }
  },
  components: {
    Search,
    SpellEntries
  },
  data () {
    return {
      spells,
      count: 10,
      results: [],
      scrollPos: 0,
      prevScroll: 0,
      filterFields: ['source', 'level', 'school']
    }
  },
  computed: {
    sliceSpells: function () {
      return this.results.slice(0, this.count)
    }
  },
  methods: {
    updateData: function (value) {
      this.results = value
    },
    spellIndex: function (name) {
      let index = this.results.findIndex(result => result.name === name) + 1
      const id = `spell-${index}`
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
          let m = this.spells.length % 10 === 0 ? 0 : this.spells.length - Math.floor(this.spells.length / 10) * 10
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
    this.spells = this.spells.filter(spell => !spell['source'].includes('UA')) // remove UA spells
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
