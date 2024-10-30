## 库

### [x] axios

感觉axios也没啥要看的，只要注意怎么使用就行了。本质就是 XHR呀

1. axios的常见封装和使用
2. axios的源码分析。能学到啥。

### vue

1. proxy 的使用

1. ref 和 reactive 多场景测试
2. watch 和 watchEffect 的对比

   这两个都是监听变化，做出反应。

   不同的是：watch 是指定观察的对象，当对象发生变化时，执行回调函数。 watchEffect 是自动收集参数函数里所引用到的响应式数据，自动追踪他们的变化。一旦发生变化，重新执行整个回调函数

3. provide 和 inject 有啥作用？使用场景？

在父级组件里通过provide方法声明一下，”我会提供数据给你们，你们用就行了“。在子级容器里，通过inject注入这份数据，在子组件里就可以使用了。

这份数据没什么特殊性，number，string，boolean，object，等普通数据都可以。还可以是ref，reavtive的响应式数据，并且父组件里数据变了，子组件里是变的

inject 第二个参数可以注入个默认值。

4. [x] teleport 能用来干什么

让组件的实际渲染位置跳出它所在的逻辑位置。最典型的使用场景就是modal，模态框

比如组件a下有个组件b，组件b会渲染在组件a内,a是b的父容器，b是a的子元素.但通过teleport就可以让组件b的实际渲染位置跳出a，而是渲染到指定的元素下，而同时保持组件a和组件b之间的逻辑上的父子组件关系。原来的父子间数据传递关系不变。

teleport 可以嵌套使用。

还可以多个不同的teleport共享同一个父容器。

5. slot 插槽的使用。

很常见的例子，就是那种带自定义显示的组件，到处都是。dialog，form，table

6. keeplive

7. computed

8. scoped 的样式

样式作用域，为了隔离样式而来。在 scoped 标记下的css样式，会在class添加特殊标记，而不在仅仅是个class了。

a. 父组件里有个普通的样式 classA，在子组件里是可以访问到的。并且子组件内可以写同名的样式，不管是写成scoped class 还是普通 class。

如果在子组件内写普通的样式，那么这个样式还会影响到父组件的样式，样式合并。

如果写成scoped class，那么整个样式只会影响子组件，子组件自己定义的样式和父组件的样式合并后成为最终的样式。但子组件的scoped class不会影响父组件的样式

b. 父组件里scoped 包围的样式 classB， 在子组件内无法访问到。子组件内可以写同名样式.

如果子组件也写成 scoped class，那子组件整个class 跟父组件的一点关系也没有，不会影响父组件。

但如果子组件写成普通的 class，那这个class会影响到父组件的样式，最后两个 classB做合并，作为父组件的样式。当然儿子还是只用自己的样式，因为父组件里 classB 是scoped的，只在自己范围内生效.

但如果父组件内的scoped class包裹在 `:deep()`中，那这个scoped class 会影响子组件的。

c. 对于两个同级的兄弟组件，那各自有各自的范围，scoped的样式只应用自己

d. 兄弟组件，两个都写同名的普通 class，不用scoped 限定范围，那谁里面的有效呢？肯定不是都有效，但我也没总结出固定的逻辑。

    8.1 :deep 的用法，它是如何解决问题的

        通过在最后生成的样式上，构建一个更高优先级的选择器

> 在一个元素上添加不同的class，这些class最后肯定要做样式合并，同名的属性最后谁有效呢？抛除 `important` 这种，是看两个样式谁先定义，谁后定义，后定义的覆盖前面定义的

9. 写组件的几种方式

    a. 最常见的 template script style那种方式,写 sfc vue文件

    b. 用tsx文件来写组件，defineComponent包装一下，里面写一个大的setup，最后返回一个render函数，就可以了

    这种tsx的方式，只是用tsx的语法来写vue的组件，用的还是vue的ref，watch这些api，不是用react。这不能搞混了。useState，useEffect 这些是没有的.

    > 有一点非常重要，在.vue文件里，template 里的`{{ count }}`是会自动解出它的value属性，但是在tsx中，人家就不知道了，`<span>{ count.value }</span>`这样才能显示count的值

    tsx 是纯ts代码，它不能写 css，要将css 单独写成文件，然后import进去，使用module css，可以将这些class 当成变量一样绑定

