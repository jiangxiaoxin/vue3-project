<template>
  <div>
    <p class="scoped-parent">子组件内访问不到父组件内 scoped的样式 scoped-parent</p>
    <p class="no-scoped-parent">子组件内可以访问到父组件的普通样式 no-scoped-parent</p>
    <p class="child-same-name">兄弟组件内同名普通样式</p>
  </div>
</template>

<style>
.no-scoped-parent {
  color: blue;
  font-size: 12px;
  text-decoration: line-through;
}

.scoped-parent {
  color: aqua;
  font-size: 80px;
  text-decoration: underline;
  text-decoration-color: black;
}

/* .child-same-name {
  color: bisque;
  font-size: 60px;
  text-decoration: line-through;
} */
</style>
