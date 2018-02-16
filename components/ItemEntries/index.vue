<template>
  <div>
    <a @click="toggleItem">
      <h3 class="title">{{ model.name }}</h3>
      <h6 class="subtitle is-item-rarity is-size-6 is-italic">
        <span>{{ model.type }}<span v-if="model.subtype"> ({{ model.subtype }})</span>, {{ model.rarity | lowerCase }}</span>

        <!-- Attunement options -->
        <span v-if="model.reqAttune === 'YES'"> (requires attunement)</span>
        <span v-else-if="model.reqAttune"> (requires attunement {{ model.reqAttune | lowerCase }})</span>
      </h6>
    </a>
    <transition name="fade-grow">
      <div v-if="!collapse">

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
  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return { collapse: true }
  },
  mounted() {
    this.$root.$on('toggle', itemIndex => {
      if (!this.collapse) this.collapse = !(this.$el.id === itemIndex) // Check if expanded item is the target item. If not, collapse it. Only check if item not collapsed.
    })
  },
  methods: {
    toggleItem: function() {
      this.collapse = !this.collapse
      this.$root.$emit('toggle', this.$el.id) // Pass target item ID to global event bus
    }
  }
}
</script>

<style lang="scss" scoped>
.is-item-rarity {
  padding-top: 0.3em;
}
</style>
