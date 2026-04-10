<template>
  <div>
    <input
      type="file"
      accept=".json"
      style="display: none"
      id="ImportFileInput"
      @change="handleFileChange"
    />
    <Button variant="secondary" icon="upload" @click="onImportClick">
      Import
    </Button>
  </div>
</template>
<script setup lang="ts">
import { webFlowService } from '@/services/webflow';


const emit = defineEmits<{
  (e: "import", data: any): void;
}>();

const handleFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = e.target?.result;
      if (json) {
        webFlowService.createFromImport(JSON.parse(json as string)).then(() => {
          emit("import", JSON.parse(json as string));
        });
      }
    };
    reader.readAsText(file);
  }
};

const onImportClick = () => {
  document.getElementById("ImportFileInput")?.click();
};

</script>
<style scoped>
</style>