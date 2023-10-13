import type {DirectiveBinding} from "vue"
// 简单的copy封装，这样需要copy功能的地方就不需要重复构建 copy 那部分功能了
const copy =  {
    mounted: (el: HTMLElement, binding: DirectiveBinding) => {
        el.dataset.copyContent = binding.value

        // 这里通过el添加动态属性其实并不是建议的方式。但为了在卸载时能去掉这些监听事件，只能通过它作为中间桥梁
        el.$copy = () => {
            const textarea = document.createElement('textarea')
            textarea.readOnly = true
            textarea.style.position = 'absolute'
            textarea.style.left = '-9999px'
            textarea.style.opacity = '0'
            textarea.value = el.dataset.copyContent || ''
            document.body.appendChild(textarea)

            textarea.select()
            // 有个比较有名的库叫clipboard.js,它核心也是下面这行代码。其他只是处理各种情况和方便使用而已
            const result = document.execCommand('Copy')
            if(result) {
                console.log('复制成功')
            }
            document.body.removeChild(textarea)
        }

        el.addEventListener("click", el.$copy)
    },
    updated: (el: HTMLElement, binding: DirectiveBinding) => {
        el.dataset.copyContent = binding.value
    },
    beforeUnmount: (el: HTMLElement) => {
        delete el.dataset.copyContent
        el.removeEventListener('click', el.$copy)
    }
}

export default copy