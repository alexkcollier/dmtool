<template>
  <div>
    <p><strong><i>{{ model.name }}.</i></strong> {{ model.text[0] }}</p>
    
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
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em!important;
}
</style>
