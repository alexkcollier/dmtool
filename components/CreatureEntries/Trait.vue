<template>
  <div>
    <p>
      <strong><i>{{ model.name }}. </i></strong>
      <span v-html="formatTrait(model.entries[0])"/>
    </p>
    
    <p v-for="p in shiftModel" :key="p.index" v-html="formatTrait(p)"/>
  </div>
</template>

<script>
export default {
  name: 'Trait',

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    shiftModel() {
      const r = this.model.entries.slice(1)
      return r.length > 0 ? r : null
    }
  },

  methods: {
    formatTrait: function(str) {
      const spellListRegExp = /^(Cantrip.*\s*|[0-9].*\s*|At will|\d+\/.*):/g
      const labelRegExp = /^(\w+\s*){0,5}:/g
      const attackRegExp = /(Melee|Ranged).*Attack:/g
      if (str.match(spellListRegExp)) {
        const list = str.split(': ')[0]
        const spellDetailRegExp = /\s\(.*\)/g
        let spells = str.split(': ')[1].split(', ')
        spells.forEach(
          spell =>
            `<i>${spell.replace(spellDetailRegExp, '')}</i>${
              spell.match(spellDetailRegExp)
                ? spell.match(spellDetailRegExp)
                : ''
            }`
        )
        const result = `${list}: ${spells.join(', ')}`
        return result
      } else if (str.match(attackRegExp)) {
        const attackType = str.match(attackRegExp)
        const result = str
          .replace(attackRegExp, `<i>${attackType}</i>`)
          .replace(/Hit:/, '<i>Hit:</i>')
        return result
      } else if (str.match(labelRegExp)) {
        const label = str.match(labelRegExp)
        const result = str.replace(labelRegExp, `<i>${label}</i>`)
        return result
      } else {
        return str
      }
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}
</style>
