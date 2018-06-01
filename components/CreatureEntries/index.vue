<template>
  <div>
    <!-- Name, size, type and alignment -->
    <div class="columns is-mobile" style="margin-bottom:0">
      <div class="column">
        <a @click="toggleActive">
          <h3 class="title">{{ model.name }}</h3>
          <h6 class="subtitle is-size-6 is-creature-type is-italic">
            {{ model.size }} {{ concatType }}, {{ model.prettyAlignment }}
          </h6>
        </a>
      </div>

      <!-- Encounter management button -->
      <div class="column is-narrow">
        <div class="is-encounter-buttons">
          <transition name="fade">
            <button
              v-if="encounterIncludesCreature"
              class="button"
              @click="removeFromEncounter(model)">
              <b-icon icon="minus" />
            </button>
          </transition>
          <button 
            v-if="$route.path === '/bestiary'"
            :disabled="encounterIncludesCreature"
            class="button is-primary"
            @click="addToEncounter(model)">
            <b-icon :icon="encounterIncludesCreature ? 'check' : 'plus'" />
          </button>
        </div>
      </div>

    </div>
    <transition name="fade-grow">
      <div v-show="active" :style="{'transition-duration': `${transitionDuration}ms`}">

        <div class="is-sans-serif">
          <!-- AC/HP/Speed -->
          <div>
            <strong>Armor Class</strong> {{ model.ac }}
          </div>
          <div>
            <strong>Hit Points</strong> {{ hp }}
          </div>
          <div>
            <strong>Speed</strong> {{ speed }}
          </div>
          <hr>

          <!-- Stats -->
          <table>
            <thead>
              <th
                v-for="(stat, val) in stats"
                :key="stat.index"
                class="is-uppercase has-text-centered">
                {{ val }}
              </th>
            </thead>
            <tbody>
              <tr>
                <td 
                  v-for="stat in stats" 
                  :key="stat.index" 
                  class="has-text-centered">
                  {{ stat | getStatMod }}
                </td>
              </tr>
            </tbody>
          </table>
          <hr>

          <!-- Other stats -->
          <div v-if="model.save" class="is-capitalized">
            <strong>Saving Throws</strong>
            {{ concatSave }}
          </div>
          <div v-if="model.skill" class="is-capitalized">
            <strong>Skills</strong>
            {{ concatSkill }}
          </div>
          <div v-if="model.resist">
            <strong>Damage Resistances</strong>
            {{ dmgResist }}
          </div>
          <div v-if="model.immune">
            <strong>Damage Immunities</strong>
            {{ dmgImmune }}
          </div>
          <div v-if="model.vulnerable">
            <strong>Damage Vulnerabilities</strong>
            {{ dmgVulnerable }}
          </div>
          <div v-if="model.conditionImmune">
            <strong>Condition Immunities</strong>
            {{ conditionImmune }}
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
            {{ concatCR }}
          </div>
          <hr>
        </div>
        
        <!-- Creature Traits -->
        <template v-if="model.trait">
          <trait v-for="trait in model.trait" :model="trait" :key="trait.index" />
        </template>

        <template v-if="model.spellcasting">
          <spellcasting
            v-for="(entry, index) in model.spellcasting"
            :model="entry"
            :key="index"/>
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
        <template v-if="model.legendaryGroup && model.legendary">
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
import { mapMutations, mapState, mapGetters } from 'vuex'
import Spellcasting from './Spellcasting'
import ToggleActive from '~/mixins/toggle-active-el'
import Trait from './Trait'

