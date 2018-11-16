<template>
  <div class="card">
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
      <div v-if="!collapseFilters">

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
</template>

<script>
export default {
  name: 'FilterPanel',

  filters: {
    // converts decimal to denominator
    parseNumToFrac: num => (typeof num === 'number' && num > 0 && num < 1 ? `1/${1 / num}` : num),
    formatFilterOptionName: str => (str.length <= 2 ? str.toUpperCase() : str)
  },

  props: {
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
    slug() {
      return this.$route.params.slug
    },

    hasFilterApplied() {
      return this.$store.getters[`${this.slug}/hasFilterApplied`]
    },

    filters() {
      if (this.$store.state[this.slug]) return this.$store.state[this.slug].filters
    },

    filterNames() {
      if (this.$store.state[this.slug]) return Object.keys(this.filters)
    }
  },

  methods: {
    toggleCollapse() {
      return new Promise(resolve => {
        this.collapseFilters = !this.collapseFilters
        resolve()
      })
    },

    toggleFilterView() {
      this.toggleCollapse()
        .then(() => {
          if (!this.$store.state[this.slug].hasFilters) {
            const { filterFields } = this
            return this.$store.dispatch(`${this.slug}/initFilters`, { filterFields })
          }
        })
        .then(() => {
          if (!this.visibleFilter) this.visibleFilter = this.filterNames[0]
        })
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
    }
  }
}
</script>

<style lang="scss" scoped>
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

$icon-transition: transform 200ms ease-in-out;

.icon-point {
  transition: $icon-transition;
}

.point-up {
  transform: rotateZ(-180deg);
  transition: $icon-transition;
}
</style>