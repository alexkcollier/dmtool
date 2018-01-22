<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Bestiary</h1>

        <search :model="bestiary.monster" search-field="name" search-type="creatures" @update-data="updateData" />
        
        <!-- List creatures -->
        <template v-for="creature in results">
          <creature-entries :model="creature" :key="creature.index" />
        </template>

      </div>
    </div>
  </section>
</template>

<script>
import bestiary from '~/data/bestiary.json'
import Search from '~/components/Search'
import CreatureEntries from '~/components/CreatureEntries'

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
      results: Array
    }
  },
  // computed: {
  //   searchable () {
  //     let arr = []
  //     for (let i in this.bestiary.monster) {
  //       arr.push({ 'name': this.bestiary.monster[i].name, 'source': this.bestiary.monster[i].source })
  //     }
  //     return arr
  //   }
  // },
  methods: {
    updateData: function (value) {
      this.results = value
    }
  }
}
</script>

<style>

</style>
