<template>
  <CollapsePanel
    :name="model.name"
    :info="itemMeta"
    :source="source"
  >

    <DataEntry :model="model.entries" />
  </CollapsePanel>
</template>

<script>
import CollapsePanel from '~/components/CollapsePanel'
import DataEntry from '~/components/DataEntry'

export default {
  name: 'ItemEntries',

  components: {
    CollapsePanel,
    DataEntry
  },

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    itemMeta() {
      const { type, subtype, rarity, reqAttune } = this.model
      const attuneOptions = reqAttune === 'YES' ? '' : ` ${reqAttune}`
      let stack = type
      if (subtype) stack += ` (${subtype})`
      stack += `, ${rarity}`
      if (reqAttune) stack += ` (requires attunement${attuneOptions})`
      return stack.toLowerCase()
    },

    source() {
      return `${this.model.source}, p. ${this.model.page}`
    }
  }
}
</script>
