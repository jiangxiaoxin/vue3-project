1. 介绍 ref 和 reactive 的使用，对比它们

   - ref 本质也是通过 reactive 实现的，reactive 是 vue 的响应式模块
   - ref 使用要带 .value, reactive 使用就像是普通对象一样

   

2. 对比 watch 和 watchEffect

   * watch 监听一堆目标，当发生变化时，执行回调方法。方法内可以访问别处的响应式数据，且它们改变了并不会导致方法的执行
   * watchEffect 监听自己回调方法内所涉及到的响应式数据，发生变化后，会重新执行方法

3. 



