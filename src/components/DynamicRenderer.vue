<template>
  <div class="dynamic-renderer">
    <WrapperComponent
      v-for="(item, index) in componentList"
      :key="index"
      :data-index="index"
    >
      <component 
        :is="item.component" 
        v-bind="item.props"
        v-on="item.events"
      />
    </WrapperComponent>
  </div>
</template>

<script setup lang="ts">
import { computed, onUpdated } from 'vue'
import WrapperComponent from './WrapperComponent.vue'
import { ElInput, ElButton } from 'element-plus'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/button/style/css'

onUpdated(() => {
  console.log("updated");
  
})

// 组件名称到组件的映射
const componentMap: Record<string, unknown> = {
  input: ElInput,
  button: ElButton,
}

interface ComponentItem {
  component: unknown
  props?: Record<string, unknown>
  events?: Record<string, unknown>
}

interface ConfigItem {
  name: string
  props?: Record<string, unknown>
  events?: Record<string, unknown>
}

const props = defineProps<{
  config: (string | ConfigItem)[]
}>()

const componentList = computed<ComponentItem[]>(() => {
  return props.config.map((item) => {
    const name = typeof item === 'string' ? item : item.name
    const componentProps = typeof item === 'string' ? {} : (item.props || {})
    const componentEvents = typeof item === 'string' ? {} : (item.events || {})

    const component = componentMap[name]
    if (!component) {
      console.warn(`Component "${name}" not found in componentMap`)
      return { component: 'div', props: { innerHTML: `Unknown: ${name}` } }
    }
    return { component, props: componentProps, events: componentEvents }
  })
})
</script>

<style scoped>
.dynamic-renderer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
</style>
