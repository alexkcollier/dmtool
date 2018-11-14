<template>
  <div>
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

    <!-- Filters -->
    <div v-if="filterFields.length" class="card">
      <div class="card-header">

        <!-- Filter collapse control-->
        <a class="card-header-title" href="#" @click.prevent="toggleFilterView">
          <b-icon
            icon="filter"
            size="is-small"
            style="margin-right:0.25rem;"
            type="is-dark"
          />

          Filters

          <b-icon
            :class="{'point-up': !collapseFilters}"
            icon="chevron-down"
            class="icon-point"
          />
        </a>

        <!-- Reset filters -->
        <button
          v-show="hasFilterApplied"
          class="button is-text"
          @click="resetFilters"
        >
          Reset filters
        </button>
      </div>

      <!-- Filter options display -->
      <transition name="fade-grow">
        <div v-show="!collapseFilters">

          <!-- Filter options select -->
          <div class="card-header">
            <a
              v-for="(data, filter) in filters"
              :key="filter"
              :class="{'is-active': filter === visibleFilter}"
              class="card-footer-item is-capitalized"
              href="#"
              @click.prevent="visibleFilter = filter"
            >
              {{ filter | formatFilterOptionName }}
            </a>
          </div>

          <!-- Filter options -->
          <!-- TODO: improve display -->
          <div
            v-for="(filterOptions, filter) in filters"
            v-show="visibleFilter === filter"
            :key="filter"
            class="card-content"
          >

            <b-field grouped>
              <div class="control">
                <button
                  class="control button"
                  style="margin-left:0;"
                  @click="setAllOptions(filter, false)"
                >
                  Disable all
                </button>
              </div>

              <div v-show="filterOptions.some(o => !o.allowed)" class="control">
                <button
                  class="control button"
                  @click="setAllOptions(filter, true)"
                >
                  Enable all
                </button>
              </div>

            </b-field>

            <b-field grouped group-multiline>
              <div
                v-for="(option, index) in filterOptions"
                :key="index"
                class="control"
              >

                <b-switch :value="option.allowed" @input="applyFilter(filter, index, $event)">
                  {{ option.name | parseNumToFrac }}
                </b-switch>

              </div>
            </b-field>

          </div>

        </div>
      </transition>
    </div>

    <!-- Result count -->
    <div class="control">
      <div :class="{'is-danger': !queryResult.length}" class="help has-text-right">
        <template v-if="queryResult.length === model.length">
          {{ model.length }} {{ searchType }}s.
        </template>
        <template v-else>
          {{ queryResult.length }} of {{ model.length }} {{ searchType }}s match.
        </template>
      </div>
    </div>

    <hr>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'Search',

  filters: {
    // converts decimal to denominator
    parseNumToFrac: num => (typeof num === 'number' && num > 0 && num < 1 ? `1/${1 / num}` : num),
    formatFilterOptionName: str => (str.length <= 2 ? str.toUpperCase() : str)
  },

  props: {
    model: {
      type: Array,
      default: () => []
    },

    searchField: {
      type: String,
      default: 'name'
    },

    searchType: {
      type: String,
      default: ''
    },

    filtersToSort: {
      type: Array,
      default: () => []
    },

    filterFields: {
      type: Array,
      default: () => []
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

    hasFilterApplied() {
      return this.$store.getters[`${this.slug}/hasFilterApplied`]
    },

    filters() {
      return this.$store.state[this.slug].filters
    },

    filterNames() {
      return Object.keys(this.filters)
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

    if (!this.$store.state[this.slug].data.length) {
      this.$store.dispatch(`${this.slug}/initStore`, {
        data: this.model,
        filterFields: this.filterFields
      })
    }

    this.visibleFilter = this.filterNames[0]
  },

  methods: {
    cleanSearchTerm(value) {
      return value ? value.toLowerCase().trim() : ''
    },

    toggleFilterView() {
      this.collapseFilters = !this.collapseFilters
    },

    resetFilters() {
      this.$emit('update-data')
      this.$store.dispatch(`${this.slug}/resetFilters`)
    },

    setAllOptions(filter, value) {
      this.$emit('update-data')
      this.$store.dispatch(`${this.slug}/setAllOptions`, { filter, value })
    },

    applyFilter: function(filter, optionIndex, value) {
      this.$emit('update-data')
      const payload = { filter, optionIndex, value }
      this.$store.commit(`${this.slug}/UPDATE_FILTER`, payload)
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

.card {
  border-radius: 2px;
  box-shadow: none;

  &-header {
    .is-active {
      font-weight: 600;
    }
  }

  &-footer-item {
    padding: 0.75em;
  }

  &-content {
    padding-bottom: 1.25em;
  }
}

.button {
  &.is-text {
    &:hover {
      background: 0;
    }
  }
}

hr {
  margin-top: 0.25em;
}

$icon-transition: transform 200ms ease-in-out;

.icon-point {
  transition: $icon-transition;
}

.point-up {
  transform: rotateZ(-180deg);
  transition: $icon-transition;
}
</style>
