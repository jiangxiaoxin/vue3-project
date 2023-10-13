import { defineComponent, onUpdated, ref, watch, watchEffect } from "vue";

export default defineComponent({
    name: 'setupReturnRender',
    props: ['initValue'],
    setup(props) {
        // console.log("🚀 ~ file: setupReturnRender.tsx:7 ~ setup ~ props:", props)

        const c = ref(props.initValue)

        watch(props, () => {
            console.log('watch props in child', props);
        })

        // ! 这会导致报错，因为initValue 在这里只是个普通的值，它不是响应式数据，直接watch是不行的
        // watch(props.initValue, (newValue, oldValue) => {
        //     console.log('watch init-value in child', props.initValue, newValue, oldValue);
            
        // })

        watch(() => props.initValue, (newv) => {
            console.log("watch init value,", newv);
            c.value = newv
        })
      

        return () => {
            return (

                <div v-container>
                    <p>initValue: {props.initValue}</p>
                    <p>current: {c.value}</p>
                    <button onClick={() => {
                        c.value = Math.random()
                    }}>update c</button>
                </div>
            )
        }
    }
})