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
        <caption
          v-if="entry.caption"
          class="is-small-caps is-size-5 has-text-weight-bold has-text-left"
        >
          {{ entry.caption }}
        </caption>

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
        <p
          v-if="entry.name"
          :key="entry.index"
        >
          <strong><i>{{ entry.name }}. </i></strong>
          <span v-html="formatEntry(entry.entries[0])" />
        </p>

        <DataEntry
          v-else
          :key="entry.index"
          :model="entry.entries.slice(0, 1)"
        />
        <DataEntry
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
      .forEach(link => link.addEventListener('click', event => this.lookupFromHref(event)))
  },

  methods: {
    formatEntry(str) {
      const inlineTitle = /^(([a-zA-Z]*\s*){0,3}\.)(?=.+)/g

      if (str.roll) str = String(str.roll.exact) || `${str.roll.min}-${str.roll.max}`

      return str.replace(inlineTitle, `<strong><i>$1</i></strong>`)
    },

    lookupFromHref(event) {
      event.preventDefault()
      const path = new URLSearchParams(event.target.search).get('name')
      const filters = this.$store.state['magic-items'].filters

      // reset the filters
      Object.keys(filters).forEach(filter => {
        filters[filter].forEach((f, optionIndex) => {
          const payload = { filter, optionIndex, value: true }
          this.$store.commit('magic-items/UPDATE_FILTER', payload)
        })
      })

      // go to /magic-items
      if (this.$route.path !== '/magic-items') this.$router.push({ path: event.target.pathname })
      if (this.$route.query.name) this.$router.push({ query: { name: path } })
      // search for the clicked item
      this.$store.commit('magic-items/UPDATE_SEARCH_STRING', path)
    }
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}

@mixin item-link() {
  color: darken(#337ab7, 5%);
  font-family: 'ff-scala-sans-pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
  padding: 0.25em 0;

  &:hover {
    color: darken(#337ab7, 25%);
    text-decoration: underline !important;
  }
}

/deep/ .link {
  @include item-link();
}
</style>
