<template>
  <CollapsePanel
    :name="model.name"
    :info="creatureMeta"
    :source="source"
    class="is-sans-serif">

    <div slot="col2" class="column is-narrow">
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
      <table>

        <thead>
          <tr>
            <th
              v-for="(stat, val) in stats"
              :key="stat.index"
              class="is-uppercase has-text-centered has-text-red">
              {{ val }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td 
              v-for="stat in stats" 
              :key="stat.index" 
              class="has-text-centered has-text-red">
              {{ stat | getStatMod }}
            </td>
          </tr>
        </tbody>

      </table>
      <hr>

      <!-- Other stats -->
      <div class="has-text-red">
        <div v-if="model.save" class="is-capitalized">
          <strong>Saving Throws</strong> {{ concatSave }}
        </div>

        <div v-if="model.skill" class="is-capitalized">
          <strong>Skills</strong> {{ concatSkill }}
        </div>

        <div v-if="model.resist">
          <strong>Damage Resistances</strong> {{ dmgResist }}
        </div>

        <div v-if="model.immune">
          <strong>Damage Immunities</strong> {{ dmgImmune }}
        </div>

        <div v-if="model.vulnerable">
          <strong>Damage Vulnerabilities</strong> {{ dmgVulnerable }}
        </div>

        <div v-if="model.conditionImmune">
          <strong>Condition Immunities</strong> {{ conditionImmune }}
        </div>

        <div>
          <strong>Senses</strong> {{ senses }}
        </div>

        <div>
          <strong>Languages</strong> {{ languages }}
        </div>

        <div>
          <strong>Challenge</strong> {{ concatCR }}
        </div>
        <hr>
      </div>
    </div>
        
    <template v-if="model.trait">
      <Trait v-for="trait in model.trait" :model="trait" :key="trait.index" />
    </template>

    <template v-if="model.spellcasting">
      <Spellcasting
        v-for="entry in model.spellcasting"
        :model="entry"
        :key="entry.index"/>
    </template>

    <template v-if="model.action">
      <h2 class="is-sans-serif">Actions</h2>
      <Action
        v-for="action in model.action"
        :model="action"
        :key="action.index" />
    </template>

    <template v-if="model.reaction">
      <h2 class="is-sans-serif">Reactions</h2>
      <Action
        v-for="reaction in model.reaction"
        :model="reaction"
        :key="reaction.index" />
    </template>

    <!-- TODO: Lair actions -->
    <template v-if="model.legendaryGroup && model.legendary">
      <h2 class="is-sans-serif">Legendary Actions</h2>
      <p>{{ creatureName }} can take {{ legendaryActionCount }} legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature's turn. {{ creatureName }} regains spent legendary actions at the start of its turn.</p>
          
      <Action
        v-for="legendary in model.legendary"
        :model="legendary"
        :key="legendary.index" />
    </template>

  </CollapsePanel>
</template>

<script>
import Action from '~/components/CreatureEntriesAction'
import Spellcasting from '~/components/CreatureEntriesSpellcasting'
import Trait from '~/components/CreatureEntriesTrait'
import CollapsePanel from '~/components/CollapsePanel'
import { mapMutations, mapState, mapGetters } from 'vuex'

export default {
  name: 'CreatureEntries',

  components: {
    Action,
    CollapsePanel,
    Spellcasting,
    Trait
  },

  filters: {
    getStatMod(stat) {
      const mod = Math.floor((stat - 10) / 2)
      return `${stat} (${mod < 0 ? '' : '+'}${mod})` // \xa0 is nbsp
    }
  },

  props: {
    model: {
      type: Object,
      default: () => {}
    }
  },

  data() {
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

    armorClass() {
      const { ac } = this.model
      return typeof ac === 'string' ? ac : ac.reduce(this.acToString, '').trim()
    },

    concatCR() {
      const { cr, coven, lair } = this.model.cr
      if (coven) return `${cr}; ${coven} when part of a coven`
      if (lair) return `${cr}; ${lair} when encountered in its lair`
      return this.model.cr
    },

    concatType() {
      const { type, tags, swarmSize } = this.model.type
      if (tags) return `${type} (${tags.join(', ')})`
      if (swarmSize) return `swarm of ${this.parseSize(swarmSize)} ${type}s`
      return this.model.type
    },

    concatSave() {
      return this.concatKeyVal(this.model.save)
    },

    concatSkill() {
      const { other, ...skills } = this.model.skill
      let st = this.concatKeyVal(skills)

      if (other) {
        other.map(el => {
          const { oneOf: sk } = el
          if (sk) st += `, plus one of the following: ${this.concatKeyVal(sk)}`
        })
      }

      return st
    },

    conditionImmune() {
      return this.dmgCon(this.model.conditionImmune, 'immune')
    },

    creatureMeta() {
      const { size, prettyAlignment } = this.model
      return `${size} ${this.concatType}, ${prettyAlignment}`
    },

    creatureName() {
      return this.model.isNamedCreature ? this.model.name : 'The creature'
    },

    dmgImmune() {
      return this.dmgCon(this.model.immune, 'immune')
    },

    dmgResist() {
      return this.dmgCon(this.model.resist, 'resist')
    },

    dmgVulnerable() {
      return this.dmgCon(this.model.vulnerable, 'vulnerable')
    },

    encounterIncludesCreature() {
      return this.encounterCreatures.includes(this.model.name)
    },

    hp() {
      const { average, formula, special } = this.model.hp
      return special || `${average} (${formula})`
    },

    languages() {
      return this.model.languages || '—'
    },

    legendaryActionCount() {
      return this.model.legendaryActions || 3
    },

    senses() {
      const { senses, passive } = this.model
      const passiveStr = `passive Perception ${passive}`
      return senses ? `${senses}, ${passiveStr}` : passiveStr
    },

    source() {
      const { page, source, sourceSub } = this.model
      // eslint-disable-next-line
      return `${source}${sourceSub ? ` - ${sourceSub}` : ''}${page ? `, p. ${page}` : ''}`
    },

    speed() {
      let { walk, ...speeds } = this.model.speed

      walk =
        walk && !!walk
          ? typeof walk === 'object' && walk.condition
            ? `${walk.number} ft. ${walk.condition}`
            : `${walk} ft.`
          : ''

      speeds = Object.keys(speeds).map(
        k =>
          typeof speeds[k] === 'object' && speeds[k].condition
            ? `${k} ${speeds[k].number} ft. ${speeds[k].condition}`
            : `${k} ${speeds[k]} ft.`
      )

      return walk ? [walk, ...speeds].join(', ') : speeds.join(', ')
    },

    stats() {
      // Create stats object
      const { str, dex, con, wis, int, cha } = this.model
      return { str, dex, con, wis, int, cha }
    }
  },

  mounted() {
    const { name, trait } = this.model

    if (process.env !== 'production' && trait && trait.entries.entries) {
      console.warn(`${name} has entries that not being displayed`)
    }
  },

  methods: {
    concatKeyVal(o) {
      return Object.keys(o)
        .map(k => `${k} ${o[k]}`)
        .join(', ')
    },

    dmgCon(arr, type) {
      let nested = false

      const flatten = (it, depth = false) => {
        nested = depth

        if (typeof it === 'string') return it

        if (it.special) return it.special

        if (it[type]) {
          let stack = it.preNote ? `${it.preNote} ` : ''

          const toJoin = it[type].map(item => flatten(item, true))

          stack += depth
            ? toJoin.join(depth ? '; ' : ', ')
            : this.conjunctWith(toJoin, 'and')

          stack += it.note ? ` ${it.note}` : ''

          return stack
        }
      }

      return arr.map(it => flatten(it)).join(nested ? '; ' : ', ')
    },

    conjunctWith(arr, conjunction) {
      if (arr.length === 1) return String(arr[0])
      if (arr.length === 2) return arr.join(` ${conjunction} `)
      return `${arr.slice(0, -1).join(', ')} ${conjunction} ${arr.slice(-1)}`
    },

    acToString(stack, cur, idx, arr) {
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

    parseSize(size) {
      return this.sizes[size] || size
    },

    ...mapMutations('encounter', {
      addToEncounter: 'ADD_TO_ENCOUNTER',
      removeFromEncounter: 'REMOVE_FROM_ENCOUNTER'
    })
  }
}
</script>

<style lang="scss" scoped>
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