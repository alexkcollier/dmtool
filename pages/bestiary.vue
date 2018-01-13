<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <nuxt-link to="/">dmtool</nuxt-link>
      </h1>
      <div class="content">
        <h1>Bestiary</h1>

        <h3 class="title">{{ bestiary.monster[0].name }}</h3>
        <h6>
          <!-- TODO: currently does not work if type is not object literal -->
          <!-- TODO: remove trailing comma from tags -->
          {{ bestiary.monster[0].size }} {{ bestiary.monster[0].type.type }}<template v-if="bestiary.monster[0].type.tags"> (<span v-for="tag in bestiary.monster[0].type.tags" :key="tag">{{ tag }}, </span>)</template>,
          {{ bestiary.monster[0].alignment }}
        </h6>

        <!-- AC/HP/Speed -->
        <div>
          <p>Armor Class: {{ bestiary.monster[0].ac }}</p>
          <p>Hit Points: {{ bestiary.monster[0].hp }}</p>
          <p>Speed: {{ bestiary.monster[0].speed }}</p>
        </div>

        <!-- Stats -->
        <div>
          <table>
            <thead>
              <th>STR</th>
              <th>DEX</th>
              <th>CON</th>
              <th>INT</th>
              <th>WIS</th>
              <th>CHA</th>
            </thead>
            <tbody>
              <tr>
                <td>{{ bestiary.monster[0].str }}</td>
                <td>{{ bestiary.monster[0].dex }}</td>
                <td>{{ bestiary.monster[0].con }}</td>
                <td>{{ bestiary.monster[0].int }}</td>
                <td>{{ bestiary.monster[0].wis }}</td>
                <td>{{ bestiary.monster[0].cha }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Other stats -->
        <div>
          <p v-if="bestiary.monster[0].save">Saving Throws: {{ bestiary.monster[0].save }}</p>
          
          <!-- TODO: Parse skills object -->
          <!-- TODO: Use bold instead of colon -->
          <p v-if="bestiary.monster[0].skill">Skills: {{ bestiary.monster[0].skill }}</p>
          <p v-if="bestiary.monster[0].resist">Damage Resistances: {{ bestiary.monster[0].resist }}</p>
          <p v-if="bestiary.monster[0].immune">Damage Immunities: {{ bestiary.monster[0].immune }}</p>
          <p v-if="bestiary.monster[0].vulnerable">Damage Vulnerabilities: {{ bestiary.monster[0].vulnerable }}</p>
          <p v-if="bestiary.monster[0].conditionImmune">Condition Immunities: {{ bestiary.monster[0].conditionImmune }}</p>
          <p>Senses: <template v-if="bestiary.monster[0].senses">{{ bestiary.monster[0].senses }},</template> passive Perception {{ bestiary.monster[0].passive }}</p>
          <p>Languages: <template v-if="bestiary.monster[0].languages">{{ bestiary.monster[0].languages }}</template><template v-else>&mdash;</template></p>
          <p>Challenge: {{ bestiary.monster[0].cr }}</p>
        </div>
        
        <!-- Traits -->
        <div v-if="bestiary.monster[0].trait">
          <template v-for="trait in bestiary.monster[0].trait">
            <p :key="trait.name"><strong>{{ trait.name }}.</strong> {{ trait.text[0] }}</p>

            <!-- TODO: Currently does not respect spellcasting (innate or learned) or multi-paragraph traits. -->
            <p v-for="p in removeFirst(trait.text)" :key="p.index">{{ p }}</p>
          </template>
        </div>

        <!-- Actions -->
        <div v-if="bestiary.monster[0].action">
          <h2>Actions</h2>
          <template v-for="action in bestiary.monster[0].action">

            <!-- TODO: Attack formatting -->
            <p :key="action.name"><strong>{{ action.name }}.</strong> {{ action.text[0] }}</p>

            <!-- TODO: Currently does not respect spellcasting (innate or learned) or multi-paragraph actions. -->
            <p v-for="p in removeFirst(action.text)" :key="p.index">{{ p }}</p>
          </template>
        </div>

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
      // arr.splice(0, 1) and arr.shift() were creating infinite loops
      if (arr.length > 1) {
        for (let i in arr) {
          r.push(arr[i])
        }
      }
      return r.length > 0 ? r : null
    }
  }
}
</script>

<style>

</style>
