<template>
  <div>

    <!-- Iterate item entries and set up entry types -->
    <template v-for="entry in model">
      
      <!-- Paragraphs -->
      <p v-if="!entry.type" :key="entry.index" v-html="formatEntry(entry)"/>
      
      <!-- Lists -->
      <ul v-else-if="entry.type === 'list'" :key="entry.index">
        <li v-for="item in entry.items" :key="item.index" v-html="formatEntry(item)"/>
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
            <td v-for="cell in row" :key="cell.index" v-html="formatEntry(cell)"/>
          </tr>
        </tbody>
      </table>

      <!-- Iterate over child entries -->
      <template v-else-if="entry.type === 'entries'" >
        <p v-if="entry.name" :key="entry.index">
          <strong><i>{{ entry.name }}. </i></strong>
          <span v-html="formatEntry(entry.entries[0])"/>
        </p>
        <data-entry v-else :model="entry.entries.slice(0, 1)" :key="entry.index" />
        <data-entry
          v-if="entry.entries.slice(1).length"
          :model="entry.entries.slice(1)"
          :key="entry.index" />
      </template>

      <!-- Highlight entries of unexpected type. -->
      <p v-else :key="entry.index" style="color: red;">{{ entry }}</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'DataEntry',

  props: {
    model: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    formatEntry(str) {
      let startRegExp = /\{@[a-z]*\s/g
      let endRegExp = /(\|[a-z]*)*}/g
      let result = str.match(startRegExp)
        ? str.replace(startRegExp, '<i>').replace(endRegExp, '</i>')
        : str
      let boldRegExp = /^([a-zA-Z]*\s*){1,3}\./g
      result = result.replace(
        boldRegExp,
        `<strong><i>${result.match(boldRegExp)} </i></strong>`
      )
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}
</style>
