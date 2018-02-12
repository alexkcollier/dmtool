<template>
  <div>
    <p>
      <strong><i>{{ model.name }}. </i></strong>
      <span v-html="formatTrait(model.text[0])"></span>
    </p>
    
    <p v-for="p in shiftModel" :key="p.index" v-html="formatTrait(p)"></p>
  </div>
</template>

<script>
export default {
  name: 'model',
  props: {
    model: Object
  },
  computed: {
    shiftModel () {
      let r = this.model.text.slice(1)
      return r.length > 0 ? r : null
    }
  },
  methods: {
    formatTrait: function (str) {
      let spellListRegExp = /^(Cantrip.*\s*|[0-9].*\s*|At will|\d+\/.*):/g
      let labelRegExp = /^(\w+\s*){0,5}:/g
      let attackRegExp = /(Melee|Ranged).*Attack:/g
      if (str.match(spellListRegExp)) {
        let list = str.split(': ')[0]
        let spells = str.split(': ')[1].split(', ')
        let spellDetailRegExp = /\s\(.*\)/g
        spells = spells.map(spell => `<i>${spell.replace(spellDetailRegExp, '')}</i>${spell.match(spellDetailRegExp) ? spell.match(spellDetailRegExp) : ''}`)
        let result = `${list}: ${spells.join(', ')}`
        return result
      } else if (str.match(attackRegExp)) {
        let attackType = str.match(attackRegExp)
        let result = str.replace(attackRegExp, `<i>${attackType}</i>`).replace(/Hit:/, '<i>Hit:</i>')
        return result
      } else if (str.match(labelRegExp)) {
        let label = str.match(labelRegExp)
        let result = str.replace(labelRegExp, `<i>${label}</i>`)
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
  margin-bottom: 1em!important;
}
</style>
