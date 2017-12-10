<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <h2 class="subtitle">
        Personal DM tools
      </h2>

      <div class="content">

        <b-field grouped>
          <div class="control is-expanded has-icons-left">
            <input 
              :class="{'is-danger': !filteredItems.length}"
              @keyup="makeQuery"
              v-model="search" 
              class="input"
              type="text"
              placeholder="Search for items">
              <b-icon icon="magnify" size="is-small" class="is-left"></b-icon>
          </div>
          <!-- TODO: add rarity filter -->
          <!-- <b-switch>Hi</b-switch> -->
        </b-field>
        <hr>

        <!-- Loop through items -->
        <div v-for="item in filteredItems" :key="item.index">
          
          <!-- Item name and rarity -->
          <!-- Only display one item at a time -->
          <div @click="showItem(item.name)" class="">
            <a>
              <h3 class="title">{{ item.name }}</h3>

              <!-- Rarity and attunement -->
              <h6 class="subtitle is-item-rarity is-size-6 is-italic">
                <span v-if="item.wondrous">Wondrous item</span>
                <span v-else>{{ item.type }}</span>
                <span>, {{ item.rarity }}</span>

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
                <table v-else-if="entry.type == 'table'" :key="entry.index">
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
      query: '',
      activeItem: null
    }
  },
  computed: {
    orderedItems () {
      return lodash.orderBy(this.items.item, 'name')
    },
    filteredItems () {
      return lodash.filter(this.orderedItems, (item) => {
        // TODO: Include rarity filter
        return lodash.includes(lodash.toLower(item.name), lodash.toLower(this.query)) &&
        (item.rarity !== 'None') // This sets rarity
      })
    }
  },
  methods: {
    showItem (item) {
      // Only display one item at a time
      if (this.activeItem === item) {
        this.activeItem = null
      } else {
        this.activeItem = item
      }
      return this.activeItem
    },
    makeQuery: lodash.debounce(function () { this.query = this.search; this.activeItem = null }, 500)
  }
}
</script>

<style lang="scss">
.is-item-rarity {
  padding-top:0.3em;
  // margin-bottom: 0!important;
}
</style>
