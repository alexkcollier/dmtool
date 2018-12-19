<template>
  <!-- Result count -->
  <div class="control">
    <div
      :class="{ 'is-danger': !queryResult.length }"
      class="help has-text-right"
    >
      <template v-if="queryResult.length === activeData.length">
        {{ activeData.length }} {{ searchType }}s.
      </template>

      <template v-else>
        {{ queryResult.length }} of {{ activeData.length }} {{ searchType }}s match.
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultCount',

  props: {
    searchType: {
      type: String,
      required: true
    }
  },

  computed: {
    slug() {
      return this.$route.params.slug
    },

    activeData() {
      return this.$store.state[this.slug].data
    },

    queryResult() {
      return this.$store.state[this.slug].queryResult
    }
  }
}
</script>
