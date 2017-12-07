<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        dmtool
      </h1>
      <h2 class="subtitle">
        Personal DM tools
      </h2>

      <!-- Create section for each rarity -->
      <div class="items" v-for="level in rarities" :key="level.key" style="text-align:left">

        <!-- Make rarities collapsible -->
        <h2 @click="showRarity == level ? showRarity = null : showRarity = level">{{ level }}</h2>
        <div v-if="showRarity === level">

          <!-- Loop through items -->
          <div v-for="item in items.item" :key="item.name" v-if="item.rarity == level">

            <!-- Make items collapsible -->
            <h3 @click="showItem == item.name ? showItem = null : showItem = item.name">{{ item.name }}</h3>
            <div v-if="showItem === item.name">
              <h4><span v-if="item.wondrous">Wondrous item</span><span v-else>{{ item.type }}</span>, {{ item.rarity }}</h4>
              <p v-for="entry in item.entries" :key="entry.index">{{ entry }}</p>
              <p>{{ item.source }}, page {{ item.page }}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import items from '~/data/items.json'

export default {
  components: {
    Logo
  },
  data () {
    return {
      items,
      showRarity: null,
      showItem: null,
      rarities: {
        unknown: 'Unknown',
        none: 'None',
        uncommon: 'Uncommon',
        common: 'Common',
        rare: 'Rare',
        veryRare: 'Very Rare',
        legendary: 'Legendary',
        artifact: 'Artifact'
      }
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  width:80vw;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
  margin:auto;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.items, .items h2, .items h3 {
  padding-top: 15px;
}

.items h2, .items.h3 {
  cursor: pointer;
}
</style>
