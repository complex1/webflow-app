<template>
  <div v-if="hasErrors" class="validation-error">
    <div class="validation-error-header text-bold flex-v-center text-danger">
      <i class="pi pi-exclamation-triangle"></i>
      <span class="mx-m" >Validation Errors</span>
    </div>
    <div class="validation-error-body">
      <ul class="my-m" >
        <li v-for="(error, index) in errors" :key="index" class="text-danger">
          {{ error.message }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" >
import ErrorMessage from '../../classes/ErrorMessage'
export default {
  name: 'validationErrorComponent',
  props: {
    errors: {
      type: Array as () => ErrorMessage[],
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {
    hasErrors() {
      return this.errors.length > 0;
    }
  },
  watch: {},
  methods: {},
  created () {},
  mounted () {}
}
</script>
<style lang='scss' scoped>
</style>
