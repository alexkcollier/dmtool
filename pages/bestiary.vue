<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Bestiary</h1>


        <!-- Name, size, type and alignment -->
        <h3 class="title">{{ bestiary.monster[0].name }}</h3>
        <h6 class="subtitle">
          {{ bestiary.monster[0].size }}
          <template v-if="bestiary.monster[0].type.length">{{ bestiary.monster[0].type }}, </template>
          
          <!-- Sometimes type has is stored in an object with an array of tags -->
          <template v-else>{{ bestiary.monster[0].type.type }} ({{ arrayJoin(bestiary.monster[0].type.tags, ', ') }}), </template>
          {{ bestiary.monster[0].alignment }}
        </h6>

        <!-- AC/HP/Speed -->
        <div>
          <p>
            <strong>Armor Class</strong>
            {{ bestiary.monster[0].ac }}
          </p>
          <p>
            <strong>Hit Points</strong>
            {{ bestiary.monster[0].hp }}
          </p>
          <p>
            <strong>Speed</strong>
            {{ bestiary.monster[0].speed }}
          </p>
        </div>
        <hr>

        <!-- Stats -->
        <div>
          <table>
            <thead>
              <th v-for="(stat, k) in bestiary.monster[0].stats" :key="stat.index" class="is-uppercase has-text-centered">{{ k }}</th>
            </thead>
            <tbody>
              <tr>
                <td v-for="stat in bestiary.monster[0].stats" :key="stat" class="has-text-centered">{{ stat }} ({{ getStatMod(stat) }})</td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr>

        <!-- Other stats -->
        <div>
          <p v-if="bestiary.monster[0].save">
            <strong>Skills</strong>
            {{ bestiary.monster[0].save }}
          </p>
          <p v-if="bestiary.monster[0].skill" class="is-capitalized">
            <strong>Skills</strong>
            {{ concatObjKeyVal(bestiary.monster[0].skill) }}
          </p>
          <p v-if="bestiary.monster[0].resist">
            <strong>Damage Resistances</strong>
            {{ bestiary.monster[0].resist }}
          </p>
          <p v-if="bestiary.monster[0].immune">
            <strong>Damage Immunities</strong>
            {{ bestiary.monster[0].immune }}
          </p>
          <p v-if="bestiary.monster[0].vulnerable">
            <strong>Damage Vulnerabilities</strong>
            {{ bestiary.monster[0].vulnerable }}
          </p>
          <p v-if="bestiary.monster[0].conditionImmune">
            <strong>Condition Immunities</strong>
            {{ bestiary.monster[0].conditionImmune }}
          </p>
          <p>
            <strong>Senses</strong>
            <template v-if="bestiary.monster[0].senses"> {{ bestiary.monster[0].senses }},</template>
            passive Perception {{ bestiary.monster[0].passive }}
          </p>
          <p>
            <strong>Languages</strong>
            <template v-if="bestiary.monster[0].languages"> {{ bestiary.monster[0].languages }}</template>
            <template v-else> &mdash;</template>
          </p>
          <p>
            <strong>Challenge</strong>
            {{ bestiary.monster[0].cr }}
          </p>
        </div>
        <hr>
        
        <!-- Traits -->
        <template v-if="bestiary.monster[0].trait">
          <template v-for="trait in bestiary.monster[0].trait">
            <p :key="trait.name"><strong><i>{{ trait.name }}.</i></strong> {{ trait.text[0] }}</p>
            
            <!-- TODO: Currently does not respect spellcasting (innate or learned) or multi-paragraph traits properly. -->
            <p v-for="p in removeFirst(trait.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- Actions -->
        <template v-if="bestiary.monster[0].action">
          <h2>Actions</h2>
          <template v-for="action in bestiary.monster[0].action">

            <!-- TODO: Attack formatting. Will likely need some sort of js filter. -->
            <p :key="action.name"><strong><i>{{ action.name }}.</i></strong> {{ action.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph actions properly. -->
            <p v-for="p in removeFirst(action.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- Reactions -->
        <template v-if="bestiary.monster[0].reaction">
          <h2>Reactions</h2>
          <template v-for="reaction in bestiary.monster[0].reaction">

            <!-- TODO: Attack formatting -->
            <p :key="reaction.name"><strong><i>{{ reaction.name }}.</i></strong> {{ reaction.text[0] }}</p>

            <!-- TODO: Currently does not respect multi-paragraph reactions properly. -->
            <p v-for="p in removeFirst(reaction.text)" :key="p.index">{{ p }}</p>
          </template>
        </template>

        <!-- TODO: Legendary and lair actions -->
        <!-- <div v-for="legendary in bestiary.legendaryGroup" :key="legendary.name">
          {{ legendary.name }}
        </div> -->
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
      bestiary
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
      return mod
    }
  }
}
</script>

<style>

</style>
