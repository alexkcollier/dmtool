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
              <nuxt-link to="/encounter" class="button is-text" style="margin:0 0 1rem 0;">Manage Encounter</nuxt-link>
            </div>
          </div>
        </div>
        
        <search :model="bestiary.monster" search-field="name" search-type="creature" :filter-fields="filterFields" :filters-to-sort="filterFields" @update-data="updateData" />
        
        <div v-if="results.length">
          
          <scroll-view>
            <template slot-scope="visibility">
                <creature-entries
                  v-for="creature in creatures"
                  :model="creature"
                  :key="creature.name"
                  :visible="visibility[`ex${creature.name}`]"
                  :id="creatureIndex(creature.name)"
                  @isVisible="markerVisible"
                  @isNotVisible="markerNotVisible"
                  />
            </template>
          </scroll-view>
          <div style="height:1000px;"></div>
        </div>
        <div v-else class="ampersand"></div>

      </div>
    </div>
  </section>
</template>

<script>
import bestiary from '~/data/bestiary.json'
import Search from '~/components/Search'
import CreatureEntries from '~/components/CreatureEntries'
// import _ from 'lodash'

import Vue from 'vue'

import { $scrollview } from 'vue-scrollview'

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
      count: {
        start: 0,
        end: 10
      },
      results: [],
      scrollPos: 0,
      prevScroll: 0,
      // TODO: filter by type
      filterFields: ['cr', 'size', 'source']
    }
  },
  computed: {
    creatures: function () { return this.results.slice(this.count.start, this.count.end) }
  },
  methods: {
    markerVisible: function () { console.log('yup', this.count) },
    markerNotVisible: function () {
      if ($scrollview.getScrollDirection() === 'UP') this.count.end--
      console.log('nope', this.count)
    },
    updateData: function (value) { this.results = value },
    creatureIndex: function (name) {
      let index = this.results.findIndex(result => result.name === name) + 1
      const id = `creature-${index}`
      return id
    },
    loadMore: function () {
      this.count.end++
      console.log($scrollview)
      Vue.nextTick(() => $scrollview.refresh)
    }
  },
  created: function () {
    // if (typeof window !== 'undefined') window.addEventListener('scroll', $scrollview.refresh)
  },
  mounted: function () {
    $scrollview.onLastEntered = this.loadMore
    this.$root.$on('toggle', () => { $scrollview.state.firedOnLastEntered = false; console.log($scrollview.state.documentHeight, document.body.scrollHeight, document.body.clientHeight, document.body.offsetHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) })
  },
  updated: function () {
  },
  destroyed: function () {
    // if (typeof window !== 'undefined') window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style>

</style>
