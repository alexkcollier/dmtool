<template functional>
  <section class="section">
    <div class="container">
      <slot />
    </div>
  </section>
</template>

<script>
export default {
  name: 'BaseContainer'
}
</script>

<style lang="scss">
.section {
  padding: 4.5em 1.5em 1.5em;

  // accounts for navbar moving

  @media screen and (max-width: 1023px) {
    padding: 3em 1.5em 4.5em;
  }
}
</style>
