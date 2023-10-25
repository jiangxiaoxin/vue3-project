import { reactive, defineComponent, onMounted, watch } from "vue";

export default defineComponent({
    setup() {
        const state = reactive({
            // time: new Date()  // ? 为啥 new Date() 就报错呢
            time: new Date().toLocaleString()
        })
        const changeTime = () => {
            state.time = new Date().toLocaleString()
        }

        watch(state, (newValue) => {
            console.log('state变了', newValue);
            
        })

        watch(() => state.time, (newValue) => {
            console.log('state.time变了', newValue);
            
        })


        return {
            state,
            changeTime,
        }
    },
    render() {
        return (<div>
            <p>{Date.now()}----</p>
            <p>{this.state.time}</p>
            <button onClick={this.changeTime}>123</button>
        </div>)
    }
})