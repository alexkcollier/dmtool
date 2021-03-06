<template>
  <div class="card">
    <div class="card-header">
      <!-- Filter collapse control-->
      <a
        class="card-header-title"
        href="#"
        @click.prevent="toggleFilterView"
      >
        <BIcon
          icon="filter"
          size="is-small"
          style="margin-right: 0.25rem;"
          type="is-dark"
        />

        Filters

        <BIcon
          :class="{ 'point-up': !collapseFilters }"
          icon="chevron-down"
          class="icon-point"
        />
      </a>

      <!-- Reset filters -->
      <button
        v-show="hasFilterApplied"
        class="button is-text"
        style="margin: 0.35em 0;"
        @click="resetFilters"
      >
        Reset filters
      </button>
    </div>

    <!-- Filter options display -->
    <Transition name="fade-grow">
      <div v-if="!collapseFilters">
        <!-- Filter options select -->
        <div class="card-header">
          <a
            v-for="(data, filter) in filters"
            :key="filter"
            :class="{ 'is-active': filter === visibleFilter }"
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
          <BField grouped>
            <div class="control">
              <button
                class="control button"
                style="margin-left: 0;"
                @click="setAllOptions(filter, false)"
              >
                Disable all
              </button>
            </div>

            <div
              v-show="filterOptions.some(o => !o.allowed)"
              class="control"
            >
              <button
                class="control button"
                @click="setAllOptions(filter, true)"
              >
                Enable all
              </button>
            </div>
          </BField>

          <BField
            grouped
            group-multiline
          >
            <div
              v-for="(option, index) in filterOptions"
              :key="index"
              class="control"
            >
              <BSwitch
                :value="option.allowed"
                @input="applyFilter(filter, index, $event)"
              >
                {{ option.name | parseNumToFrac }}
              </BSwitch>
            </div>
          </BField>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  name: 'FilterPanel',

  filters: {
    // converts decimal to denominator
    parseNumToFrac: num => (typeof num === 'number' && num > 0 && num < 1 ? `1/${1 / num}` : num),
    formatFilterOptionName: str => (str.length <= 2 ? str.toUpperCase() : str),
  },

  props: {
    filterFields: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      collapseFilters: true,
      visibleFilter: '',
    }
  },

  computed: {
    slug () {
      return this.$route.params.slug
    },

    hasFilterApplied () {
      return this.$store.getters[`${this.slug}/hasFilterApplied`]
    },

    filters () {
      if (this.$store.state[this.slug]) return this.$store.state[this.slug].filters
      return {}
    },
  },

  methods: {
    toggleCollapse () {
      return new Promise((resolve) => {
        this.collapseFilters = !this.collapseFilters
        resolve()
      })
    },

    toggleFilterView () {
      this.toggleCollapse()
        .then(() => {
          if (!this.$store.state[this.slug].hasFilters) {
            const { filterFields } = this
            return this.$store.dispatch(`${this.slug}/initFilters`, { filterFields })
          }
        })
        .then(() => {
          if (!this.visibleFilter) this.visibleFilter = this.filterFields[0]
        })
    },

    resetFilters () {
      this.$emit('update-data')
      this.$store.dispatch(`${this.slug}/resetFilters`).then(this.debounceQuery)
    },

    setAllOptions (filter, value) {
      this.$emit('update-data')
      this.$store.dispatch(`${this.slug}/setAllOptions`, { filter, value }).then(this.debounceQuery)
    },

    applyFilter (filter, optionIndex, value) {
      const payload = { filter, optionIndex, value }
      this.$emit('update-data')
      this.$store.dispatch(`${this.slug}/applyFilter`, payload).then(this.debounceQuery)
    },

    // uses function expression to maintain `this` binding
    debounceQuery: debounce(function () {
      return this.$store.dispatch(`${this.slug}/query`)
    }, 300),
  },
}
</script>

<style lang="scss" scoped>
.button {
  &.is-text {
    &:hover {
      background: 0;
    }
  }
}
</style>
