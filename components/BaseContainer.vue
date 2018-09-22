<template>
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

<style>
.section {
  padding: 4.5em 1.5em;
}
</style>
