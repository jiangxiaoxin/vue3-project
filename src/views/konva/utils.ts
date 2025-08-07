// 生成随机颜色的函数
export function getRandomColor() {
    // 方法1: 生成十六进制颜色
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')

    // 方法2: 生成RGB颜色 (可以替换上面的return)
    // const r = Math.floor(Math.random() * 256)
    // const g = Math.floor(Math.random() * 256)
    // const b = Math.floor(Math.random() * 256)
    // return `rgb(${r}, ${g}, ${b})`

    // 方法3: 生成HSL颜色，色彩更丰富 (可以替换上面的return)
    // const h = Math.floor(Math.random() * 360)
    // const s = Math.floor(Math.random() * 100) + '%'
    // const l = Math.floor(Math.random() * 50) + 25 + '%' // 亮度在25%-75%之间
    // return `hsl(${h}, ${s}, ${l})`
}