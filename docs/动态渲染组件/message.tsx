import { defineComponent, createApp, h } from 'vue';

// 用 JSX 语法实现一个Vue.js 3.x的组件
const ModuleComponent = defineComponent({
  
    render() {
        return <div>这是一个动态渲染的组件</div>
    }
});

export default ModuleComponent

// 实现动态渲染组件的过程

export const createModule = () => {
  // 创建动态节点DOM
  const dom = document.createElement('div');
  dom.classList.add('my-message-root')
  // 把 DOM 追加到页面 body标签里
  const body = document.querySelector('body') as HTMLBodyElement;

  body.appendChild(dom)
  const app = createApp({
    render() {
      return h(ModuleComponent, {});
    }
  });
 

  // 返回当前组件的操作实例
  // 其中封装了挂载和卸载组件的方法
  return {
    open: () => {
      // 把组件 ModuleComponent 作为一个独立应用挂载在 DOM 节点上
      app.mount(dom);
    },
    close: () => {
      // 卸载组件
      app.unmount();
      // 销毁动态节点
      dom.remove();
    }
  }
}
