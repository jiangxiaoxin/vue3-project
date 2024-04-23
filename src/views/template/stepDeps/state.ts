import { reactive } from 'vue'
const state = reactive({
  step1: {},
  step2: {},
  step3: {}
})

export function useStepState() {
  return state
}
