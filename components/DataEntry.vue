<template>
  <div>

    <!-- Iterate item entries and set up entry types -->
    <template v-for="entry in model">
      
      <!-- Paragraphs -->
      <p 
        v-if="!entry.type"
        :key="entry.index"
        v-html="formatEntry(entry)"
      />
      
      <!-- Lists -->
      <ul 
        v-else-if="entry.type === 'list'" 
        :key="entry.index"
      >
        <li 
          v-for="item in entry.items" 
          :key="item.index" 
          v-html="formatEntry(item)"
        />
      </ul>

      <!-- Tables -->
      <table 
        v-else-if="entry.type === 'table'" 
        :key="entry.index" 
        class="table"
      >

        <thead>
          <tr>
            <th 
              v-for="label in entry.colLabels" 
              :key="label.index"
              v-html="formatEntry(label)"
            />
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="row in entry.rows" 
            :key="row.index"
          >
            <td 
              v-for="cell in row" 
              :key="cell.index" 
              v-html="formatEntry(cell)"
            />
          </tr>
        </tbody>
      </table>

      <!-- Iterate over child entries -->
      <template v-else-if="entry.type === 'entries'">
        <p v-if="entry.name" :key="entry.index">
          <strong><i>{{ entry.name }}. </i></strong>
          <span v-html="formatEntry(entry.entries[0])" />
        </p>
        
        <data-entry 
          v-else
          :key="entry.index" 
          :model="entry.entries.slice(0, 1)"
        />
        <data-entry
          v-if="entry.entries.slice(1).length"
          :key="entry.index"
          :model="entry.entries.slice(1)"
        />
      </template>

      <!-- Highlight entries of unexpected type. -->
      <p
        v-else
        :key="entry.index"
        style="color: red;"
      >
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

  mounted() {
    this.$el
      .querySelectorAll('a[href*="/magic-items?name="]')
      .forEach(link => link.addEventListener('click', this.lookupFromHref))
  },

  methods: {
    formatEntry(str) {
      const inlineTitle = /^(([a-zA-Z]*\s*){0,3}\.)(?=.+)/g

      if (str.roll) str = str.exact || `${str.roll.min}-${str.roll.max}`

      return this.$entryHelper
        .setHtml(str)
        .replace(inlineTitle, `<strong><i>$1</i></strong>`)
    },

    lookupFromHref(event) {
      event.preventDefault()
      const path = new URLSearchParams(event.target.search).get('name')
      const filters = this.$store.state['magic-items'].filters

      // reset the filters
      Object.values(filters).forEach(filter => {
        filters[filter].forEach((f, optionIndex) => {
          const payload = { filter, optionIndex, value: true }
          this.$store.commit('magic-items/UPDATE_FILTER', payload)
        })
      })

      // search for the clicked item
      this.$store.commit('magic-items/UPDATE_SEARCH_STRING', path)

      // go to /magic-items
      this.$router.push({ path: event.target.pathname })
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}

li /deep/ .link {
  color: darken(#337ab7, 5%);
  display: block;
  font-family: 'ff-scala-sans-pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
    Arial, sans-serif;
  padding: 0.25em 0;

  &:hover {
    color: darken(#337ab7, 25%);
    text-decoration: underline !important;
  }
}
</style>
