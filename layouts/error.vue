<template>
  <main class="ampersand" style="height:60vh;">
    <div class="has-text-centered" style="position:relative; top:40%;">
      <h1 class="title is-size-1">
        {{ message }}
      </h1>
    </div>
  </main>
</template>

<script>
export default {
  props: ['error'], // eslint-disable-line

  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return this.error.message || '<%= messages.client_error %>'
    }
  }
}
</script>

<style lang="scss" scoped>
.error {
  text-align: center;
}
</style>
