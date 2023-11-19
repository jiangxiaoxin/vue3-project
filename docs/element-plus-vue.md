# element plus vue

1. config provider
2. [x]dialog
3. [x]message

message组件方式有很多学习的点：

    1. 本身导出的 message 并不是个vue组件，而是个方法。这个方法会通过 vue的底层方法 `createVNode` 和 `render` 去按照传入的参数渲染一个真实的组件 `message.vue` 实例出来。
    2. message 本身是个方法，而通过 `message.success = function () {}` 这种方式额外添加了一些快捷使用方法。success 方法内部也只是处理下参数，然后调用了 message 本身.但它提前处理了一下options，其实message方法会再次处理options，那就是两份工

    ```
    messageTypes.forEach((type) => {
    message[type] = (options = {}, appContext) => {
        const normalized = normalizeOptions(options)
        return message({ ...normalized, type }, appContext)
      }
    })
    ```

    3. 最重要的回收就是这句： `render(null, container)`。core仓库里我加了注释

    在`动态渲染组件`里有一个最简单实现，但没有instance的管理，通过instance管理，这样可以保证同时出现多个message实例时，布局位置都是正确的。

    还可以用 vue 里导出的 h函数来做

    4.[x]row 和 col
    
    通过 component 这个 vue内部提供的组件可以使用不同类型的元素来实现外层的包围。

    通过 slot 渲染外部元素。

    通过 flex 布局实现栅格布局。

    通过scss 预处理器函数，快速生成样式