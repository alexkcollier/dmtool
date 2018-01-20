<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Bestiary</h1>


        <!-- Name, size, type and alignment -->
        <h3 class="title">{{ testArr.name }}</h3>
        <h6 class="subtitle">
          {{ testArr.size }}
          <template v-if="testArr.type.length">{{ testArr.type }}, </template>
          
          <!-- Sometimes type has is stored in an object with an array of tags -->
          <template v-else>{{ testArr.type.type }} ({{ arrayJoin(testArr.type.tags, ', ') }}), </template>
          {{ testArr.alignment }}
        </h6>

        <!-- AC/HP/Speed -->
        <div>
          <p>
            <strong>Armor Class</strong>
            {{ testArr.ac }}
          </p>
          <p>
            <strong>Hit Points</strong>
            {{ testArr.hp }}
          </p>
          <p>
            <strong>Speed</strong>
            {{ testArr.speed }}
          </p>
        </div>
        <hr>

        <!-- Stats -->
        <div>
          <table>
            <thead>
              <th v-for="(stat, k) in testArr.stats" :key="stat.index" class="is-uppercase has-text-centered">{{ k }}</th>
            </thead>
            <tbody>
              <tr>
                <td v-for="stat in testArr.stats" :key="stat.index" class="has-text-centered">{{ stat }} ({{ getStatMod(stat) }})</td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr>

        <!-- Other stats -->
        <div>
          <p v-if="testArr.save">
            <strong>Skills</strong>
            {{ testArr.save }}
          </p>
          <p v-if="testArr.skill" class="is-capitalized">
            <strong>Skills</strong>
            {{ concatObjKeyVal(testArr.skill) }}
          </p>
          <p v-if="testArr.resist">
            <strong>Damage Resistances</strong>
            {{ testArr.resist }}
          </p>
          <p v-if="testArr.immune">
            <strong>Damage Immunities</strong>
            {{ testArr.immune }}
          </p>
          <p v-if="testArr.vulnerable">
            <strong>Damage Vulnerabilities</strong>
            {{ testArr.vulnerable }}
          </p>
          <p v-if="testArr.conditionImmune">
            <strong>Condition Immunities</strong>
            {{ testArr.conditionImmune }}
          </p>
          <p>
            <strong>Senses</strong>
            <template v-if="testArr.senses"> {{ testArr.senses }},</template>
            passive Perception {{ testArr.passive }}
          </p>
          <p>
            <strong>Languages</strong>
            <template v-if="testArr.languages"> {{ testArr.languages }}</template>
            <template v-else> &mdash;</template>
          </p>
          <p>
            <strong>Challenge</strong>
            {{ testArr.cr }}
          </p>
        </div>
        <hr>
        
        <!-- Traits -->
        <template v-if="testArr.trait">
          <template v-for="trait in testArr.trait">
            <p :key="trait.name"><strong><i>{{ trait.name }}.</i></strong> {{ trait.text[0] }}</p>
            
            <!-- TODO: Currently does not respect spellcasting (innate or learned) or multi-paragraph traits properly. -->
            <p v-for="p in removeFirst(trait.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- Actions -->
        <template v-if="testArr.action">
          <h2>Actions</h2>
          <template v-for="action in testArr.action">

            <!-- TODO: Attack formatting. Will likely need some sort of js filter. -->
            <p :key="action.name"><strong><i>{{ action.name }}.</i></strong> {{ action.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph actions properly. -->
            <p v-for="p in removeFirst(action.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- Reactions -->
        <template v-if="testArr.reaction">
          <h2>Reactions</h2>
          <template v-for="reaction in testArr.reaction">

            <!-- TODO: Attack formatting -->
            <p :key="reaction.name"><strong><i>{{ reaction.name }}.</i></strong> {{ reaction.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph reactions properly. -->
            <p v-for="p in removeFirst(reaction.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- TODO: Lair actions -->
        <template v-if="testArr.legendaryGroup">
          <h2>Legendary Actions</h2>
          <p>{{ testArr.name }} can take {{ testArr.legendary.length }} legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of anohter creature's turn. {{ testArr.name }} regains spent legendary actions at the start of its turn.</p>
          
          <template v-for="legAction in testArr.legendary">

            <!-- TODO: Attack formatting -->
            <p :key="legAction.name"><strong>{{ legAction.name }}.</strong> {{ legAction.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph legendary actions properly. -->
            <p v-for="p in removeFirst(legAction.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import bestiary from '~/data/bestiary.json'

export default {
  head () {
    return { title: 'Bestiary' }
  },
  data () {
    return {
      bestiary,
      testArr: bestiary.monster[14]
    }
  },
  methods: {
    removeFirst (arr) {
      let r = []
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          r.push(arr[i])
        }
      }
      return r.length > 0 ? r : null
    },
    arrayJoin (arr, sep) {
      let r = arr.join(sep)
      return r
    },
    concatObjKeyVal (obj) {
      let r = Object.keys(obj).reduce((res, key) => {
        return res.concat(key + ' ' + obj[key])
      }, []).join(', ')
      return r
    },
    getStatMod (x) {
      let mod = Math.floor((x - 10) / 2)
      return (mod < 0 ? '' : '+') + mod
    }
  }
}
</script>

<style>

</style>
