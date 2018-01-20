<template>
  <div>
    <!-- Name, size, type and alignment -->
    <a @click="toggleCreature">
      <h3 class="title">{{ model.name }}</h3>
      <h6 class="subtitle">
        {{ model.size }} {{ concatType }}, {{ model.alignment }}
      </h6>
    </a>
    <transition name="fade-grow">
      <div v-if="!collapse">
        <!-- AC/HP/Speed -->
        <div>
          <p>
            <strong>Armor Class</strong>
            {{ model.ac }}
          </p>
          <p>
            <strong>Hit Points</strong>
            {{ model.hp }}
          </p>
          <p>
            <strong>Speed</strong>
            {{ model.speed }}
          </p>
        </div>
        <hr>

        <!-- Stats -->
        <div>
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
        </div>
        <hr>

        <!-- Other stats -->
        <div>
          <p v-if="model.save">
            <strong>Skills</strong>
            {{ model.save }}
          </p>
          <p v-if="model.skill" class="is-capitalized">
            <strong>Skills</strong>
            {{ concatSkill }}
          </p>
          <p v-if="model.resist">
            <strong>Damage Resistances</strong>
            {{ model.resist }}
          </p>
          <p v-if="model.immune">
            <strong>Damage Immunities</strong>
            {{ model.immune }}
          </p>
          <p v-if="model.vulnerable">
            <strong>Damage Vulnerabilities</strong>
            {{ model.vulnerable }}
          </p>
          <p v-if="model.conditionImmune">
            <strong>Condition Immunities</strong>
            {{ model.conditionImmune }}
          </p>
          <p>
            <strong>Senses</strong>
            <template v-if="model.senses"> {{ model.senses }},</template>
            passive Perception {{ model.passive }}
          </p>
          <p>
            <strong>Languages</strong>
            <template v-if="model.languages"> {{ model.languages }}</template>
            <template v-else> &mdash;</template>
          </p>
          <p>
            <strong>Challenge</strong>
            {{ model.cr }}
          </p>
        </div>
        <hr>
        
        <!-- Traits -->
        <template v-if="model.trait">
          <template v-for="trait in model.trait">
            <p :key="trait.index"><strong><i>{{ trait.name }}.</i></strong> {{ trait.text[0] }}</p>
            
            <!-- TODO: Currently does not respect spellcasting (innate or learned) or multi-paragraph traits properly. -->
            <p v-for="p in removeFirst(trait.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- Actions -->
        <template v-if="model.action">
          <h2>Actions</h2>
          <template v-for="action in model.action">

            <!-- TODO: Attack formatting. Will likely need some sort of js filter. -->
            <p :key="action.index"><strong><i>{{ action.name }}.</i></strong> {{ action.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph actions properly. -->
            <p v-for="p in removeFirst(action.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- Reactions -->
        <template v-if="model.reaction">
          <h2>Reactions</h2>
          <template v-for="reaction in model.reaction">

            <!-- TODO: Attack formatting -->
            <p :key="reaction.name"><strong><i>{{ reaction.name }}.</i></strong> {{ reaction.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph reactions properly. -->
            <p v-for="p in removeFirst(reaction.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- TODO: Lair actions -->
        <template v-if="model.legendaryGroup">
          <h2>Legendary Actions</h2>
          <p>The creature can take {{ model.legendary.length }} legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of anohter creature's turn. The creature regains spent legendary actions at the start of its turn.</p>
          
          <template v-for="legAction in model.legendary">

            <!-- TODO: Attack formatting -->
            <p :key="legAction.name"><strong>{{ legAction.name }}.</strong> {{ legAction.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph legendary actions properly. -->
            <p v-for="p in removeFirst(legAction.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>
      </div>
    </transition>
    <hr>
  </div>
</template>

<script>
export default {
  name: 'creature-entries',
  props: {
    model: Object
  },
  data () {
    return { collapse: true }
  },
  computed: {
    concatType () {
      let result = String
      if (this.model.type.length) {
        // Simple creature type
        result = this.model.type
      } else if (this.model.type.tags) {
        // Creature type has tags
        result = this.model.type.type + ' (' + this.model.type.tags.join(', ') + ')'
      } else {
        // Swarms
        result = 'swarm of' + ' ' + this.model.type.swarmSize + ' ' + this.model.type.type + 's'
      }
      return result
    },
    concatSkill () {
      this.concatKeyVal(this.model.skill)
    }
  },
  methods: {
    removeFirst (arr) {
      let r = arr.slice(1)
      return r.length > 0 ? r : null
    },
    concatKeyVal (o) {
      let r = Object.keys(o).reduce((a, k) => {
        return a.concat(k + ' ' + o[k]) // Add combined key-value pair to an array
      }, []).join(', ') // Combine array values to string
      return r
    },
    toggleCreature () {
      this.collapse = !this.collapse
    }
  },
  filters: {
    getStatMod: stat => {
      let mod = Math.floor((stat - 10) / 2)
      let result = stat + ' (' + (mod < 0 ? '' : '+') + mod + ')'
      return result
    }
  }
}
</script>

<style>

</style>
