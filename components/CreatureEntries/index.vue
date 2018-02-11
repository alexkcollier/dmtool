<template>
  <div>
    <!-- Name, size, type and alignment -->
    <div class="columns is-mobile" style="margin-bottom:0">
      <div class="column">
        <a @click="toggleCreature">
          <h3 class="title">{{ model.name }}</h3>
          <h6 class="subtitle is-size-6 is-creature-type is-italic">
            {{ model.size }} {{ concatType }}, {{ model.alignment }}
          </h6>
        </a>
      </div>

      <!-- Encounter management button -->
      <div class="column is-narrow">
        <button class="button is-text" @click="$store.commit('removeFromEncounter', model)">
          <b-icon icon="minus" />
        </button>
        <button class="button is-primary" @click="$store.commit('addToEncounter', model)">
          <b-icon icon="plus" />
        </button>
      </div>

    </div>
    <transition name="fade-grow">
      <div v-if="!collapse">

        <div class="is-sans-serif">
          <!-- AC/HP/Speed -->
          <template>
            <div>
              <strong>Armor Class</strong>
              {{ model.ac }}
            </div>
            <div>
              <strong>Hit Points</strong>
              {{ model.hp }}
            </div>
            <div>
              <strong>Speed</strong>
              {{ model.speed }}
            </div>
          </template>
          <hr>

          <!-- Stats -->
          <table>
            <thead>
              <th v-for="(stat, k) in model.stats" :key="stat.index" class="is-uppercase has-text-centered">{{ k }}</th>
            </thead>
            <tbody>
              <tr>
                <td v-for="stat in model.stats" :key="stat.index" class="has-text-centered">{{ stat | getStatMod }}</td>
              </tr>
            </tbody>
          </table>
          <hr>

          <!-- Other stats -->
          <template>
            <div v-if="model.save">
              <strong>Saving Throws</strong>
              {{ model.save }}
            </div>
            <div v-if="model.skill" class="is-capitalized">
              <strong>Skills</strong>
              {{ concatSkill }}
            </div>
            <div v-if="model.resist">
              <strong>Damage Resistances</strong>
              {{ model.resist }}
            </div>
            <div v-if="model.immune">
              <strong>Damage Immunities</strong>
              {{ model.immune }}
            </div>
            <div v-if="model.vulnerable">
              <strong>Damage Vulnerabilities</strong>
              {{ model.vulnerable }}
            </div>
            <div v-if="model.conditionImmune">
              <strong>Condition Immunities</strong>
              {{ model.conditionImmune }}
            </div>
            <div>
              <strong>Senses</strong>
              <template v-if="model.senses"> {{ model.senses }},</template>
              passive Perception {{ model.passive }}
            </div>
            <div>
              <strong>Languages</strong>
              <template v-if="model.languages"> {{ model.languages }}</template>
              <template v-else> &mdash;</template>
            </div>
            <div>
              <strong>Challenge</strong>
              {{ model.cr | parseNumToFrac }}
            </div>
          </template>
          <hr>
        </div>
        
        <!-- Creature Traits -->
        <template v-if="model.trait">
          <trait v-for="trait in model.trait" :model="trait" :key="trait.index" />
        </template>

        <!-- Actions -->
        <template v-if="model.action">
          <h2>Actions</h2>
          <trait v-for="action in model.action" :model="action" :key="action.index" />
        </template>

        <!-- Reactions -->
        <template v-if="model.reaction">
          <h2>Reactions</h2>
          <trait v-for="reaction in model.reaction" :model="reaction" :key="reaction.index" />
        </template>

        <!-- Legendary and Lair actions -->
        <!-- TODO: Lair actions -->
        <template v-if="model.legendaryGroup">
          <h2>Legendary Actions</h2>
          <p>The creature can take {{ model.legendary.length }} legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of anohter creature's turn. The creature regains spent legendary actions at the start of its turn.</p>
          
          <trait v-for="legendary in model.legendary" :model="legendary" :key="legendary.index" />
        </template>

        <p class="control is-italic is-help">Source: {{ model.source }}</p>
      </div>
    </transition>
    <hr>
  </div>
</template>

<script>
import Trait from './trait.vue'

export default {
  name: 'creature-entries',
  props: {
    model: Object
  },
  components: {
    Trait
  },
  data () {
    return { collapse: true }
  },
  computed: {
    concatType: function () {
      let r = String
      if (this.model.type.length) {
        // Simple creature type
        r = this.model.type
      } else if (this.model.type.tags) {
        // Creature type has tags
        let tags = this.model.type.tags.join(', ')
        r = `${this.model.type.type} (${tags})`
      } else {
        // Swarms
        r = `swarm of ${this.model.type.swarmSize} ${this.model.type.type}s`
      }
      return r
    },
    concatSkill: function () {
      return this.concatKeyVal(this.model.skill)
    }
  },
  methods: {
    removeFirst: function (arr) {
      let r = arr.slice(1)
      return r.length > 0 ? r : null
    },
    concatKeyVal: function (o) {
      let r = Object.keys(o).reduce((a, k) => {
        return a.concat(k + ' ' + o[k]) // Add combined key-value pair to an array
      }, []).join(', ') // Combine array values to string
      return r
    },
    toggleCreature: function () {
      this.collapse = !this.collapse
      this.$root.$emit('toggle', this.$el.id) // Pass target creature ID to global event bus
    }
  },
  filters: {
    getStatMod: function (stat) {
      let mod = Math.floor((stat - 10) / 2)
      let r = `${stat} (${(mod < 0 ? '' : '+')}\xa0${mod})`
      return r
    },
    parseNumToFrac: num => typeof num === 'number' && num > 0 && num < 1 ? `1/${1 / num}` : num
  },
  mounted () {
    this.$root.$on('toggle', creatureIndex => {
      if (!this.collapse) this.collapse = !(this.$el.id === creatureIndex) // Check if expanded creature is the target creature. If not, collapse it. Only check if creature not collapsed.
    })
  }
}
</script>

<style lang="scss" scoped>
.is-creature-type {
  padding-top:0.3em;
}

.content table td, .content table tr {
  @media screen and (max-width: 768px) {
    padding: 0.5em !important;
  }
}

h6 {
  margin-bottom: 0 !important;
}

hr {
  margin: 0.75rem 0 1.5rem 0;
}

.button {
  @media screen and (max-width: 768px) {
    margin-left: 0;
  }
}
</style>
