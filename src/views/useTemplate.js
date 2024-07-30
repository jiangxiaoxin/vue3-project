import { ref } from 'vue'

export default {
  setup() {
    const count = ref(110)
    console.log('==123aaa')
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times111.
    </button>`
  // Can also target an in-DOM template:
  // template: '#my-template-element'
}
