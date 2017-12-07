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
      <div style="text-align:left">
        <h2 @click="showNone = !showNone">None</h2>
        <ul v-if="showNone" v-for="item in items.item" :key="item.name">
          <li v-if="item.rarity=='None'">
            {{ item.name }} - {{ item.rarity }}
          </li>
        </ul>
        <h2 @click="showCommon = !showCommon">Common</h2>
        <ul v-if="showCommon" v-for="item in items.item" :key="item.name">
          <li v-if="item.rarity=='Common'">
            {{ item.name }} - {{ item.rarity }}
          </li>
        </ul>
        <h2 @click="showUncommon = !showUncommon">Uncommon</h2>
        <ul v-if="showUncommon" v-for="item in items.item" :key="item.name">
          <li v-if="item.rarity=='Uncommon'">
            {{ item.name }} - {{ item.rarity }}
          </li>
        </ul>
        <h2 @click="showRare = !showRare">Rare</h2>
        <ul v-if="showRare" v-for="item in items.item" :key="item.name">
          <li v-if="item.rarity=='Rare'">
            {{ item.name }} - {{ item.rarity }}
          </li>
        </ul>
        <h2 @click="showVeryRare = !showVeryRare">Very Rare</h2>
        <ul v-if="showVeryRare" v-for="item in items.item" :key="item.name">
          <li v-if="item.rarity=='Very Rare'">
            {{ item.name }} - {{ item.rarity }}
          </li>
        </ul>
        <h2 @click="showLegendary = !showLegendary">Legendary</h2>
        <ul v-if="showLegendary" v-for="item in items.item" :key="item.name">
          <li v-if="item.rarity=='Legendary'">
            {{ item.name }} - {{ item.rarity }}
          </li>
        </ul>
        <h2 @click="showArtifact = !showArtifact">Artifact</h2>
        <ul v-if="showArtifact" v-for="item in items.item" :key="item.name">
          <li v-if="item.rarity=='Artifact'">
            {{ item.name }} - {{ item.rarity }}
          </li>
        </ul>
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
      showNone: false,
      showCommon: false,
      showUncommon: false,
      showRare: false,
      showVeryRare: false,
      showLegendary: false,
      showArtifact: false
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  widht:80vw;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  text-align: left;
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

.links {
  padding-top: 15px;
}
</style>
