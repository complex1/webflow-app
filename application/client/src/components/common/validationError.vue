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
<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import type ErrorMessage from '../../classes/ErrorMessage';
import type { ValidationErrorProps } from './types';

export default defineComponent({
  name: 'ValidationError',
  props: {
    errors: {
      type: Array as PropType<ErrorMessage[]>,
      default: () => []
    }
  },
  setup(props) {
    const hasErrors = computed(() => props.errors.length > 0);
    
    return {
      hasErrors
    };
  }
});
</script>
<style lang='scss' scoped>
</style>
