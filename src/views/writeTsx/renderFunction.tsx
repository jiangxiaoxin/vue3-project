import { defineComponent, isReactive, isRef, ref } from "vue";

export default defineComponent({
    name: 'TsxRenderComp',
    props: ['msg'],
    setup(props) {
        // console.log("🚀 ~ file: renderFunction.tsx:6 ~ setup ~ props:", props.msg, props, isRef(props), isReactive(props), )

        const value = ref(Math.random())

        const randomValue = () => {
            value.value = Math.random()
        }

        return {
            value,
            randomValue
        }
    },
    
    render() {
        return <div v-container>
            <p>value: {this.value}</p>
            <p>msg from parent: {this.msg}</p>
            <button onClick={this.randomValue}>random</button>
        </div>
    }
})