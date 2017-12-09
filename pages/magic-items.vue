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
        <div class="columns">
          <div class="column">
            <form>
              <input class="input" type="text" @keyup="makeQuery" v-model="search" placeholder="Search for items"/>
            </form>
            <!-- Loop through items -->
            <div v-for="item in filteredItems" :key="item.index">
              <!-- Only display one item at a time -->
              <h3 @click="showItem(item.name)">{{ item.name }}</h3>
              <transition name="fade-grow">
                <div v-if="activeItem === item.name">

                  <!-- Item types, rarity, and attunement -->
                  <h4>
                    <span v-if="item.wondrous">Wondrous item</span>
                    <span v-else>{{ item.type }}</span>
                    <span>, {{ item.rarity }}</span>

                    <!-- Attunement options -->
                    <span v-if="item.reqAttune === 'YES'"> (requires attunement)</span>
                    <span v-else-if="item.reqAttune"> (requires attunement {{ item.reqAttune }})</span>
                  </h4>

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
                  <hr>
                </div>
              </transition>
            </div>
          </div>
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
        // startsWithis faster, but includes gives better results
        return lodash.includes(lodash.toLower(item.name), lodash.toLower(this.query))
      })
    }
  },
  methods: {
    showItem (arg) {
      // Only display one item at a time
      if (this.activeItem === arg) {
        this.activeItem = null
      } else {
        this.activeItem = arg
      }
      return this.activeItem
    },
    makeQuery: lodash.debounce(function () { this.query = this.search }, 500)
  }
}
</script>

<style lang="scss">
$fade-time: 500ms;

.fade-grow {
  &-enter-active, &-leave-active {
    transition: all $fade-time ease-in-out;
    max-height: 300vh;
    overflow: hidden;
  }
  &-enter, &-leave-to {
    max-height: 0;
    opacity: 0;
  }
}
.height-0 { height: 0; }
.items h2, .items h3 {
  cursor: pointer;
}
</style>
