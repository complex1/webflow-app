<template>
  <div class="json-viewer">
    <div v-if="isExpandable" class="expandable-item" :class="{ 'is-expanded': expanded }">
      <div class="json-key" @click="toggleExpand">
        <span class="expand-icon">{{ expanded ? '▼' : '▶' }}</span>
        <span v-if="keyName" class="key">{{ keyName }}:</span>
        <span class="preview" v-if="!expanded">
          <span class="bracket">{{ isArray ? '[' : '{' }}</span>
          <span class="ellipsis">...</span>
          <span class="bracket">{{ isArray ? ']' : '}' }}</span>
          <span class="item-count">({{ itemCount }} items)</span>
        </span>
      </div>
      
      <div v-if="expanded" class="json-children">
        <div v-for="(value, key) in jsonData" :key="key" class="json-item">
          <json-viewer 
            :json-data="value" 
            :key-name="key"
            :depth="depth + 1"
          ></json-viewer>
        </div>
      </div>
    </div>
    
    <div v-else class="primitive-item">
      <span v-if="keyName" class="key">{{ keyName }}:</span>
      <span class="value" :class="valueType">{{ formattedValue }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'JsonViewer',
  props: {
    jsonData: {
      type: [Object, Array, String, Number, Boolean, null],
      required: true,
    },
    keyName: {
      type: String,
      default: '',
    },
    depth: {
      type: Number,
      default: 0,
    },
    initiallyExpanded: {
      type: Boolean,
      default: false,
    },
    maxExpandDepth: {
      type: Number,
      default: 1, // By default, expand only the first level
    },
  },
  setup(props) {
    const expanded = ref(props.initiallyExpanded || props.depth < props.maxExpandDepth);

    const isExpandable = computed(() => {
      return typeof props.jsonData === 'object' && props.jsonData !== null;
    });

    const isArray = computed(() => {
      return Array.isArray(props.jsonData);
    });

    const itemCount = computed(() => {
      if (props.jsonData === null) return 0;
      return isExpandable.value ? Object.keys(props.jsonData).length : 0;
    });

    const valueType = computed(() => {
      if (props.jsonData === null) return 'null';
      return typeof props.jsonData;
    });

    const formattedValue = computed(() => {
      if (props.jsonData === null) return 'null';
      if (valueType.value === 'string') return `"${props.jsonData}"`;
      return String(props.jsonData);
    });

    const toggleExpand = () => {
      expanded.value = !expanded.value;
    };

    return {
      expanded,
      isExpandable,
      isArray,
      itemCount,
      valueType,
      formattedValue,
      toggleExpand,
    };
  },
});
</script>

<style scoped>
.json-viewer {
  font-size: 10px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  font-size: var(--font-size-small);
  line-height: var(--line-height-small);
  margin-left: 0.5em;
}

.json-key {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
}

.key {
  color: var(--color-secondary);
  margin-right: var(--spacing-small);
}

.expand-icon {
  margin-right: var(--spacing-small);
  display: inline-block;
  width: 1em;
  color: var(--color-text-secondary);
}

.value {
  display: inline;
}

.string {
  color: var(--color-success);
}

.number {
  color: var(--color-info);
}

.boolean {
  color: var(--color-warning);
}

.null {
  color: var(--color-text-secondary);
  font-style: italic;
}

.json-children {
  margin-left: var(--spacing-medium);
}

.json-item {
  margin: var(--spacing-small) 0;
}

.bracket {
  color: var(--color-text-primary);
}

.ellipsis {
  color: var(--color-text-secondary);
  margin: 0 var(--spacing-small);
}

.item-count {
  color: var(--color-text-secondary);
  font-size: 0.8em;
  margin-left: var(--spacing-small);
}

.primitive-item {
  display: flex;
  align-items: center;
}

.expandable-item {
  margin: var(--spacing-small) 0;
}
</style>