<template>
  <CollapsePanel
    :name="model.name"
    :info="spellLevelSchool"
    :source="model.source"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <p v-html="`<strong>Casting Time:</strong> ${castingTime}`" />
    <p><strong>Range:</strong> {{ spellRange }}</p>
    <p><strong>Components:</strong> {{ spellComponents }}</p>
    <p><strong>Duration:</strong> {{ spellDuration }}</p>

    <DataEntry :model="model.entries" />

    <DataEntry
      v-if="model.entriesHigherLevel"
      :model="model.entriesHigherLevel"
    />
  </CollapsePanel>
</template>

<script>
import CollapsePanel from '~/components/CollapsePanel'
import DataEntry from '~/components/DataEntry'

export default {
  name: 'SpellEntries',

  components: {
    CollapsePanel,
    DataEntry,
  },

  props: {
    model: {
      type: Object,
      default: () => { },
    },
  },

  computed: {
    castingTime () {
      let time = this.model.time
        .map((t) => {
          let stack = `${t.number} ${t.unit}`

          if (t.condition) stack += ` ${t.condition}`

          return stack
        })
        .join(' or ')

      if (this.model.meta && this.model.meta.ritual) time += ' (ritual)'

      return time
    },

    spellLevelSchool () {
      let sf = ''
      switch (this.model.level) {
        case 'Cantrip':
          return `${this.model.school} ${this.model.level.toLowerCase()}`

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

    spellComponents () {
      const { components } = this.model
      // keys.sort().reverse() ensures order is always v, s, m
      let stack = Object.keys(components)
        .sort()
        .reverse()
        .join(', ')
        .toUpperCase()

      if (components.m) stack += ` (${components.m.text || components.m})`

      return stack
    },

    spellDuration () {
      const { type, concentration, condition, duration, ends } = this.model.duration[0]

      switch (type) {
        case 'timed':
          const dur = `${duration.amount} ${duration.type}`
          return concentration ? `Concentration, up to ${dur}` : dur

        case 'instant':
          return `Instantaneous${condition ? ` (${condition})` : ''}`

        case 'special':
          return 'Special'

        case 'permanent':
          // `ends` can be triggered and/or dispelled
          return ends
            ? ends.length === 2
              ? `Until ${ends[0]}ed or ${ends[1]}ed`
              : `Until ${ends[0]}ed`
            : 'Permanent'

        default:
          return ''
      }
    },

    spellRange () {
      const { distance, type } = this.model.range
      if (type === 'special') return type
      if (distance.amount) return `${distance.amount} ${distance.type}`
      return distance.type
    },
  },
}
</script>
