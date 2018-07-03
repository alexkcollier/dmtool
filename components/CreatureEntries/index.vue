<template>
  <div class="is-sans-serif">
    <!-- Name, size, type and alignment -->
    <div class="columns is-mobile" style="margin-bottom:0">
      <div class="column">
        <a @click="toggleActive">
          <h3 class="title">{{ model.name }}</h3>
          <h6 class="subtitle is-size-6 is-creature-type is-italic">
            {{ model.size }} {{ concatType }}, {{ model.prettyAlignment }}
          </h6>
          <p class="control is-italic is-help">{{ source }}</p>
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
            v-if="$route.name === 'bestiary'"
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

        <div class="is-sans-serif has-text-red">
          <!-- AC/HP/Speed -->
          <div>
            <strong>Armor Class</strong> {{ armorClass }}
          </div>
          <div>
            <strong>Hit Points</strong> {{ hp }}
          </div>
          <div>
            <strong>Speed</strong> {{ speed }}
          </div>
          <hr>

          <!-- Stats -->
          <table class="has-text-red">
            <thead class="has-text-red">
              <th
                v-for="(stat, val) in stats"
                :key="stat.index"
                class="is-uppercase has-text-centered has-text-red">
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
          <div class="has-text-red">
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
        </div>
        
        <!-- Creature Traits -->
        <template v-if="model.trait">
          <trait v-for="trait in model.trait" :model="trait" :key="trait.index" />
        </template>

        <template v-if="model.spellcasting">
          <spellcasting
            v-for="entry in model.spellcasting"
            :model="entry"
            :key="entry.index"/>
        </template>

        <!-- Actions -->
        <template v-if="model.action">
          <h2 class="is-sans-serif">Actions</h2>
          <Action
            v-for="action in model.action"
            :model="action"
            :key="action.index" />
        </template>

        <!-- Reactions -->
        <template v-if="model.reaction">
          <h2 class="is-sans-serif">Reactions</h2>
          <Action
            v-for="reaction in model.reaction"
            :model="reaction"
            :key="reaction.index" />
        </template>

        <!-- Legendary and Lair actions -->
        <!-- TODO: Lair actions -->
        <template v-if="model.legendaryGroup && model.legendary">
          <h2 class="is-sans-serif">Legendary Actions</h2>
          <p>{{ creatureName }} can take {{ legendaryActionCount }} legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. {{ creatureName }} regains spent legendary actions at the start of its turn.</p>
          
          <Action
            v-for="legendary in model.legendary"
            :model="legendary"
            :key="legendary.index" />
        </template>

      </div>
    </transition>
  </div>
</template>

<script>
import Action from './Action'
import { mapMutations, mapState, mapGetters } from 'vuex'
import Spellcasting from './Spellcasting'
import ToggleActive from '~/mixins/toggle-active-el'
import Trait from './Trait'

