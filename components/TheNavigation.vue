<template>
  <!-- navigation -->
  <div class="navigation">
    <div class="container">
      <NavigationLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        :label="link.label"
        :icon="link.icon"
        :alt="link.alt"
        :is-active="$route.path.includes(link.to)"
      />
    </div>
  </div>
</template>

<script>
import NavigationLink from '~/components/NavigationLink'

export default {
  name: 'TheNavigation',

  components: {
    NavigationLink,
  },

  data () {
    return {
      links: [
        {
          icon: 'spell-book.svg',
          label: 'Spells',
          to: '/spells',
          alt: 'Spellbook Icon',
        },
        {
          icon: 'chest.svg',
          label: 'Magic Items',
          to: '/magic-items',
          alt: 'Chest Icon',
        },
        {
          icon: 'bestiary.svg',
          label: 'Bestiary',
          to: '/bestiary',
          alt: 'Bestiary Icon',
        },
        {
          icon: 'sword.svg',
          label: 'Encounter',
          to: '/encounter',
          alt: 'Sword Icon',
        },
        {
          icon: 'd20.svg',
          label: 'Roll Dice',
          to: '/roll-dice',
          alt: 'Die Icon',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.navigation {
  $section-offset: 2em;

  background: hsl(60, 19%, 87%);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05), 0 1px 10px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: -$section-offset;
  position: fixed;
  width: 100%;
  z-index: 10;

  .container {
    align-items: center;
    display: flex;
    justify-content: center;
    min-height: 3em;
  }

  @media screen and (max-width: 1023px) {
    bottom: $section-offset;
    box-shadow: 0 -1px 0 0 rgba(0, 0, 0, 0.05), 0 -1px 10px 0 rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% + 0.5em);
  }
}
</style>
