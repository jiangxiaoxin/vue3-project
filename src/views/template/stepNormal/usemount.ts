import { onMounted, onUnmounted } from 'vue'

export default function useMounted() {
  onMounted(() => {
    console.log('===>mounted')
  })

  onUnmounted(() => {
    console.log('===>unmounted')
  })
}
