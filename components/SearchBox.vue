<template>
  <!-- Search box -->
  <b-field class="is-fixed-mobile">

    <div class="control is-expanded">
      <b-input
        id="search-box"
        v-model="searchTerm"
        autocomplete="off"
        :class="{'is-danger': !queryResult.length }"
        :placeholder="placeholder"
        icon="magnify"
        type="text"
      />
    </div>

    <div class="control">
      <button
        :disabled="!searchTerm"
        class="clear-button button is-primary"
        style="margin:0;"
        @click="clearSearch"
      >
        Clear
      </button>
    </div>
  </b-field>

</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'Search',

  props: {
    searchField: {
      type: String,
      default: 'name'
    },

    searchType: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      collapseFilters: true,
      visibleFilter: ''
    }
  },

  computed: {
    searchTerm: {
      get() {
        return this.$store.state[this.slug].searchString
      },
      set: debounce(function(value) {
        this.$emit('update-data')
        this.$store.commit(`${this.slug}/UPDATE_SEARCH_STRING`, this.cleanSearchTerm(value))
      }, 300)
    },

    slug() {
      return this.$route.params.slug
    },

    placeholder() {
      return this.searchType ? `Search for ${this.searchType}s` : 'Search'
    },

    queryResult() {
      return this.$store.getters[`${this.slug}/queryResult`]
    }
  },

  watch: {
    '$route.query.name'() {
      this.searchTerm = this.$route.query.name
    }
  },

  mounted() {
    if (this.$route.query.name) this.searchTerm = this.$route.query.name
  },

  methods: {
    cleanSearchTerm(value) {
      return value ? value.toLowerCase().trim() : ''
    },

    clearSearch() {
      this.searchTerm = ''
      if (this.$route.query.name) this.$router.push({ query: null })
    }
  }
}
</script>

<style lang="scss" scoped>
.is-fixed-mobile {
  @media screen and (max-width: 1023px) {
    .button,
    .input,
    .control {
      border-radius: 0 !important;
    }

    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05), 0 1px 10px 0 rgba(0, 0, 0, 0.1);
    left: 0;
    margin: 0 auto;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 30;
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
