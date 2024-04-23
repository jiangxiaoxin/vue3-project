// 随机底色
const bg = (el: HTMLElement, binding: any) => {
  if (!el.dataset.devBg) {
    const color = Math.floor(Math.random() * 0xffffff).toString(16)
    const alpha = Math.max(Math.floor(Math.random() * 0xff), 0x80).toString(16)
    el.dataset.devBg = '#' + color + alpha
  }
  el.style.backgroundColor = el.dataset.devBg
}

export default bg
