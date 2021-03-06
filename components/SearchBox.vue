<template>
  <!-- Search box -->
  <BField class="is-fixed-mobile">
    <div class="control is-expanded">
      <BInput
        id="search-box"
        v-model="searchTerm"
        autocomplete="off"
        name="search box"
        :class="{ 'is-danger': !queryResult.length }"
        :placeholder="placeholder"
        icon="magnify"
        type="text"
      />
      <label
        class="label sr-only"
        for="search-box"
      >
        Search
      </label>
    </div>

    <div class="control">
      <button
        :disabled="!searchTerm"
        class="clear-button button is-primary"
        style="margin: 0;"
        @click="clearSearch"
      >
        Clear
      </button>
    </div>
  </BField>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  name: 'SearchBox',

  props: {
    searchField: {
      type: String,
      default: 'name',
    },

    searchType: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      collapseFilters: true,
      visibleFilter: '',
    }
  },

  computed: {
    searchTerm: {
      get () {
        return this.$store.state[this.slug].searchString
      },
      set: debounce(function (value) {
        this.$emit('update-data')
        this.$store.commit(`${this.slug}/UPDATE_SEARCH_STRING`, value)
        this.$store.dispatch(`${this.slug}/query`)
      }, 300),
    },

    slug () {
      return this.$route.params.slug
    },

    placeholder () {
      return this.searchType ? `Search for ${this.searchType}s` : 'Search'
    },

    queryResult () {
      return this.$store.state[this.slug].queryResult
    },
  },

  watch: {
    '$route.query.name' () {
      this.searchTerm = this.$route.query.name
    },
  },

  mounted () {
    if (this.$route.query.name) this.searchTerm = this.$route.query.name
  },

  methods: {
    clearSearch () {
      this.searchTerm = ''
      if (this.$route.query.name) this.$router.push({ query: null })
    },
  },
}
</script>

<style lang="scss" scoped>
.is-fixed-mobile {
  @media screen and (max-width: 1023px) {
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05), 0 1px 10px 0 rgba(0, 0, 0, 0.1);
    left: 0;
    margin: 0 auto;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 30;

    .button,
    .input,
    .control {
      border-radius: 0 !important;
    }
  }
}

.clear-button {
  &.is-primary {
    &:disabled {
      background-color: rgb(145, 154, 155);
      opacity: 1;
    }
  }
}
</style>
