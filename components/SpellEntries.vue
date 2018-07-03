<template>
  <div>
    <a @click="toggleActive">
      <h3 class="title">{{ model.name }}</h3>
      <h6 class="subtitle is-size-6 is-italic is-spell-level">{{ spellLevelSchool }}</h6>
    </a>
    <transition name="fade-grow">
      <div v-show="active" :style="{'transition-duration': `${transitionDuration}ms`}">
        
        <!-- Spell parameters -->
        <p><strong>Casting Time:</strong> {{ model.time[0].number }} {{ model.time[0].unit }}</p>
        <p><strong>Range:</strong> {{ model.range.distance.amount }} {{ model.range.distance.type }}</p>
        <p><strong>Components:</strong> {{ spellComponents }}</p>
        <p><strong>Duration:</strong> {{ spellDuration }}</p>

        <!-- Spell text -->
        <spell-entry :model="model.entries" />

        <!-- Casting at higher level -->
        <spell-entry v-if="model.entriesHigherLevel" :model="model.entriesHigherLevel" />

        <!-- Source -->
        <p class="control is-italic is-help">Source: {{ model.source }}</p>
      </div>
    </transition>
    <hr>
  </div>
</template>

<script>
import SpellEntry from '~/components/DataEntry'
import ToggleActive from '~/mixins/toggle-active-el'

export default {
  name: 'SpellEntries',

  components: {
    SpellEntry
  },

  mixins: [ToggleActive],

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    spellLevelSchool() {
      let sf = ''
      switch (this.model.level) {
        case 'cantrip':
          return `${this.model.school} ${this.model.level}`

        case 1:
          sf = 'st'
          break

        case 2:
          sf = 'nd'
          break

        case 3:
          sf = 'rd'
          break

        default:
          sf = 'th'
          break
      }
      return `${this.model.level}${sf}-level ${this.model.school}`.toLowerCase()
    },

    spellComponents() {
      const componentList = Object.keys(this.model.components)
        .join(', ')
        .toUpperCase()
      return this.model.components.m
        ? componentList.concat(` (${this.model.components.m})`)
        : componentList
    },

    spellDuration() {
      const { type, concentration, duration, ends } = this.model.duration[0]
      switch (type) {
        case 'timed':
          return concentration
            ? `Concentration, up to ${duration.amount} ${duration.type}`
            : `${duration.amount} ${duration.type}`

        case 'instant':
          return 'Instantaneous'

        case 'special':
          return 'Special'

        case 'permanent':
          // `ends` can be triggered and/or dispelled
          return ends.length === 2
            ? `Until ${ends[0]}ed or ${ends[1]}ed`
            : `Until ${ends[0]}ed`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.is-spell-level {
  padding-top: 0.3em;
  &::first-letter {
    text-transform: capitalize;
  }
}
</style>
