<template>
  <!-- eslint-disable vue/no-v-html -->
  <div>
    <!-- Paragraphs -->
    <p :key="model.index">
      <strong><i>{{ model.name }}. </i></strong>
      <span v-html="model.entries[0]" />
    </p>

    <template v-for="entry in model.entries.slice(1)">
      <p
        v-if="!entry.type"
        :key="entry.index"
        v-html="entry"
      />

      <!-- Lists -->
      <dl
        v-else-if="entry.type === 'list'"
        :key="entry.index"
      >
        <template v-for="item in entry.items">
          <dd
            v-if="item.entry"
            :key="item.index"
          >
            <strong>{{ item.name }} </strong>
            <span v-html="item.entry" />
          </dd>
          <dd
            v-else
            :key="item.index"
            v-html="item"
          />
        </template>
      </dl>

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
            >
              {{ label }}
            </th>
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
              v-html="cell"
            />
          </tr>
        </tbody>
      </table>

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
  name: 'CreatureEntriesAction',

  props: {
    model: {
      type: Object,
      default: () => { },
    },
  },
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em !important;
}

dd {
  margin-left: 0;
  padding-left: 1em;
  text-indent: -1em;
}
</style>