10. 父子之间的props传递

    10.1 如果子组件里不显式的声明props要传递哪些数据进来，那在父组件里，虽然给子组件加了一些属性，但并不会在子组件的props上出现，子组件是无感的。

    10.2 props的声明：

          简单点，可以直接写  `props: ['msg']` 这种，复杂点，可以 `defineProps`

    10.3 显然的，是不可以在子组件里去修改props数据的，不管是整体替换props，还是props.xxx = yyy，都是违反单向数据流的

    10.4 与 react 函数式组件明显的区别：在react里，如果父=>子的数据发生变化，那么子组件，其实就是个函数，会从头走的。但是vue中，setup只执行一次，并不会重新走。

        ```
        这就有个很实际的场景:

        假设由父组件提供一个初始值给子组件，子组件内部以这个值为初始值，然后开展自己的功能，当父组件传递新的初始值时，子组件内部的值要重新设置为新的初始值。
        ```

        在vue3里，可以通过 watch函数，去主动的观察这个初始值属性，然后在发生变化时，通过后面的回调函数去执行重置功能。

            > 这里有个特别要注意的点，整个props是 reactive object，这一点可以用 `isReactive` 去验证。但初始值不是。直接 `watch(props.initValue, () => {})` 不行，可以改写成 getter方法来实现，`watch(() => props.initValue, () => {})`

        在 tsx 里也可以用动态的方法去创建要显示的节点。`writeTsx/loopItem.tsx` 就用方法的形式创建显示对象。这也是应该的，因为已经不是.vue那样子写组件，不能用`v-for`来循环创建对象

    10.5 prop 定义时设置required为true，那就表示这个属性一定要传。这样后面的代码就不需要关心这个属性为空的时候报错。因为都已经声明为必填了，开发时console里也不断的提醒了，使用者还是不传，那就只能说明使用者有问题。为了防止真的因为疏忽而导致代码直接崩了，一般会加个default值，但是加了只是保护，console依然会提示缺少必填项
        prop 定义时，不写required为true，但还是写default值，这个default在属性缺省的情况下，会生效的
11. 写个scrollbar组件？

el-scrollbar就是很好的参照.通过计算中间比例，换算出scrollbar的 thumb位置应该在哪

offsetWidth

offsetHeight

scrollTop

scrollLeft

scrollWidth

scrollHeight

### vue router

### vue query

### react

1. 常见的几个api，使用的场景和注意事项

2. 常见hook的使用。

3. 自定义hook

4. hook库

## web基础

1. 啥是跨域？怎么解决？
2. 缓存策略

   [强缓存和协商缓存](https://juejin.cn/post/6844903717574017031)

   两个都是用来判断浏览器是否可以使用本地已经有的资源，包括html ，css，js， img等。

   不同的是强制缓存不发起请求，浏览器直接就刹停了，服务器一点消息也没有。而协商缓存，是跟服务器协商下，看服务器觉得可不可以用缓存。如果不可以的话，就会发过来新的资源。

   强制缓存命中，code返回为200. 协商缓存命中，code返回是304

## css基础

1. 盒子模型
2. position
3. flex布局
4. grid布局
5. 居中
6. 块元素，行内元素
7. 常见的伪类和伪元素
8. 两个class里定义了属性的不同的值，而一个元素同时写了这两个 class，谁最后有效？

   `scoped/index.vue` 里有这样的例子。谁写在后面，谁就会覆盖前面的样式

## js基础

1. 原型链

2. 引用与值

## 工具链

### vite

vite 在dev模式下用 esbuild进行构建，在prod模式下用的是rollup构建

1. mock 的配置
2. dev server的配置
3. 常用的配置项

console.log 的隐藏

4. vite 插件

打包时在html里写入一些打包信息,比如git

## 项目有关

1. 单点登录
2. 主题切换

明暗主题切换，首先当然是准备2套主题不同的颜色配置。对于组件，不管是明还是暗，都采用同样的 class 命名，但里面具体的颜色，则使用 css variable获取最终的值。准备一套默认的css variable，点击切换主题时，给 html 元素整个加上一个特定的class，然后设置整个class下应该用的 css variable值，这样就实现了简单的主题切换。
