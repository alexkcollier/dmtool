<template>
  <b-modal
    :active="showResult"
    scroll="keep"
    :width="240"
    @close="$emit('close-result')"
  >
    <div class="card">
      <div class="has-text-centered card-content is-sans-serif">
        <div>
          Total ({{ result.description }})
        </div>
        <div class="is-size-1">
          {{ result.sum }}
        </div>
        <div class="is-size-7">
          Rolls: {{ result.rolls }}
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'CustomRollerResult',

  props: {
    result: {
      type: Object,
      required: true
    },

    showResult: {
      type: Boolean,
      required: true
    }
  }
}
</script>
