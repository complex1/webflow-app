<template>
  <Stack gap="md" class="variable-form">
    <Inline
      justify="space-between"
      align="center"
      fullWidth
      v-if="showDeleteButton"
    >
      <Heading v-if="label?.length" :level="5">{{ label }}</Heading>
      <IconButton
        variant="danger"
        size="sm"
        @click="$emit('delete')"
        icon="trash"
      />
    </Inline>
    <Heading v-if="label?.length && !showDeleteButton" :level="5">{{
      label
    }}</Heading>
    <Inline
      class="form-row"
      gap="md"
      v-if="!hasDefaultName"
      align="center"
      justify="space-between"
      fullWidth
    >
      <TextInput
        required
        class="flex-grow"
        v-model="variable.name"
        label="Name"
        placeholder="Name"
      />
      <Checkbox
        class="env-checkbox"
        v-if="(envVarList || []).length > 0"
        v-model="variable.fromEnv"
        @update:modelValue="onChangeEnvBind"
        >Use env variable</Checkbox
      >
    </Inline>
    <TextInput
      v-if="!hasDefaultName"
      v-model="variable.description"
      label="Description"
      placeholder="Description"
      fullWidth
    />
    <SelectInput
      v-if="!hasDefaultType && !variable.fromEnv"
      v-model="variable.type"
      @update:model-value="onChangeDefaultType"
      :options="
        ['string', 'number', 'boolean', 'object'].map((type) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: type,
        }))
      "
      label="Type"
      fullWidth
    />
    <SelectInput
      v-if="variable.fromEnv"
      class="flex-grow"
      v-model="variable.envVarName"
      :options="
        (envVarList || []).map((envVar) => ({
          label: envVar,
          value: envVar,
        }))
      "
      label="Field Name"
    />
    <template v-else>
      <TextareaInput
        v-if="variable.type === 'string'"
        v-model="variable.defaultValue"
        label="Default Value"
        placeholder="Default Value"
        fullWidth
        :rows="2"
      />
      <TextInput
        v-else-if="variable.type === 'number'"
        v-model="variable.defaultValue"
        label="Default Value"
        placeholder="Default Value"
        fullWidth
      />
      <SelectInput
        v-else-if="variable.type === 'boolean'"
        v-model="variable.defaultValue"
        :options="[
          { label: 'True', value: true },
          { label: 'False', value: false },
        ]"
        label="Default Value"
        fullWidth
      />
      <JsonEditor
        v-else
        v-model="variable.defaultValue"
        label="Default Value"
        placeholder="Default Value"
        fullWidth
      />
    </template>
    <Divider v-if="showBottomBorder" />
  </Stack>
</template>

<script setup lang="ts">
import Variable from "@/apifluxCore/classes/variable";

const props = defineProps<{
  label?: string;
  variable: Variable;
  hasDefaultType?: boolean;
  hasDefaultName?: boolean;
  envVarList?: string[];
  showBottomBorder?: boolean;
  showDeleteButton?: boolean;
}>();

const emit = defineEmits<{
  delete: [];
}>();

const onChangeEnvBind = (value: boolean) => {
  if (value) {
    // When binding to env variable, clear the name and set type to string
    props.variable.envVarName = props.envVarList?.[0] || "";
    props.variable.type = "string";
  } else {
    // When unbinding, reset type to string
    props.variable.type = "string";
    props.variable.envVarName = "";
    props.variable.defaultValue = "";
  }
};

const onChangeDefaultType = (newValue: string) => {
  if (newValue === "boolean") {
    props.variable.defaultValue = false;
  } else if (newValue === "number") {
    props.variable.defaultValue = 0;
  } else if (newValue === "object") {
    props.variable.defaultValue = {};
  } else {
    props.variable.defaultValue = "";
  }
};
</script>

<style scoped>
.env-checkbox {
  padding-top: var(--space-5);
}
</style>
