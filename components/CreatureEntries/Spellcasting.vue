<template>
  <div>
    <p>
      <strong><em>{{ model.name }}. </em></strong>
      <span v-html="formatEntry(model.headerEntries[0])"/>
    </p>

    <p v-for="(entry, i) in sliceHeaderEntries" :key="'header-entry-' + i" v-html="formatEntry(entry)"/>

    <!-- Slot based spells -->
    <template v-if="model.spells">
      <dl>
        <dd v-for="(level, num) in model.spells" :key="'slot-' + num">
          {{ formatSpellSlots(num) }} <span v-html="formatSpellList(level.spells)"/>
        </dd>
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
          <dl :key="time">
            <dd v-for="(list, key) in model[time]" :key="`${time}-recharge-${key}`">
              {{ formatTime(key, time) }} <span v-html="formatSpellList(list)"/>
            </dd>
          </dl>
        </template>
      </template>
    </template>

    <p v-for="(entry, i) in model.footerEntries" :key="'footer-entry-' + i" v-html="entry"/>

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

  data() {
    return {
      rechargeTimes: ['daily', 'weekly', 'rest']
    }
  },

  computed: {
    hasRechargeSpells() {
      return this.rechargeTimes.some(time => this.model.hasOwnProperty(time))
    },

    sliceHeaderEntries() {
      return this.arrRemoveFirst(this.model.headerEntries)
    }
  },

  methods: {
    arrRemoveFirst(arr) {
      const r = arr.slice(1)
      return r.length > 0 ? r : null
    },

    formatSpellSlots(lvl) {
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

    formatTime(n, type) {
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

    formatSpellList(spellList) {
      const spellRegExp = /{@spell\s(.*?)(\|(.*?))?(\|.*?)?}/
      return spellList
        .map(el => el.replace(spellRegExp, '<em>$1</em>'))
        .join(', ')
    },

    formatEntry(str) {
      const creatureRegExp = /{@creature\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const diceRegExp = /{@dice\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const hitRegExp = /{@hit\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const labelRegExp = /^((\w+\s*){0,5}:)/g
      const noSignHitRegExp = /{@hit\s(\d*?)(\|(.*?))?(\|.*?)?}/g
      const spellRegExp = /{@spell\s(.*?)(\|(.*?))?(\|.*?)?}/g
      return str
        .replace(creatureRegExp, '<b>$1</b>')
        .replace(diceRegExp, '$1')
        .replace(noSignHitRegExp, '+$1')
        .replace(hitRegExp, '$1')
        .replace(labelRegExp, '<i>$1</i>')
        .replace(spellRegExp, '<i>$1</i>')
    }
  }
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
  &:not(:last-child) {
    margin-bottom: 0.25em;
  }
}
</style>
