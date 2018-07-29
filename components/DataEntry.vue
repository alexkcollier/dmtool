<template>
  <div>

    <!-- Iterate item entries and set up entry types -->
    <template v-for="entry in model">
      
      <!-- Paragraphs -->
      <p 
        v-if="!entry.type"
        :key="entry.index"
        v-html="$entryHelper.setHtml(entry)"/>
      
      <!-- Lists -->
      <ul 
        v-else-if="entry.type === 'list'" 
        :key="entry.index">
        <li 
          v-for="item in entry.items" 
          :key="item.index" 
          v-html="$entryHelper.setHtml(item)"/>
      </ul>

      <!-- Tables -->
      <table 
        v-else-if="entry.type === 'table'" 
        :key="entry.index" 
        class="table">

        <thead>
          <tr>
            <th 
              v-for="label in entry.colLabels" 
              :key="label.index">{{ label }}</th>
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="row in entry.rows" 
            :key="row.index">
            <td 
              v-for="cell in row" 
              :key="cell.index" 
              v-html="$entryHelper.setHtml(cell)"/>
          </tr>
        </tbody>
      </table>

      <!-- Iterate over child entries -->
      <template v-else-if="entry.type === 'entries'" >
        <p v-if="entry.name" :key="entry.index">
          <strong><i>{{ entry.name }}. </i></strong>
          <span v-html="$entryHelper.setHtml(entry.entries[0])"/>
        </p>
        
        <data-entry 
          v-else
          :model="entry.entries.slice(0, 1)" 
          :key="entry.index" />
        <data-entry
          v-if="entry.entries.slice(1).length"
          :model="entry.entries.slice(1)"
          :key="entry.index" />
      </template>

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
  name: 'DataEntry',

  props: {
    model: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    formatEntry(str) {
      if (str.roll) str = str.exact || `${str.min}-${str.max}`
      const inlineTitle = /^(([a-zA-Z]*\s*){1,5}\.)(?=.+)/g
      return this.$entryHelper
        .setHtml(str)
        .replace(inlineTitle, `<strong><i>$1</i></strong>`)
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}
</style>
