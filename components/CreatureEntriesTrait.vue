<template>
  <div>
    <p>
      <strong><i>{{ model.name }}. </i></strong>
      <span v-if="model.entries[0].type === 'inline'" v-html="inlineEntryHack(model.entries[0])" />
      <span v-else v-html="$entryHelper.setHtml(model.entries[0])" />
    </p>

    <template v-for="entry in shiftModel">
      <p v-if="!entry.type" :key="entry.index" v-html="$entryHelper.setHtml(entry)" />

      <ul v-else-if="entry.type === 'list'" :key="entry.index">
        <template v-for="item in entry.items">
          <li v-if="item.entry" :key="item.index">
            <strong>{{ item.name }} </strong>
            <span v-html="$entryHelper.setHtml(item.entry)" />
          </li>
          <li v-else :key="item.index" v-html="$entryHelper.setHtml(item)" />
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
            <td v-for="cell in row" :key="cell.index" v-html="$entryHelper.setHtml(cell)" />
          </tr>
        </tbody>
      </table>

    </template>

  </div>
</template>

<script>
export default {
  name: 'CreatureEntriesTrait',

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
    // Super sketchy hack. Definitely won't break in the future.
    inlineEntryHack({ entries }) {
      const text = `${entries[0]} ${entries[1].text} (DMG p.\xa0260) ${entries[2]}`
      return this.$entryHelper.setHtml(text)
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
