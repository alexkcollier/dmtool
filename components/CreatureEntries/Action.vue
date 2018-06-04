<template>
  <div>
      
    <!-- Paragraphs -->
    <p :key="model.index">
      <strong><i>{{ model.name }}. </i></strong>
      <span v-html="formatActionEntry(model.entries[0])"/>
    </p>
    
    <template v-for="entry in model.entries.slice(1)">
      <p v-if="!entry.type" :key="entry.index">
        {{ entry }}
      </p>
      
      <!-- Lists -->
      <dl v-else-if="entry.type === 'list'" :key="entry.index">
        <template v-for="item in entry.items">
          <dd v-if="item.entry" :key="item.index">
            <strong>{{ item.name }} </strong>
            <span v-html="formatActionEntry(item.entry)"/>
          </dd>
          <dd v-else :key="item.index" v-html="formatActionEntry(item)"/>
        </template>
      </dl>
    
      <!-- Tables -->
      <table v-else-if="entry.type === 'table'" :key="entry.index" class="table">
        <thead>
          <tr>
            <th v-for="label in entry.colLabels" :key="label.index">{{ label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in entry.rows" :key="row.index">
            <td v-for="cell in row" :key="cell.index" v-html="formatActionEntry(cell)"/>
          </tr>
        </tbody>
      </table>

      <!-- Highlight entries of unexpected type. -->
      <p
        v-else
        :key="entry.index"
        style="color: red;">
        {{ entry }}
      </p>
    </template>

  </div>
</template>

<script>
export default {
  name: 'Action',

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    formatActionEntry: function(str) {
      const attackRegExp = /((Melee|Ranged).*Attack:)/g
      const creatureRegExp = /{@creature\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const diceRegExp = /{@dice\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const hitRegExp = /{@hit\s(.*?)(\|(.*?))?(\|.*?)?}/g
      const labelRegExp = /^(\w+\s*){0,5}:/g
      const spellRegExp = /{@spell\s(.*?)(\|(.*?))?(\|.*?)?}/g
      return str
        .replace(/(Hit:)/, '<i>$1</i>')
        .replace(attackRegExp, '<i>$1</i>')
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
