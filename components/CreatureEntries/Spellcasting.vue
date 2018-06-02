<template>
  <div>
    <p>
      <strong><em>{{ model.name }}. </em></strong>
      <span v-html="model.headerEntries[0]"/>
    </p>

    <p v-for="(entry, i) in sliceHeaderEntries" :key="i" v-html="entry"/>

    <!-- Slot based spells -->
    <template v-if="model.spells">
      <dl v-for="(level, num) in model.spells" :key="'slot-' + num">
        <dd>{{ formatSpellSlots(num) }} <span v-html="formatSpellList(level.spells)"/></dd>
      </dl>
    </template>

    <!-- At will spells -->
    <dl v-if="model.will">
      <dd>At will: <span v-html="formatSpellList(model.will)"/></dd>
    </dl>

    <!-- Spells with time-based recharge -->
    <template v-if="hasRechargeSpells">
      <template v-for="time in rechargeTimes">
        <template v-if="model[time]">
          <dl v-for="(list, key) in model[time]" :key="key">
            <dd>{{ formatTime(key, time) }} <span v-html="formatSpellList(list)"/></dd>
          </dl>
        </template>
      </template>
    </template>

    <p v-for="(entry, i) in model.footerEntries" :key="i" v-html="entry"/>

  </div>
</template>

<script>
export default {
  name: 'Spellcasting',

  filters: {},

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  data: function() {
    return {
      rechargeTimes: ['daily', 'weekly', 'rest']
    }
  },

  computed: {
    hasRechargeSpells: function() {
      return this.rechargeTimes.some(time => this.model.hasOwnProperty(time))
    },
    sliceHeaderEntries: function() {
      return this.arrRemoveFirst(this.model.headerEntries)
    }
  },

  methods: {
    arrRemoveFirst: function(arr) {
      const r = arr.slice(1)
      return r.length > 0 ? r : null
    },
    formatSpellSlots: function(lvl) {
      let sf = ''
      switch (lvl) {
        case '0':
          return `Cantrips (at will):`

        case '1':
          sf = 'st'
          break

        case '2':
          sf = 'nd'
          break

        case '3':
          sf = 'rd'
          break

        default:
          sf = 'th'
          break
      }
      const slots = this.model.spells[lvl].slots
      return `${lvl}${sf} level (${slots} slot${slots > 1 ? 's' : ''}):`
    },
    formatTime: function(n, type) {
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
      return `${n[0]}/${time} ${n.match(eachRegExp) ? 'each' : ''}:`
    },
    formatSpellList: function(spellList) {
      const spellRegExp = /{@spell\s(.*?)(\|(.*?))?(\|.*?)?}/
      return spellList
        .map(
          el =>
            el.match(spellRegExp) ? `<em>${spellRegExp.exec(el)[1]}</em>` : el
        )
        .join(', ')
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}
</style>
