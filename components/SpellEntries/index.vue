<template>
  <div>
    <a @click="toggleSpell">
      <h3 class="title">{{ model.name }}</h3>
      <h6 class="subtitle is-size-6 is-italic is-spell-level">
        <!-- TODO: present cantrips properly and format numbers -->
        {{ model.level }}-level {{ model.school }}
      </h6>
    </a>
    <transition name="fade-grow">
      <div v-if="!collapse">
        <p><strong>Casting Time: </strong>{{ model.time[0]['number'] }} {{ model.time[0]['unit'] }}</p>
        <p><strong>Range: </strong>{{ model.range.distance.amount }} {{ model.range.distance.type }}</p>
        <p><strong>Components: </strong> {{ spellComponents }}</p>
        <p><strong>Duration: </strong> {{ spellDuration }}</p>
        <spell-entry :model="model.entries" />
        <spell-entry v-if="model.entriesHigherLevel" :model="model.entriesHigherLevel" />
      </div>
    </transition>
    <hr>
  </div>
</template>

<script>
import SpellEntry from './SpellEntry.vue'

export default {
  name: 'spell-entries',
  props: {
    model: Object
  },
  components: {
    SpellEntry
  },
  data () {
    return { collapse: true }
  },
  methods: {
    toggleSpell: function () {
      this.collapse = !this.collapse
      this.$root.$emit('toggle', this.$el.id) // Pass target spell ID to global event bus
    }
  },
  computed: {
    spellComponents: function () {
      let spellComponents = []
      if (this.model.components.v) spellComponents.push('V')
      if (this.model.components.s) spellComponents.push('S')
      if (this.model.components.m) spellComponents.push(`M (${this.model.components.m})`)
      return spellComponents.join(', ')
    },
    spellDuration: function () {
      // Timed spells
      if (this.model.duration[0]['type'] === 'timed') {
        if (this.model.duration[0]['type']['concentration']) {
          return `Concentration, up to ${this.model.duration[0]['duration']['amount']} ${this.model.duration[0]['duration']['type']}`
        } else {
          return `${this.model.duration[0]['duration']['amount']} ${this.model.duration[0]['duration']['type']}`
        }
      }

      // Instantaneous
      if (this.model.duration[0]['type'] === 'instant') return 'Instantaneous'

      // Special
      if (this.model.duration[0]['type'] === 'special') return 'Special'

      // Permanent
      if (this.model.duration[0]['type'] === 'permanent') {
        if (this.model.duration[0]['ends']) {
          if (this.model.duration[0]['ends'].length === 2) {
            return `Until ${this.model.duration[0]['ends'][0]}ed or ${this.model.duration[0]['ends'][1]}ed`
          } else {
            return `Until ${this.model.duration[0]['ends'][0]}ed`
          }
        }
      }
    }
  },
  mounted () {
    this.$root.$on('toggle', spellIndex => {
      if (!this.collapse) this.collapse = !(this.$el.id === spellIndex) // Check if expanded spell is the target spell. If not, collapse it. Only check if spell not collapsed.
    })
  }
}
</script>

<style>
.is-spell-level {
  padding-top:0.3em;
}
</style>
