<template functional>
  <nuxt-link
    :to="props.to"
    :class="{ 'active': props.isActive }"
    class="navigation-link is-sans-serif is-size-7"
    no-prefetch
  >
    <img
      v-if="props.icon"
      :src="require('~/assets/' + props.icon)"
      :alt="props.alt"
      class="image is-32x32"
    >
    <div
      v-else
      class="navigation-link-icon"
    />
    {{ props.label }}
  </nuxt-link>
</template>

<script>
export default {
  name: 'NavigationLink',

  props: {
    icon: {
      default: '',
      required: false,
      type: String
    },
    label: {
      required: true,
      type: String
    },
    to: {
      required: true,
      type: String
    },
    alt: {
      required: true,
      type: String
    },
    isActive: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
$navigation-background-color: hsl(60, 19%, 87%);

.navigation-link {
  width: 8em;
  padding: 0.25em;
  text-align: center;

  .image {
    margin: 0 auto;
  }

  &:hover {
    background: darken($navigation-background-color, 10%);
    color: darken(#3d4f5d, 80%);
  }

  &:active {
    background: darken($navigation-background-color, 20%);
  }

  &-icon {
    background: #3d4f5d;
    height: 2em;
    margin: 0.25em auto;
    width: 2em;
  }
}

.active {
  background: darken($navigation-background-color, 5%);

  &:hover {
    background: darken($navigation-background-color, 5%);
    color: #3d4f5d;
  }
}
</style>
