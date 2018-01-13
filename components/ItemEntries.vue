<template>
  <div>

    <!-- Iterate item entries and set up entry types -->
    <template v-for="entry in model">

      <!-- Subtitles -->
      <h5 v-if="entry.name" :key="entry.name">{{ entry.name }}</h5>

      <!-- Paragraphs -->
      <p v-if="!entry.type" :key="entry.index">{{ entry }}</p>

      <!-- Lists -->
      <ul v-else-if="entry.type === 'list'" :key="entry.index">
        <li v-for="item in entry.items" :key="item.index">{{ item }}</li>
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
            <td v-for="cell in row" :key="cell.index">{{ cell }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Highlight entries of unexpected type. -->
      <p v-else :key="entry.index" style="color: red;">{{ entry }}</p>

      <!-- Iterate over child entries -->
      <display :model="entry.entries" :key="entry.index" />

    </template>
  </div>
</template>

<script>
export default {
  name: 'item-entries',
  props: {
    model: Array
  }
}
</script>
