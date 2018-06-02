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
      const creatureRegExp = /{@creature\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const diceRegExp = /{@dice\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const hitRegExp = /{@hit\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const labelRegExp = /^((\w+\s*){0,5}:)/g
      const spellRegExp = /{@spell\s(.*?)(\|(.*?))?(\|.*?)?}/g
      return str
        .replace(creatureRegExp, '<b>$1</b>')
        .replace(diceRegExp, '$1')
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
</style>