export default {
  name: 'CreatureEntries',

  components: {
    Action,
    Spellcasting,
    Trait
  },

  filters: {
    getStatMod: function(stat) {
      const mod = Math.floor((stat - 10) / 2)
      return `${stat} (${mod < 0 ? '' : '+'}${mod})` // \xa0 is nbsp
    }
  },

  mixins: [ToggleActive],

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  data: function() {
    return {
      sizes: {
        T: 'tiny',
        S: 'small',
        M: 'medium',
        L: 'large',
        H: 'huge',
        G: 'gargantuan'
      }
    }
  },

  computed: {
    ...mapState('encounter', {
      encounter: 'encounter'
    }),
    ...mapGetters('encounter', {
      encounterCreatures: 'encounterCreatures'
    }),
    armorClass: function() {
      const { ac } = this.model
      return typeof ac === 'string' ? ac : ac.reduce(this.acToString, '').trim()
    },
    concatCR: function() {
      const { cr, coven, lair } = this.model.cr
      return coven
        ? `${cr}; ${coven} when part of a coven`
        : lair
          ? `${cr}; ${lair} when encountered in its lair`
          : this.model.cr
    },
    concatType: function() {
      const { type, tags, swarmSize } = this.model.type
      return this.model.type.tags
        ? `${type} (${tags.join(', ')})`
        : swarmSize
          ? `swarm of ${this.parseSize(swarmSize)} ${type}s`
          : this.model.type
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
    creatureName: function() {
      return this.model.isNamedCreature ? this.model.name : 'The creature'
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
    legendaryActionCount: function() {
      return this.model.legendaryActions || 3
    },
    source: function() {
      const { page, source, sourceSub } = this.model
      // eslint-disable-next-line
      return `${source}${sourceSub ? ` - ${sourceSub}` : ''}${page ? `, p. ${page}` : ''}`
    },
    speed: function() {
      let { walk, ...speeds } = this.model.speed
      speeds = Object.keys(speeds).map(
        k =>
          typeof speeds[k] === 'object' && speeds[k].condition
            ? `${k} ${speeds[k].number} ft. ${speeds[k].condition}`
            : `${k} ${speeds[k]} ft.`
      )

      walk =
        walk && walk !== 0
          ? typeof walk === 'object' && walk.condition
            ? `${walk.number} ft. ${walk.condition}`
            : `${walk} ft.`
          : ''

      return walk ? [walk, ...speeds].join(', ') : speeds.join(', ')
    },
    stats: function() {
      // Create stats object
      const { str, dex, con, wis, int, cha } = this.model
      return { str, dex, con, wis, int, cha }
    }
  },

  mounted: function() {
    const { name, trait } = this.model

    if (process.env !== 'production' && trait && trait.entries.entries) {
      console.warn(`${name} has entries that not being displayed`)
    }
  },

  methods: {
    concatKeyVal: function(o) {
      return Object.keys(o)
        .map(k => `${k} ${o[k]}`) // Add combined key-value pair to an array
        .join(', ') // Combine array values to string
    },
    dmgCon: function(toParse, type) {
      let nested = false

      const joinConjunct = (arr, conjunctWith) =>
        arr.length === 1
          ? String(arr[0])
          : arr.length === 2
            ? arr.join(` ${conjunctWith} `)
            : `${arr.slice(0, -1).join(', ')} ${conjunctWith} ${arr.slice(-1)}`

      const toString = (it, depth = false) => {
        nested = depth

        if (typeof it === 'string') {
          return it
        } else if (it.special) {
          return it.special
        } else if (it[type]) {
          let stack = it.preNote ? `${it.preNote} ` : ''

          const toJoin = it[type].map(nxt => toString(nxt, true))

          stack += depth
            ? toJoin.join(depth ? '; ' : ', ')
            : joinConjunct(toJoin, 'and')

          stack += it.note ? ` ${it.note}` : ''

          return stack
        }
      }

      return toParse.map(it => toString(it)).join(nested ? '; ' : ', ')
    },
    acToString: function(stack, cur, idx, arr) {
      if (cur.ac) {
        stack += cur.ac
        if (cur.from) stack += ` (${cur.from.join(', ')})`
        if (cur.condition) stack += ` ${cur.condition}`
        if (cur.braces) stack += ')'
      } else {
        stack += cur
      }

      if (arr[idx + 1]) stack += arr[idx + 1].braces ? ' (' : ', '

      const regExp = /{@(spell|item)\s(.*?)(\|(.*?))?(\|.*?)?}/g
      return stack.replace(regExp, '$2')
    },
    parseSize: function(str) {
      return this.sizes.hasOwnProperty(str) ? this.sizes[str] : str
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

  thead th,
  td,
  tr {
    border: none;
    padding: 0;
    &:hover {
      background-color: inherit;
    }
  }

  & td,
  & tr {
    @media screen and (max-width: 768px) {
      padding: 0.5em !important;
    }
  }
}
h2 {
  border-color: #ac1e15;
}

h6 {
  margin-bottom: 0 !important;
}

hr {
  background-color: #ac1e15;
  height: 2px;
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

strong {
  color: inherit;
}
</style>
