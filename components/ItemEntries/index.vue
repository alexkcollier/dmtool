<template>
  <div>
    <a @click="toggleActive">
      <h3 class="title">{{ model.name }}</h3>
      <h6 class="subtitle is-item-rarity is-size-6 is-italic">
        <span>{{ model.type }}<span v-if="model.subtype"> ({{ model.subtype }})</span>, {{ model.rarity | lowerCase }}</span>

        <!-- Attunement options -->
        <span v-if="model.reqAttune === 'YES'"> (requires attunement)</span>
        <span v-else-if="model.reqAttune"> (requires attunement {{ model.reqAttune | lowerCase }})</span>
      </h6>
    </a>
    <transition name="fade-grow">
      <div v-if="active">

        <!-- Item text -->
        <item-entry :model="model.entries" />

        <!-- Source -->
        <p class="control is-italic is-help">Source: {{ model.source }}, p. {{ model.page }}</p>
      </div>
    </transition>
    <hr>
  </div>
</template>

<script>
import ItemEntry from './ItemEntry.vue'
import ToggleActive from '~/mixins/toggle-active-el'

export default {
  name: 'ItemEntries',

  components: {
    ItemEntry
  },

  filters: {
    lowerCase: function(str) {
      return str ? str.toLowerCase() : ''
    }
  },

  mixins: [ToggleActive],

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.is-item-rarity {
  padding-top: 0.3em;
}
</style>
