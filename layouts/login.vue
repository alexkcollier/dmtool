<template>
  <!-- <div> -->
  <nuxt/>
  <!-- </div> -->
</template>

<script>
export default {
  beforeCreate() {
    if (this.$store.state.auth.user !== 'hellothere')
      this.$router.replace({ path: '/' })
  }
}
</script>

<style lang="scss">
</style>
