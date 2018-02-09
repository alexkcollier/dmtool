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
        <p><strong>Components: </strong> {{ spellDuration }}</p>
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
      if (this.model.duration[0]['type'] === 'timed') return `${this.model.duration[0]['duration']['amount']} ${this.model.duration[0]['duration']['type']}`
      if (this.model.duration[0]['type'] === 'instant') return 'Instantaneous'
      if (this.model.duration[0]['type'] === 'special') return 'Special'
      /* TODO: Permanent spells
      ** permanent
      ** permanent-dispell
      ** permanent-trigger
      */
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
