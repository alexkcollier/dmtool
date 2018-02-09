<template>
  <div>
    <template v-for="entry in model">
      <p v-if="!entry.type">{{ entry }}</p>
      <template v-if="entry.type === 'entries'">
        <p>
          <strong><i>{{ entry.name }}. </i></strong>
          {{ entry.entries[0] }}
        </p>
        <p v-for="entry in entry.entries.slice(1)">
          {{ entry }}
        </p>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'spell-entry',
  props: {
    model: Array
  }
}
</script>

<style lang="scss" scoped>
div:not(:last-child) {
  margin-bottom: 1em!important;
}
</style>