export default {
  name: 'CreatureEntries',

  components: {
    Spellcasting,
    Trait
  },

  filters: {
    getStatMod: function(stat) {
      const mod = Math.floor((stat - 10) / 2)
      return `${stat} (${mod < 0 ? '' : '+'}\xa0${mod})` // \xa0 is nbsp
    }
  },

  mixins: [ToggleActive],

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    ...mapState('encounter', {
      encounter: 'encounter'
    }),
    ...mapGetters('encounter', {
      encounterCreatures: 'encounterCreatures'
    }),
    concatCR: function() {
      const { cr, coven, lair } = this.model.cr
      if (typeof this.model.cr === 'string') {
        return this.model.cr
      } else if (coven) {
        return `${cr}; ${coven} when part of a coven`
      } else if (lair) {
        return `${cr}; ${lair} when encountered in its lair`
      }
    },
    concatType: function() {
      const { type, tags, swarmSize } = this.model.type
      if (typeof this.model.type === 'string') {
        return this.model.type
      } else if (tags) {
        return `${type} (${tags.join(', ')})`
      } else {
        // Swarms
        return `swarm of ${swarmSize} ${type}s`
      }
    },
    concatSave: function() {
      return this.concatKeyVal(this.model.save)
    },
    concatSkill: function() {
      const { other, ...skills } = this.model.skill
      // TODO: This will break in the future when Wizards releases other skill possibilities.
      return !other
        ? this.concatKeyVal(skills)
        : `${this.concatKeyVal(
            skills
          )}, plus one of the following: ${this.concatKeyVal(other[0].oneOf)}`
    },
    conditionImmune: function() {
      return this.dmgCon(this.model.conditionImmune, 'immune')
    },
    dmgImmune: function() {
      return this.dmgCon(this.model.immune, 'immune')
    },
    dmgResist: function() {
      return this.dmgCon(this.model.resist, 'resist')
    },
    dmgVulnerable: function() {
      return this.dmgCon(this.model.vulnerable, 'vulnerable')
    },
    encounterIncludesCreature: function() {
      return this.encounterCreatures.includes(this.model.name)
    },
    hp: function() {
      const { average, formula, special } = this.model.hp
      return special || `${average} (${formula})`
    },
    speed: function() {
      let { walk, ...speeds } = this.model.speed
      speeds = Object.keys(speeds).reduce(
        (a, k) =>
          typeof speeds[k] !== 'object'
            ? a.concat(`${k} ${speeds[k]} ft.`)
            : a.concat(`${k} ${speeds[k].number} ft. ${speeds[k].condition}`),
        []
      )
      if (walk && `${walk}` !== '0') {
        if (typeof walk !== 'object') {
          walk = `${walk} ft.`
        } else {
          walk = `${walk.number} ${walk.condition}`
        }
        return [walk, ...speeds].join(', ')
      } else {
        return speeds.join(', ')
      }
    },
    stats: function() {
      // Create stats object
      const { str, dex, con, wis, int, cha } = this.model
      return { str, dex, con, wis, int, cha }
    }
  },

  methods: {
    concatKeyVal: function(o) {
      return Object.keys(o)
        .reduce((a, k) => a.concat(`${k} ${o[k]}`), []) // Add combined key-value pair to an array
        .join(', ') // Combine array values to string
    },
    dmgCon: function(arr, type) {
      // Caches `special` text. Special text should come before `items`
      let pre = []
      // `items` are resistances, vulnerabilites, or immunities
      const items = arr.reduce((a, c) => {
        if (typeof c === 'string') {
          a.push(c)
        } else {
          if (c.special) pre.push(`${c.special}`)
          // TODO: More readable formatting. Commas separate notes from other damage types.
          // non-magical resistances appearing before other types
          if (c[type])
            a.push([c.preNote, this.dmgCon(c[type]), c.note].join(' '))
        }
        return a
      }, [])
      return [...pre, items.join(', ')].join('; ')
    },
    ...mapMutations('encounter', {
      addToEncounter: 'ADD_TO_ENCOUNTER',
      removeFromEncounter: 'REMOVE_FROM_ENCOUNTER'
    })
  }
}
</script>

<style lang="scss" scoped>
.is-creature-type {
  padding-top: 0.3em;
}

.content table {
  @media screen and (max-width: 768px) {
    display: block;
    overflow-x: scroll;
  }

  & td,
  & tr {
    @media screen and (max-width: 768px) {
      padding: 0.5em !important;
    }
  }
}

h6 {
  margin-bottom: 0 !important;
}

hr {
  margin: 0.75rem 0 1.5rem 0;
}

.is-encounter-buttons {
  height: 100%;
  display: flex;
  align-items: center;
}

$fade-time: 200ms;

.fade {
  &-enter-active,
  &-leave-active {
    transition: all $fade-time ease-in-out;
  }
  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
