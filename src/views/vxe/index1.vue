<template>
  <div>
    <div>
      <button @click="modal1 = !modal1">modal 1</button>
      <button @click="modal2 = !modal2">modal 2</button>
      <button @click="handleModal3">modal 3</button>
    </div>
    <div>
      innerShow: {{ modal3Ref?.innerShow}}
    </div>
    <vxe-modal v-model="modal1" title="Hello" width="800" height="400" show-footer>
      <p>another content</p>
    </vxe-modal>
    <vxe-modal v-model="modal2" title="modal2" show-footer>
      <template #header>
        <p>重写header部分</p>
      </template>
      <template #footer>
        <button>1111</button>
        <button>2222</button>
      </template>
    </vxe-modal>
    <Modal3 ref="modal3Ref" />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import Modal3 from './modal.vue'
const modal1 = ref(false)
const modal2 = ref(false)
const modal3Ref = ref(null)

const handleModal3 = () => {
  modal3Ref.value.toggle()
}
</script>
