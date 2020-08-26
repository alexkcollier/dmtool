<template>
  <div>
    <!-- eslint-disable vue/no-v-html -->
    <p>
      <strong><em>{{ model.name }}. </em></strong>
      <span v-html="model.headerEntries[0]" />
    </p>

    <p
      v-for="(entry, i) in sliceHeaderEntries"
      :key="'header-entry-' + i"
      v-html="entry"
    />

    <!-- Slot based spells -->
    <template v-if="model.spells">
      <dl>
        <dd
          v-for="(level, num) in model.spells"
          :key="'slot-' + num"
        >
          {{ formatSpellSlots(num) }} <span v-html="level.spells.join(', ')" />
        </dd>
      </dl>
    </template>

    <!-- At will spells -->
    <dl v-if="model.will">
      <dd>At will: <span v-html="model.will.join(', ')" /></dd>
    </dl>

    <!-- Spells with time-based recharge -->
    <template v-if="hasRechargeSpells">
      <template v-for="time in rechargeTimes">
        <template v-if="model[time]">
          <dl :key="time">
            <template v-for="(list, key) in model[time]">
              <dd
                v-if="!!list && list.length"
                :key="`${time}-recharge-${key}`"
              >
                {{ formatTime(key, time) }} <span v-html="list && list.join(', ')" />
              </dd>
            </template>
          </dl>
        </template>
      </template>
    </template>

    <p
      v-for="(entry, i) in model.footerEntries"
      :key="'footer-entry-' + i"
      v-html="entry"
    />
  </div>
</template>

<script>
export default {
  name: 'CreatureEntriesSpellcasting',

  filters: {},

  props: {
    model: {
      type: Object,
      default: () => { },
    },
  },

  data () {
    return {
      rechargeTimes: ['daily', 'weekly', 'rest'],
    }
  },

  computed: {
    hasRechargeSpells () {
      return this.rechargeTimes.some(time => this.model.hasOwnProperty(time))
    },

    sliceHeaderEntries () {
      return this.arrRemoveFirst(this.model.headerEntries)
    },
  },

  methods: {
    arrRemoveFirst (arr) {
      const r = arr.slice(1)
      return r.length > 0 ? r : null
    },

    formatSpellSlots (lvl) {
      if (String(lvl) === '0') return 'Cantrips (at will):'

      const suffixes = {
        1: 'st',
        2: 'nd',
        3: 'rd',
      }
      const sfx = suffixes[lvl] || 'th'
      const totalSlots = this.model.spells[lvl].slots || 4
      const slots = totalSlots > 1 ? 'slots' : 'slot'

      return `${lvl}${sfx} level (${totalSlots} ${slots}):`
    },

    formatTime (n, type) {
      const eachRegExp = new RegExp('\\de')
      let time = ''

      switch (type) {
        case 'daily':
          time = 'day'
          break

        case 'weekly':
          time = 'week'
          break

        case 'rest':
          time = 'rest'
          break

        default:
          time = type
          break
      }

      return `${String(n)[0]}/${time} ${String(n).match(eachRegExp) ? 'each' : ''}:`
    },
  },
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}

dd {
  margin-left: 0;
  padding-left: 1em;
  text-indent: -1em;
}

dl,
dd {
  &:not(:last-child) {
    margin-bottom: 0.25em;
  }
}
</style>
