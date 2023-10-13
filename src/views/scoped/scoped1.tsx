import { defineComponent, ref } from "vue"
import styles from "./scoped1.module.css"

export default defineComponent({
    name: 'scoped1',
    // ! props 声明很重要，除了基本的声明类型，校验，默认值等，最重要是如果不声明，msg并不会真的传递到setup的props里，而是将这个属性挂载到此处的根div元素上。
    // 最明显的例子就是 style 行内样式传递。不在props里声明style，那传进来的style会挂在div上，而不是在span上
    props: ['style', 'msg'],
    setup(props) {
        // console.log("🚀 ~ file: scoped1.tsx:7 ~ setup ~ props:", props, props.style)

        // console.log("🚀 ~ file: scoped1.tsx:6 ~ setup ~ props:", props.style)

        const count = ref(0)

        const changeCount = () => {
            count.value++;
            console.log(count.value)
        }
        //! 这里不能直接返回 vnode，而是返回 render function。因为组件可以复用，每次使用产生的都是独立的组件
        return () => (
            <div>
                <span style={props.style}>{count.value}</span>
                <button onClick={changeCount}>+</button>
                <p class={styles.scoped1Root}>abc</p>
                <p class={styles.scoped1Root}>123</p>
            </div>
        )
    },

    // 
    // render: () => {
    //     return <div>aaa</div>
    // }
})