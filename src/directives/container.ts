// 测试代码时常用的指令,用来区分哪块是哪块的
const container = (el: HTMLElement, binding: any) => {
  if (!el.dataset.devColor) {
    const color = '#' + Math.floor(Math.random() * 0xffffff).toString(16)
    el.dataset.devColor = color
  }

  el.style.border = `2px solid ${el.dataset.devColor}`
  el.style.padding = '10px'
}

export default container
