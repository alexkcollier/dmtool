<template>
  <div>
    <p>
      <strong><i>{{ model.name }}. </i></strong>
      <span v-html="formatTrait(model.entries[0])"/>
    </p>

    <template v-for="entry in shiftModel">
      <p v-if="!entry.type" :key="entry.index" v-html="formatTrait(entry)"/>

      <ul v-else-if="entry.type === 'list'" :key="entry.index">
        <template v-for="item in entry.items">
          <li v-if="item.entry" :key="item.index">
            <strong>{{ item.name }} </strong>
            <span v-html="formatTrait(item.entry)"/>
          </li>
          <li v-else :key="item.index" v-html="formatTrait(item)"/>
        </template>
      </ul>
    
      <!-- Tables -->
      <table v-else-if="entry.type === 'table'" :key="entry.index" class="table">
        <thead>
          <tr>
            <th v-for="label in entry.colLabels" :key="label.index">{{ label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in entry.rows" :key="row.index">
            <td v-for="cell in row" :key="cell.index" v-html="formatTrait(cell)"/>
          </tr>
        </tbody>
      </table>

    </template>

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
    formatTrait(str) {
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
ul {
  margin-left: 1em;
}
</style>
