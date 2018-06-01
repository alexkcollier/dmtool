<template>
  <div>
      
    <!-- Paragraphs -->
    <p :key="model.index">
      <strong><i>{{ model.name }}. </i></strong>
      <span v-html="formatEntry(model.entries[0])"/>
    </p>
    
    <template v-for="entry in model.entries.slice(1)">
      <p v-if="!entry.type" :key="entry.index">
        {{ entry }}
      </p>
      
      <!-- Lists -->
      <dl v-else-if="entry.type === 'list'" :key="entry.index">
        <dd v-for="item in entry.items" :key="item.index">
          <strong>{{ item.name }} </strong>
          <span v-html="formatEntry(item.entry)"/>
        </dd>
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
            <td v-for="cell in row" :key="cell.index" v-html="formatEntry(cell)"/>
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
    // TODO: redo this function so it works.
    formatEntry: function(str) {
      // let startRegExp = /\{@[a-z]*\s/g
      // let endRegExp = /(\|[a-z]*)*}/g
      // let result = str.match(startRegExp)
      //   ? str.replace(startRegExp, '<i>').replace(endRegExp, '</i>')
      //   : str
      // let boldRegExp = /^([a-zA-Z]*\s*){1,3}\./g
      // result = result.replace(
      //   boldRegExp,
      //   `<strong><i>${result.match(boldRegExp)} </i></strong>`
      // )
      // return result
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}
</style>
