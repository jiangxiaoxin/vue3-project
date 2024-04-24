import { reactive } from 'vue'

export function useStepState() {
  let state = reactive({
    step1: {
      name: '',
      code: ''
    },
    step2: {
      desc: ''
    }
  })
  return state
}
