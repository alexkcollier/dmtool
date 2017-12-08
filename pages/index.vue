<template>
  <section class="section">
    <div class="container">
      <logo/>
      <h1 class="title">
        dmtool
      </h1>
      <h2 class="subtitle">
        Personal DM tools
      </h2>

      <div class="content">
        <!-- Create section for each rarity -->
        <div class="items" v-for="level in rarities" :key="level.key" style="text-align:left">

          <!-- Only expand one rarity at a time. Always collapse items when changing rarity -->
          <h2 @click="(showRarity === level ? showRarity = null : showRarity = level, showItem = null)">{{ level }}</h2>
          <transition name="fade-grow">
            <div v-if="showRarity === level">

              <!-- Loop through items -->
              <div v-for="item in items.item" :key="item.name" v-if="item.rarity === level">

                <!-- Only display one item at a time -->
                <h3 class="subtitle" @click="showItem === item.name ? showItem = null : showItem = item.name">{{ item.name }}</h3>
                <transition name="fade-grow">
                  <div v-if="showItem === item.name">

                    <!-- Item types, rarity, and attunement -->
                    <h4>
                      <span v-if="item.wondrous">Wondrous item</span>
                      <span v-else>{{ item.type }}</span>
                      <span>, {{ item.rarity }}</span>
                      <span v-if="item.reqAttune === 'YES'"> (requires attunement)</span>
                    </h4>

                    <!-- Iterate item entries -->
                    <!-- TODO: cleaner implementation -->
                    <template v-for="entry in item.entries" >

                      <!-- Paragraphs -->
                      <p v-if="!entry.type">
                        {{ entry }}
                      </p>

                      <!-- Lists -->
                      <ul v-else-if="entry.type =='list'">
                        <li v-for="item in entry.items">{{ item }}</li>
                      </ul>

                      <!-- Tables -->
                      <table v-else-if="entry.type == 'table'">
                        <thead>
                          <tr>
                            <th v-for="label in entry.colLabels">{{ label }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="row in entry.rows">
                            <td v-for="cell in row">{{ cell }}</td>
                          </tr>
                        </tbody>
                      </table>

                      <!-- Entries -->
                      <template v-else-if="entry.type =='entries'">
                        <h5>{{ entry.name }}</h5>
                        <template v-for="entry in entry.entries">

                          <!-- Lists -->
                          <ul v-if="entry.type =='list'">
                            <li v-for="item in entry.items">{{ item }}</li>
                          </ul>

                          <!-- Paragraphs -->
                          <p v-else>
                            {{ entry }}
                          </p>

                        </template>
                      </template>

                      <!-- Highlight entries of unexpected type. -->
                      <p v-else style="color: red;">{{ entry }}</p>

                    </template>
                    <p class="is-italic">{{ item.source }}, page {{ item.page }}</p>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
          <hr>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import items from '~/data/items.json'

export default {
  components: {
    Logo
  },
  data () {
    return {
      items,
      showRarity: null,
      showItem: null,
      rarities: {
        // none: 'None',
        common: 'Common',
        uncommon: 'Uncommon',
        rare: 'Rare',
        veryRare: 'Very Rare',
        legendary: 'Legendary',
        artifact: 'Artifact'
      }
    }
  }
}
</script>

<style lang="scss">
$fade-time: 500ms;

.fade-grow {
  &-enter-active, &-leave-active {
    transition: max-height $fade-time ease-in-out, opacity $fade-time ease-in-out;
    overflow: hidden;
    max-height: 400vh;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
}

.items h2, .items h3 {
  cursor: pointer;
}
</style>
