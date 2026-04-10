<template>
  <Inline align="center" gap="sm" justify="space-between" fullWidth>
    <TextInput
      class="flex-grow"
      v-if="!variable.fromEnv"
      v-model="variable.defaultValue"
      :label="fieldName"
      placeholder=""
      required
    ></TextInput>
    <SelectInput
      v-if="variable.fromEnv"
      class="flex-grow"
      v-model="variable.envVarName"
      :options="envVarList.map((envVar) => ({
        label: envVar,
        value: envVar,
      }))"
      :label="fieldName"
      required
    />
    <Checkbox class="env-checkbox" v-if="envVarList.length > 0" v-model="variable.fromEnv">Use env variable</Checkbox>
  </Inline>
</template>
<script setup lang="ts">
import type Variable from "@/apifluxCore/classes/variable";
import type { Inline } from "@/components/common";

const props = defineProps<{
  fieldName: string;
  variable: Variable;
  envVarList: string[];
}>();
</script>
<style scoped>
.env-checkbox {
  padding-top: var(--space-5);
}
</style>