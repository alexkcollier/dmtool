<template>
  <div>
    <p>
      <strong><i>{{ model.name }}. </i></strong>
      <span v-html="attack(model.text[0])"></span>
    </p>
    
    <!-- TODO: Currently does not respect spellcasting (innate or learned) or multi-paragraph models properly. -->
    <p v-for="p in shiftModel" :key="p.index">{{ p }}</p>
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
    attack: function (str) {
      let attackRegExp = /(Melee|Ranged).*Attack:/g
      let attackType = str.match(attackRegExp)
      let result = str.replace(/(Melee|Ranged).*Attack:/g, `<i>${attackType}</i>`).replace(/Hit:/, '<i>Hit:</i>')
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em!important;
}
</style>
