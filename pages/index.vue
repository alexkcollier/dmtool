<template>
  <section class="hero is-primary is-bold is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title is-size-1">
          dmtool
        </h1>
        <h2 class="subtitle is-size-3">
          Personal DM tools
        </h2>
        <nuxt-link to="/magic-items" class="button is-medium">Magic Items</nuxt-link>
      </div>
    </div>
  </section>
</template>

<script>
import lodash from 'lodash'
import items from '~/data/items.json'

export default {
  head () {
    return { title: 'Home' }
  },
  data () {
    return {
      items,
      activeRarity: null,
      activeItem: null,
      rarities: {
        // none: 'None',
        common: 'Common',
        uncommon: 'Uncommon',
        rare: 'Rare',
        veryRare: 'Very Rare',
        legendary: 'Legendary',
        artifact: 'Artifact'
      }
    }
  },
  computed: {
    orderedItems () {
      return lodash.orderBy(this.items.item, 'name')
    }
  },
  methods: {
    showRarity (arg) {
      // Only display one rarity at a time and collapse items when changing rarity
      if (this.activeRarity === arg) {
        this.activeRarity = null
      } else {
        this.activeRarity = arg
      }
      this.activeItem = null
      return [this.activeRarity, this.activeItem]
    },
    showItem (arg) {
      // Only display one item at a time
      if (this.activeItem === arg) {
        this.activeItem = null
      } else {
        this.activeItem = arg
      }
      return this.activeItem
    }
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

.items h2, .items h3 {
  cursor: pointer;
}
</style>
