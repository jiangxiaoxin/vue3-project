import {defineComponent, onMounted, ref, reactive} from "vue"
export default defineComponent({
    setup() {
        const arr = ref<number[]>([])

        const obj = ref<Record<string, any>>({
            name: 'obj',
            children: [1,2,3]
        })

        onMounted(() => {
            (window as any)['arr'] = arr;
            (window as any)['obj'] = obj;
        })

        const handleArr = (action: string) => {
            if(action === 'add') {
                arr.value.push(Math.random())
            } else if(action === 'remove') {
                arr.value.pop()
            } else if(action === 'change') {
                arr.value[0] = Math.random()
            } else if(action === 'reset') {
                arr.value = [Math.random()]
            }
        }

        

        const handleObj = (action: string) => {
            if(action === 'add prop') {
                obj.value['foo'] = 'bar'
            } else if(action === 'change prop') {
                if(obj.value['foo']) {
                    obj.value['foo'] = Math.random()
                } else {
                    obj.value.name = 'name'+ Math.random()
                }
            } else if(action === 'delete prop') {
                delete obj.value.foo
            }
        }

        const state = reactive({
            name: 'state'
        })

        return {
            arr,
            obj,
            handleArr,
            handleObj,
            state
        }
    },

    render() {
        const {handleArr} = this
        return <div>
            <h1>{this.state.name}</h1>
            <p>常用的数据类型就是各种基础类型，数组，对象。</p>
            <p>基础类型数据不用讲，该怎么用怎么用</p>
            <p>数组最重要是 arr.value = [] 后，仍然保持响应式。这其实是把 arr这个ref要引用的数组整体换了一个</p>
            <div v-container>
                <p>以下操作后，arr仍为响应式</p>
                <p>arr.length {this.arr.length}</p>
                <button onClick={() => handleArr('add')}>push</button>
                <button onClick={() => handleArr('remove')}>pop</button>
                <button onClick={() => handleArr('change')}>change first</button>
                <button onClick={() => handleArr('reset')}>set to another arr</button>
                <ol v-container>
                    {
                        this.arr.map(item => {
                            return <li>{item}</li>
                        })
                    }
                </ol>
            </div>

            <div v-container>
                <p>对 obj 进行操作</p>
                <p>obj.value 直接换成另外一个对象也是响应式的</p>
                <button onClick={() => this.handleObj('add prop')}>add prop</button>
                <button onClick={() => this.handleObj('change prop')}>change prop</button>
                <button onClick={() => this.handleObj('delete prop')}>delete prop</button>
                <ul>
                    {
                        Object.keys(this.obj).map(key => {
                            const val:any = this.obj[key]
                            if(Array.isArray(val)) {
                                return <li>
                                    <div style={{marginLeft: '20px'}}>
                                    <p>{key}是个数组</p>
                                    <ul>
                                        {
                                            (val as Array<any>).map(item => {
                                                return <li>{item}</li>
                                            })
                                        }
                                    </ul>
                                    </div>
                                </li>
                            } else {
                                return <li>key:{key}-----value:{val}</li>
                            }
                        })
                    }
                </ul>
            </div>

            
        </div>
    }
})